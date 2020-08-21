#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path

from nonebot.drivers.fastapi import Driver
from fastapi.staticfiles import StaticFiles


def register_route(driver: Driver, socketio):
    app = driver.server_app

    static_path = str((Path(__file__).parent / ".." / "dist").resolve())

    app.mount("/test",
              StaticFiles(directory=static_path, html=True),
              name="test")
    app.mount("/test/", socketio, name="socketio")
