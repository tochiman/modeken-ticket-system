# docker compose exec python test/send_ws.py

import os
import asyncio
import base64

import websockets

ws_user = os.getenv('WEBSOCKET_USER')
ws_pass = os.getenv('WEBSOCKET_PASSWORD')

root = os.getenv('ROOT_PATH')
auth = base64.b64encode(f'{ws_user}:{ws_pass}'.encode()).decode()

async def hello():
    uri = 'ws://localhost:8080%s/ws' % root
    async with websockets.connect(uri) as ws:
        await ws.send(auth)
        d = await ws.recv()
        print(d)
        while True:
            d = await ws.recv()
            print(d)

asyncio.run(hello())