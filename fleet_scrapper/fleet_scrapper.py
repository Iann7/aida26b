import asyncio
import websockets
import json
from datetime import datetime, timezone
import os
import uuid 
import psycopg
fleet_id = []
FLEET_API_KEY_ENV = "FLEET_API_KEY"
def connect_db():
     return psycopg.connect(
          host      = os.environ["DB_HOST"],
          port      = os.environ.get("DB_PORT","5432"),
          dbname    = os.environ["DB_NAME"],
          user      = os.environ["DB_USER"],
          password  = os.environ["DB_PASSWORD"]  
     )
def save_position(db_connection,message):
    if message["MessageType"] != "PositionReport":
         return
    
    ais_message = message["Message"]["PositionReport"]
    mmsi        = str(ais_message["userID"])
    latitude    = ais_message["Latitude"]
    longitude   = ais_message["Longitude"]
    with db_connection.cursor() as cur:
        cur.execute(
            """
                INSERT INTO vessels (MMSI)
                values (%s)
                ON CONFLICT (MMSI) DO NOTHING
            """,
            (mmsi,),
        )
        cur.execute(
            """
                INSERT INTO positions (id,vessel_mmsi,latitude,longitude,recorded_at)
                VALUES (%s,%s,%s,%s,NOW())
            """,
              (str(uuid.uuid4()),mmsi,latitude,longitude),
        )
        db_connection.commit()

async def connect_ais_stream(db_connection):
    if FLEET_API_KEY_ENV not in os.environ:
            raise RuntimeError(f"{FLEET_API_KEY_ENV} not found in env.")
    try:
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

                if message_type == "PositionReport":
                     save_position(db_connection,message)
    finally:
         db_connection.close()

def main():
    db_connection = connect_db()
    asyncio.run(connect_ais_stream(db_connection))
if __name__ == "__main__":
    main()