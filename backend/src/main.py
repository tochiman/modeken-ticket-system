import os
import json
import base64
import asyncio

from fastapi import Depends, FastAPI, WebSocket
from fastapi.responses import JSONResponse

import mongo
from ws import clients, send_ws, root, ws_user, ws_pass
from basic_auth import verify_from_api
from item import Item

username = os.getenv('MONGO_USER')
password = os.getenv('MONGO_PASSWORD')
noik = os.getenv('NUMBER_OF_ITEM_KIND')

manager = mongo.ModekenSystemManager(username, password)

tickets = {}
item_types = [chr(65+i) for i in range(int(noik))]
for i in item_types:
    tickets[i] = manager.new(i)

app = FastAPI()

@app.get('%s/ready' % root)
async def ready():
    data = {}
    for i, j in tickets.items():
        data[i] = j.get_tickets_ready()
    return JSONResponse(status_code=200, content={'status': 200, 'data':data})

@app.get('%s/wait' % root)
async def wait():
    data = {}
    for i, j in tickets.items():
        data[i] = j.get_tickets_wait()
    return JSONResponse(status_code=200, content={'status': 200, 'data':data})

@app.get('%s/admin/{item_type}' % root)
async def get_item_type(item_type, _ = Depends(verify_from_api)):
    if item_type in item_types:
        i = tickets[item_type]
        data = {'ready': i.get_tickets_ready(), 'wait': i.get_tickets_wait()}
        return JSONResponse(status_code=200, content={'status': 200, 'data': data})
    else:
        data = {'message': f'Not Found: {item_type}'}
        return JSONResponse(status_code=404, content={'status': 404, 'data': data})

@app.post('%s/ticketing' % root)
async def get_tickets(item: Item, _ = Depends(verify_from_api)):
    item_number = tickets[item.itemType].add_ticket()
    data = {'itemNumber': item_number}
    await send_ws({'status': 'add', 'itemNumber': item_number, 'itemType': item.itemType})
    return JSONResponse(status_code=200, content={'status': 200, 'data': data})

@app.post('%s/cancel' % root)
async def cancel(item: Item, _ = Depends(verify_from_api)):
    item_number = item.itemNumber
    item_type = item.itemType
    tickets[item_type].cancel_ticket(item_number)
    await send_ws({'status': 'cancel', 'itemNumber': item_number, 'itemType': item.itemType})
    return JSONResponse(status_code=200, content={'status': 200})

@app.post('%s/to_ready' % root)
async def to_ready(item: Item, _ = Depends(verify_from_api)):
    item_number = item.itemNumber
    item_type = item.itemType
    tickets[item_type].to_ready_ticket(item_number)
    await send_ws({'status': 'move', 'before': 'wait', 'after': 'ready', 'itemNumber': item_number, 'itemType': item.itemType})
    return JSONResponse(status_code=200, content={'status': 200})

@app.post('%s/to_wait' % root)
async def to_wait(item: Item, _ = Depends(verify_from_api)):
    item_number = item.itemNumber
    item_type = item.itemType
    tickets[item_type].to_wait_ticket(item_number)
    await send_ws({'status': 'move', 'before': 'ready', 'after': 'wait', 'itemNumber': item_number, 'itemType': item.itemType})
    return JSONResponse(status_code=200, content={'status': 200})

@app.post('%s/delete' % root)
async def delete(item:  Item, _ = Depends(verify_from_api)):
    item_number = item.itemNumber
    item_type = item.itemType
    tickets[item_type].delete_ticket(item_number)
    await send_ws({'status': 'delete', 'itemNumber': item_number, 'itemType': item.itemType})
    return JSONResponse(status_code=200, content={'status': 200})

@app.post('%s/reset' % root)
async def reset(_ = Depends(verify_from_api)):
    for i in item_types:
        tickets[i].reset_tickets()
        tickets[i].reset_collection()
    await send_ws({'status': 'reset'})
    return JSONResponse(status_code=200, content={'status': 200})

@app.get('%s/collection' % root)
async def get_collection(_ = Depends(verify_from_api)):
    data = {}
    for i, j in tickets.items():
        data[i] = j.get_collection()
    return JSONResponse(status_code=200, content={'status': 200, 'data': data})

@app.websocket('%s/ws' % root)
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    data = await ws.receive_text()
    if base64.b64decode(data.encode()).decode() != (ws_user + ':' + ws_pass):
        await ws.send_json({'status': 'failed'})
        await ws.close()
        return 

    key = ws.headers.get('sec-websocket-key')
    clients[key] = ws

    await ws.send_json({'status': 'successful'})

    while True:
        await asyncio.sleep(10)
