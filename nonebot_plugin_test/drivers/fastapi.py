#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path

from nonebot.drivers.fastapi import Driver
from fastapi.staticfiles import StaticFiles

from nonebot_plugin_test.view import handle_project_info, handle_getting_plugins
from nonebot_plugin_test.view import handle_getting_matchers, handle_getting_config


def register_route(driver: Driver, socketio):
    app = driver.server_app

    static_path = str((Path(__file__).parent / ".." / "dist").resolve())

    app.get("/test/info")(handle_project_info)
    app.get("/test/plugins")(handle_getting_plugins)
    app.get("/test/matchers")(handle_getting_matchers)
    app.get("/test/config")(handle_getting_config)

    app.mount("/test",
              StaticFiles(directory=static_path, html=True),
              name="test")
    app.mount("/test_ws/", socketio, name="socketio")
