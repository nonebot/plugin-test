#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path

from nonebot.drivers.fastapi import Driver
from fastapi.staticfiles import StaticFiles

from nonebot_plugin_test import (TEST_HTML_PATH, TEST_WS_PATH, TEST_INFO_PATH,
                                 TEST_PLUGIN_PATH, TEST_MATCHER_PATH,
                                 TEST_CONFIG_PATH)
from nonebot_plugin_test.view import handle_project_info, handle_getting_plugins
from nonebot_plugin_test.view import handle_getting_matchers, handle_getting_config


def register_route(driver: Driver, socketio):
    app = driver.server_app

    static_path = str((Path(__file__).parent / ".." / "dist").resolve())

    app.get(TEST_INFO_PATH)(handle_project_info)
    app.get(TEST_PLUGIN_PATH)(handle_getting_plugins)
    app.get(TEST_MATCHER_PATH)(handle_getting_matchers)
    app.get(TEST_CONFIG_PATH)(handle_getting_config)

    app.mount(TEST_HTML_PATH,
              StaticFiles(directory=static_path, html=True),
              name="test")
    app.mount(TEST_WS_PATH, socketio, name="socketio")
