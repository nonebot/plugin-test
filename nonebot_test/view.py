#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from contextvars import ContextVar

import socketio
from nonebot.log import logger
from nonebot import get_driver
from nonebot.drivers import BaseWebSocket
from nonebot.utils import DataclassEncoder

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


async def handle_ws_reverse(websocket: WebSocket, self_id: str):
    driver = get_driver()

    while not websocket.closed(self_id):
        data = await websocket.receive(self_id)

        adapter = data[0]
        data = data[1]

        if adapter == "websocket.close":
            continue

        if adapter in driver._adapters:
            BotClass = driver._adapters[adapter]
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
        a_t = current_adapter.set(adapter)

        try:
            await bot.handle_message(data)
        except Exception as e:
            logger.error(e)
        finally:
            current_adapter.reset(a_t)
            del driver._clients[self_id]
            websocket.clients[self_id].task_done()
