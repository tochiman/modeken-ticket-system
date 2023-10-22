import os
import json
import asyncio

root = os.getenv('ROOT_PATH')
ws_user = os.getenv('WEBSOCKET_USER')
ws_pass = os.getenv('WEBSOCKET_PASSWORD')

clients = {}

async def send_ws(data):
    data = json.dumps(data)
    for key, client in list(clients.items()):
        try:
            await client.send_text(data)
            try:
                await asyncio.wait_for(client.receive_text(), timeout=5)
            except:
                await client.close()
                del clients[key]
        except:
            pass 