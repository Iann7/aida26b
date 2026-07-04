import asyncio
import websockets
import json
from datetime import datetime, timezone
import os
import uuid 
import psycopg
fleet_id = []
FLEET_API_KEY_ENV = "FLEET_API_KEY"

MMSI_MID_COUNTRIES = {
    "201": "AL",
    "205": "BE",
    "209": "CY",
    "211": "DE",
    "215": "MT",
    "219": "DK",
    "224": "ES",
    "225": "ES",
    "228": "FR",
    "232": "GB",
    "235": "GB",
    "244": "NL",
    "247": "IT",
    "248": "MT",
    "255": "PT",
    "257": "NO",
    "259": "NO",
    "261": "PL",
    "263": "PT",
    "265": "SE",
    "266": "SE",
    "271": "TR",
    "304": "AG",
    "305": "AG",
    "306": "CW",
    "309": "BS",
    "310": "BM",
    "311": "BS",
    "319": "KY",
    "338": "US",
    "366": "US",
    "367": "US",
    "368": "US",
    "369": "US",
    "370": "PA",
    "371": "PA",
    "372": "PA",
    "373": "PA",
    "374": "PA",
    "375": "VC",
    "376": "VC",
    "477": "HK",
    "503": "AU",
    "505": "NZ",
    "563": "SG",
    "564": "SG",
    "565": "SG",
    "566": "SG",
    "701": "AR",
    "710": "BR",
    "720": "BO",
    "725": "CL",
    "730": "CO",
    "735": "EC",
    "740": "FK",
    "745": "PY",
    "755": "PE",
    "770": "UY",
    "775": "VE",
}


def mmsi_flag_country(mmsi):
     return MMSI_MID_COUNTRIES.get(str(mmsi)[:3])


def first_present(*values):
     for value in values:
          if value not in (None, ""):
               return value
     return None


def to_number(value):
     if value in (None, ""):
          return None
     try:
          return float(value)
     except (TypeError, ValueError):
          return None


def ship_dimensions(static_data):
     dimension = static_data.get("Dimension") or static_data.get("Dimensions") or {}
     to_bow = to_number(first_present(dimension.get("A"), dimension.get("ToBow")))
     to_stern = to_number(first_present(dimension.get("B"), dimension.get("ToStern")))
     to_port = to_number(first_present(dimension.get("C"), dimension.get("ToPort")))
     to_starboard = to_number(first_present(dimension.get("D"), dimension.get("ToStarboard")))

     length = (to_bow or 0) + (to_stern or 0) if to_bow is not None or to_stern is not None else None
     width = (to_port or 0) + (to_starboard or 0) if to_port is not None or to_starboard is not None else None
     return length, width


def connect_db():
     return psycopg.connect(
          host      = os.environ["DB_HOST"],
          port      = os.environ.get("DB_PORT","5432"),
          dbname    = os.environ["DB_NAME"],
          user      = os.environ["DB_USER"],
          password  = os.environ["DB_PASSWORD"]  
     )


def upsert_vessel(db_connection, mmsi, name=None, vessel_type=None, length_m=None, width_m=None):
    flag_country = mmsi_flag_country(mmsi)

    with db_connection.cursor() as cur:
        cur.execute(
            """
                INSERT INTO vessels (mmsi, name, vessel_type, flag_country, length_m, width_m)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (mmsi) DO UPDATE SET
                    name = COALESCE(EXCLUDED.name, vessels.name),
                    vessel_type = COALESCE(EXCLUDED.vessel_type, vessels.vessel_type),
                    flag_country = COALESCE(EXCLUDED.flag_country, vessels.flag_country),
                    length_m = COALESCE(EXCLUDED.length_m, vessels.length_m),
                    width_m = COALESCE(EXCLUDED.width_m, vessels.width_m)
            """,
            (mmsi, name, vessel_type, flag_country, length_m, width_m),
        )


def save_position(db_connection,message):
    if message["MessageType"] != "PositionReport":
         return
    ais_message = message["Message"]["PositionReport"]
    metadata    = message.get("MetaData") or {}
    mmsi        = str(ais_message["UserID"])
    latitude    = ais_message["Latitude"]
    longitude   = ais_message["Longitude"]
    name        = first_present(metadata.get("ShipName"), metadata.get("shipName"))
    print(f"SHIP ID: {mmsi}")
    with db_connection.cursor() as cur:
        upsert_vessel(db_connection, mmsi, name=name)
        cur.execute(
            """
                INSERT INTO positions (id,vessel_mmsi,latitude,longitude,recorded_at)
                VALUES (%s,%s,%s,%s,NOW())
            """,
              (str(uuid.uuid4()),mmsi,latitude,longitude),
        )
        db_connection.commit()


def save_ship_static_data(db_connection, message):
    if message["MessageType"] != "ShipStaticData":
         return

    static_data = message["Message"]["ShipStaticData"]
    metadata = message.get("MetaData") or {}
    mmsi = str(first_present(static_data.get("UserID"), metadata.get("MMSI")))

    if not mmsi or mmsi == "None":
         return

    length_m, width_m = ship_dimensions(static_data)
    name = first_present(static_data.get("Name"), static_data.get("ShipName"), metadata.get("ShipName"))
    vessel_type = first_present(static_data.get("Type"), static_data.get("ShipType"))

    print(f"SHIP STATIC DATA: {mmsi}")
    upsert_vessel(
        db_connection,
        mmsi,
        name=name,
        vessel_type=str(vessel_type) if vessel_type is not None else None,
        length_m=length_m,
        width_m=width_m,
    )
    db_connection.commit()

async def connect_ais_stream(db_connection):
    if FLEET_API_KEY_ENV not in os.environ:
            raise RuntimeError(f"{FLEET_API_KEY_ENV} not found in env.")
    try:
        async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
            subscribe_message = {"APIKey": os.environ.get(FLEET_API_KEY_ENV), 
                                 "BoundingBoxes": [
                                        [
                                             [-57.0, -80.0],
                                             [-20.0, -52.0]
                                        ]
                                   ]
                                 } 
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
                elif message_type == "ShipStaticData":
                     save_ship_static_data(db_connection,message)
    finally:
         db_connection.close()

def main():
    print("trying to connect")
    db_connection = connect_db()
    print("connection succesful")
    asyncio.run(connect_ais_stream(db_connection))
if __name__ == "__main__":
    main()
