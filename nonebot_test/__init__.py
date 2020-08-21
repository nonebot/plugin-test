#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import importlib

import socketio
from nonebot import get_driver
from nonebot.log import logger
from nonebot.drivers import BaseWebSocket
from nonebot.utils import DataclassEncoder

from nonebot_test.view import handle_ws_reverse
from nonebot_test.exception import UnAuthorized, UnknowAdapter, BadRequest

sio = socketio.AsyncServer(async_mode="asgi")
socket_app = socketio.ASGIApp(sio, socketio_path="ws")


def init():
    driver = get_driver()
    try:
        _module = importlib.import_module(
            f"nonebot_test.drivers.{driver.type}")
    except ImportError:
        raise RuntimeError(f"Driver {driver.type} not supported")
    register_route = getattr(_module, "register_route")
    register_route(driver, socket_app)
    logger.info(f"Nonebot test frontend will be running at: "
                f"http://{driver.config.host}:{driver.config.port}/test/")


class WebSocket(BaseWebSocket):
    def __init__(self, sio: socketio.AsyncServer, adapter, data):
        self.adapter = adapter
        self.data = data
        super().__init__(sio)

    @property
    def closed(self) -> bool:
        return True

    async def accept(self):
        raise NotImplementedError

    async def close(self):
        raise NotImplementedError

    async def receive(self) -> dict:
        return self.data

    async def send(self, data: dict):
        text = json.dumps(data, cls=DataclassEncoder)
        data = json.loads(text)
        await self.websocket.emit("api", [self.adapter, data])


@sio.event
async def connect(sid, environ):
    logger.info(f"Test Client {sid} Connected via websocket!")
    # TODO: Save self_id and access_token
    sio.save_session(sid, {"environ": environ})


@sio.event
async def disconnect(sid):
    logger.info(f"Test Client {sid} DisConnected!")


@sio.on("event")
async def handle_event(sid, data):
    try:
        adapter = data[0]
        data = data[1]
        websocket = WebSocket(sio, adapter, data)
        # TODO
        self_id = ""
        access_token = None
        await handle_ws_reverse(adapter, websocket, self_id, access_token)
    except UnAuthorized:
        await sio.emit("exception", {"message": "Wrong access token"})
    except UnknowAdapter:
        await sio.emit("exception", {"message": "Unknow Adapter"})
    except BadRequest:
        await sio.emit(
            "exception",
            {"message": "Bad Request. May be caused by incorrect self_id"})
    except Exception as e:
        logger.error(e)
