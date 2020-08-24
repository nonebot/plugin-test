#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from nonebot.log import logger
from nonebot import get_driver
from nonebot.typing import WebSocket


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

        try:
            await bot.handle_message(data)
        except Exception as e:
            logger.error(e)
        finally:
            del driver._clients[self_id]
            websocket.clients[self_id].task_done()
