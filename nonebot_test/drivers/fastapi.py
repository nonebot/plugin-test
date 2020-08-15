#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path

from fastapi.staticfiles import StaticFiles

from nonebot.drivers.fastapi import Driver


def register_route(driver: Driver):
    app = driver.server_app

    static_path = str((Path(__file__).parent / ".." / "dist").resolve())

    app.mount("/test",
              StaticFiles(directory=static_path, html=True),
              name="test")
