import os
import asyncio
import json
import base64

import websockets

root = os.getenv('ROOT_PATH')
ws_user = os.getenv('WEBSOCKET_USER')
ws_pass = os.getenv('WEBSOCKET_PASSWORD')
ws_admin_user = os.getenv('WEBSOCKET_ADMIN_USER')
ws_admin_pass = os.getenv('WEBSOCKET_ADMIN_PASSWORD')

async def send(data):
    uri = 'ws://localhost:8080%s/ws/callback' % root
    async with websockets.connect(uri) as websocket:
        await websocket.send(base64.b64encode((ws_admin_user + ':' + ws_admin_pass).encode()))
        status = await websocket.recv()
        if status == 'successful':
            await websocket.send(data)

async def send_ws(data):
    data = json.dumps(data)
    await send(data)