#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from typing import Optional

from nonebot import get_driver
from nonebot.typing import WebSocket

from nonebot_test.exception import UnAuthorized, UnknowAdapter, BadRequest


async def handle_ws_reverse(adapter: str, websocket: WebSocket, self_id: str,
                            access_token: Optional[str]):
    driver = get_driver()

    secret = driver.config.secret
    if secret is not None and secret != access_token:
        raise UnAuthorized

    if not self_id or self_id in driver._clients:
        raise BadRequest

    if adapter in driver._adapters:
        BotClass = driver._adapters[adapter]
        bot = BotClass(driver,
                       "websocket",
                       driver.config,
                       self_id,
                       websocket=websocket)
    else:
        raise UnknowAdapter

    driver._clients[self_id] = bot

    try:
        data = await websocket.receive()

        if data:
            await bot.handle_message(data)
    finally:
        del driver._clients[self_id]
