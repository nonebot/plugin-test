#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json


class AutoEncoder(json.JSONEncoder):

    def default(self, o):
        try:
            return super().default(o)
        except Exception as e:
            return str(o)
