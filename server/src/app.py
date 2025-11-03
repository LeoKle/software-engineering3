import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    await broadcast(payload)
    return {"message": "Message added"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        for msg in messages:
            await websocket.send_text(msg.model_dump_json())
        while True:
            raw_text = await websocket.receive_text()
            data = json.loads(raw_text)
            msg = Message(sender=data["sender"], message=data["message"])
            messages.append(msg)
            await broadcast(msg)
    except WebSocketDisconnect:
        connections.remove(websocket)


async def broadcast(message: Message):
    for connection in connections.copy():
        try:
            await connection.send_text(message.model_dump_json())
        except:
            connections.remove(connection)
