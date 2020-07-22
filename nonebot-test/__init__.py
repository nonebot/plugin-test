#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from typing import Tuple, Optional


def get_template_static() -> Tuple[Optional[str], Optional[str]]:
    path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "dist")
    template = os.path.join(path, "index.html")
    static = os.path.join(path, "static")
    if os.path.isdir(path) and os.path.isfile(template) and os.path.isdir(
            static):
        return template, static
    return None, None
