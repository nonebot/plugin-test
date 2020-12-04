#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import importlib
from asyncio import Queue

import socketio
from nonebot import get_driver
from nonebot.log import logger
from socketio.exceptions import ConnectionRefusedError

from nonebot_plugin_test.view import WebSocket, handle_ws_reverse

sio = socketio.AsyncServer(async_mode="asgi")
socket_app = socketio.ASGIApp(sio, socketio_path="socket")


def init():
    driver = get_driver()
    try:
        _module = importlib.import_module(
            f"nonebot_plugin_test.drivers.{driver.type}")
    except ImportError:
        logger.warning(f"Driver {driver.type} not supported")
        return
    register_route = getattr(_module, "register_route")
    register_route(driver, socket_app)
    host = str(driver.config.host)
    port = driver.config.port
    if host in ["0.0.0.0", "127.0.0.1"]:
        host = "localhost"
    logger.opt(colors=True).info(f"Nonebot test frontend will be running at: "
                                 f"<b><u>http://{host}:{port}/test/</u></b>")


websocket = WebSocket(sio)


@sio.event
async def connect(sid, environ):
    driver = get_driver()
    self_id = environ.get("HTTP_X_SELF_ID")
    access_token = environ.get("HTTP_AUTHORIZATION")

    secret = driver.config.secret
    if secret is not None and secret != access_token:
        logger.error(f"Test Client {self_id} from {sid} auth check failed!")
        raise ConnectionRefusedError("Authorization Failed")

    if not self_id or self_id in websocket.clients:
        logger.error(
            f"Test Client {self_id} from {sid} conflict from annother!")
        raise ConnectionRefusedError("Conflict Connection")

    logger.info(f"Test Client {self_id} from {sid} Connected!")
    await sio.save_session(sid, {"self_id": self_id})
    websocket.clients[self_id] = Queue()
    sio.start_background_task(handle_ws_reverse, websocket, self_id)


@sio.event
async def disconnect(sid):
    session = await sio.get_session(sid)
    await websocket.put(session["self_id"], ["websocket.close", {}])
    del websocket.clients[session["self_id"]]
    logger.info(f"Test Client {session['self_id']} from {sid} DisConnected!")


@sio.on("event")
async def handle_event(sid, data):
    session = await sio.get_session(sid)
    await websocket.put(session["self_id"], data)


init()
