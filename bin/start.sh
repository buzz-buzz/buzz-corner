#!/bin/sh

if [ -n "$1" ]; then
    PORT=$1
fi

if [ -n "$2" ]; then
    APP_NAME=$2
fi

if [ -z "$PORT" ]; then
    echo "port no set"
    exit 1
fi

if [ -z "$APP_NAME" ]; then
    echo "app name not set"
    exit 1
fi

################################
#     START PM2 INSTANCE	   #
################################
if [ -n "$PORT" ]; then
	echo "Listening on port: $PORT"
	echo "NODE_ENV = $NODE_ENV"
	export PORT
fi

export NODE_ENV
export PORT

CURRENT_PATH=`dirname $0`
CORNER_ENV=$NODE_ENV PORT=$PORT pm2 start "./app.js" --name "$APP_NAME"
exit $?