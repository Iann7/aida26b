import asyncio
import websockets
import json
from datetime import datetime, timezone
import os
fleet_id = []
FLEET_API_KEY_ENV = "FLEET_API_KEY"
async def connect_ais_stream():
    if FLEET_API_KEY_ENV not in os.environ:
            raise RuntimeError(f"{FLEET_API_KEY_ENV} not found in env.")
    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {"APIKey": os.environ.get(FLEET_API_KEY_ENV), 
                             "BoundingBoxes": [[[-56,-75],[13,-23]]]} 
                            # Required!
                             #"FiltersShipMMSI": ["368207620", "367719770", "211476060"], # Optional!
                             #"FilterMessageTypes": ["PositionReport"]} # Optional!

        subscribe_message_json = json.dumps(subscribe_message)
        await websocket.send(subscribe_message_json)

        async for message_json in websocket:
            message = json.loads(message_json)
            message_type = message["MessageType"]
            print(message)
            #if message_type == "PositionReport":
            #    # the message parameter contains a key of the message type which contains the message itself
            #    ais_message = message['Message']['PositionReport']
            #    ship_id = ais_message['UserID']
            #    print(f"[{datetime.now(timezone.utc)}] ShipId: {ship_id} Latitude: {ais_message['Latitude']} Latitude: {ais_message['Longitude']}")
            #    if ship_id in fleet_id:
            #        print(f"A ESTE YA LO VI: {ship_id}")
            #    else:
            #        fleet_id.append(ship_id)
            #        print(f"TOTAL SHIPS:{len(fleet_id)}")
if __name__ == "__main__":
    asyncio.run(connect_ais_stream())