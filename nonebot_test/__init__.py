#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# import os
# from typing import Tuple, Optional
import importlib

from nonebot import get_driver
from nonebot.log import logger


def init():
    driver = get_driver()

    # TODO: Register adapter

    _module = importlib.import_module(f"nonebot_test.drivers.{driver.type}")
    register_route = getattr(_module, "register_route")
    register_route()
    logger.info(f"Nonebot test frontend will be running at: "
                f"http://{driver.config.host}:{driver.config.port}/test/")
