import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


class Message:
    sender: str
    message: str


messages: list[str] = []
connections: list[WebSocket] = []


@app.get("/messages")
async def get_messages():
    return {"messages": messages}


@app.post("/messages")
async def post_message(payload: dict):
    msg = payload.get("message")
    if msg:
        messages.append(msg)
        # push the message to all connected WebSocket clients
        await broadcast(msg)
    return {"message": "Message added"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        # Optionally send all existing messages on connect
        for msg in messages:
            await websocket.send_text(msg)
        while True:
            # keep connection alive
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        connections.remove(websocket)


async def broadcast(message: str):
    """Send message to all connected websockets"""
    for connection in connections:
        try:
            await connection.send_text(message)
        except:
            connections.remove(connection)
