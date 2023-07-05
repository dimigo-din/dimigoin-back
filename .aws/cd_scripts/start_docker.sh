#!/bin/bash

docker run -d \
  --name "dimigoin-back" \
  --restart always \
  --publish 80:3000 \
  295965201041.dkr.ecr.ap-northeast-2.amazonaws.com/dimigoin-back:latest || exit 0