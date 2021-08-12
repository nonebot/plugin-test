#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import random
import asyncio
from asyncio import Queue
from typing import Dict, Type
from contextvars import ContextVar
from dataclasses import dataclass, field

import socketio
from nonebot.log import logger
from nonebot import get_driver
from nonebot.utils import DataclassEncoder
from nonebot.matcher import matchers, Matcher
from nonebot.plugin import get_loaded_plugins, Plugin
from nonebot.drivers import WebSocket as BaseWebSocket

from nonebot_plugin_test.utils import AutoEncoder, WEBSOCKET_CLOSE

current_adapter = ContextVar("current_adapter")


@dataclass
class WebSocket(BaseWebSocket):
    sio: socketio.AsyncServer = None  # type: ignore
    clients: Dict[str, Queue] = field(default_factory=dict)

    @property
    def closed(self) -> bool:
        raise NotImplementedError

    async def accept(self):
        raise NotImplementedError

    async def close(self):
        raise NotImplementedError

    async def receive(self, sid: str) -> list:
        return await self.clients[sid].get()

    async def receive_bytes(self):
        raise NotImplementedError

    async def put(self, sid, data: list):
        await self.clients[sid].put(data)

    async def send(self, data: str):
        await self.sio.emit("api", [current_adapter.get(), data])

    async def send_bytes(self, data: bytes):
        raise NotImplementedError


async def _bot_handle_message(sid, bot, adapter, data):
    a_t = current_adapter.set(adapter)

    try:
        await bot.handle_message(data)
    except Exception as e:
        logger.error(e)
    finally:
        current_adapter.reset(a_t)

        bot.request.clients.get(sid) and bot.request.clients[sid].task_done()


async def handle_ws_reverse(websocket: WebSocket, sid: str, environ: dict):
    driver = get_driver()

    while True:
        data = await websocket.receive(sid)

        if data == WEBSOCKET_CLOSE:
            del websocket.clients[sid]
            return

        adapter = data[0]
        data = data[1]

        if adapter.lower() not in driver._adapters:
            await websocket.sio.emit("exception",
                                     {"message": "Unknown Adapter"})
            continue

        BotClass = driver._adapters[adapter.lower()]
        self_id = environ.get("HTTP_X_SELF_ID",
                              str(random.randint(10000000, 20000000)))

        bot = BotClass(self_id, websocket)

        driver._clients[self_id] = bot

        asyncio.create_task(_bot_handle_message(sid, bot, adapter, data))


async def handle_project_info():
    cwd = os.getcwd()
    return {"status": 200, "data": {"name": os.path.basename(cwd), "dir": cwd}}


async def handle_getting_plugins():
    plugins = get_loaded_plugins()

    def _plugin_to_dict(plugin: Plugin):
        return {
            "name": plugin.name,
            "module": plugin.module.__file__,
            "matcher": len(plugin.matcher)
        }

    return {"status": 200, "data": list(map(_plugin_to_dict, plugins))}


async def handle_getting_matchers():
    matcher_dict = {}

    def _matcher_to_dict(matcher: Type[Matcher]):
        return {
            "type": matcher.type,
            "module": matcher.module_name,
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
