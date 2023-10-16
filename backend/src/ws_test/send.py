# docker compose exec python test/send_ws.py

import os
import asyncio
import base64
import json

import websockets

ws_admin_user = os.getenv('WEBSOCKET_ADMIN_USER')
ws_admin_pass = os.getenv('WEBSOCKET_ADMIN_PASSWORD')

root = os.getenv('ROOT_PATH')
auth = base64.b64encode(f'{ws_admin_user}:{ws_admin_pass}'.encode()).decode()

async def hello():
    uri = 'ws://localhost:8080%s/ws/callback' % root
    async with websockets.connect(uri) as ws:
        await ws.send(auth)
        d = await ws.recv()
        print(d)
        await ws.send(json.dumps({'status': 'test'}))

asyncio.run(hello())