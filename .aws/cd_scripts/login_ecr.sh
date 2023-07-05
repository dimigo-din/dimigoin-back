#!/bin/bash

aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 295965201041.dkr.ecr.ap-northeast-2.amazonaws.com || exit 0