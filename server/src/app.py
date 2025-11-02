from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import asyncio

app = FastAPI()

class Message(BaseModel):
    sender: str
    message: str

messages: list[Message] = []
connections: list[WebSocket] = []


@app.get("/messages")
async def get_messages():
    return {"messages": [m.model_dump() for m in messages]}


@app.post("/messages")
async def post_message(payload: Message):
    messages.append(payload)
    await broadcast(f"{payload.sender}: {payload.message}")
    return {"message": "Message added"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        for msg in messages:
            await websocket.send_text(f"{msg.sender}: {msg.message}")
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        connections.remove(websocket)


async def broadcast(message: str):
    for connection in connections:
        try:
            await connection.send_text(message)
        except:
            connections.remove(connection)
