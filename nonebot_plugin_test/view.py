#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import asyncio
from contextvars import ContextVar
from nonebot import adapters

import socketio
from nonebot.log import logger
from nonebot import get_driver
from nonebot.matcher import matchers
from nonebot.drivers import BaseWebSocket
from nonebot.utils import DataclassEncoder
from nonebot.plugin import get_loaded_plugins

from nonebot_plugin_test.utils import AutoEncoder

current_adapter = ContextVar("current_adapter")


class WebSocket(BaseWebSocket):

    def __init__(self, sio: socketio.AsyncServer):
        self.clients = {}
        super().__init__(sio)

    def closed(self, self_id) -> bool:
        return not bool(self.clients.get(self_id))

    async def accept(self):
        raise NotImplementedError

    async def close(self):
        raise NotImplementedError

    async def receive(self, self_id) -> list:
        return await self.clients[self_id].get()

    async def put(self, self_id, data: list):
        await self.clients[self_id].put(data)

    async def send(self, data: dict):
        text = json.dumps(data, cls=DataclassEncoder)
        data = json.loads(text)
        await self.websocket.emit("api", [current_adapter.get(), data])


async def _bot_handle_message(bot, adapter, data):
    driver = get_driver()
    a_t = current_adapter.set(adapter)

    try:
        await bot.handle_message(data)
    except Exception as e:
        logger.error(e)
    finally:
        current_adapter.reset(a_t)
        if "post_type" in data:
            del driver._clients[bot.self_id]

        bot.websocket.clients.get(
            bot.self_id) and bot.websocket.clients[bot.self_id].task_done()


async def handle_ws_reverse(websocket: WebSocket, self_id: str):
    driver = get_driver()

    while not websocket.closed(self_id):
        data = await websocket.receive(self_id)

        adapter = data[0]
        data = data[1]

        if adapter == "websocket.close":
            continue

        if adapter.lower() in driver._adapters:
            BotClass = driver._adapters[adapter.lower()]
            bot = BotClass(driver,
                           "websocket",
                           driver.config,
                           self_id,
                           websocket=websocket)
        else:
            await websocket.websocket.emit("exception",
                                           {"message": "Unknown Adapter"})
            continue

        driver._clients[self_id] = bot

        asyncio.create_task(_bot_handle_message(bot, adapter, data))


async def handle_project_info():
    cwd = os.getcwd()
    return {"status": 200, "data": {"name": os.path.basename(cwd), "dir": cwd}}


async def handle_getting_plugins():
    plugins = get_loaded_plugins()

    def _plugin_to_dict(plugin):
        return {
            "name": plugin.name,
            "module": plugin.module.__file__,
            "matcher": len(plugin.matcher)
        }

    return {"status": 200, "data": list(map(_plugin_to_dict, plugins))}


async def handle_getting_matchers():
    matcher_dict = {}

    def _matcher_to_dict(matcher):
        return {
            "type": matcher.type,
            "module": matcher.module,
            "handlers": len(matcher.handlers),
            "priority": matcher.priority,
            "temp": matcher.temp or bool(matcher.expire_time),
            "block": matcher.block
        }

    for priority in matchers.keys():
        matcher_dict[priority] = list(map(_matcher_to_dict, matchers[priority]))

    return {"status": 200, "data": matcher_dict}


async def handle_getting_config():
    driver = get_driver()

    config = driver.config
    return {
        "status": 200,
        "data": json.loads(json.dumps(config.dict(), cls=AutoEncoder))
    }
