## Tutorial para las credenciales del fleet tracker
Para poder correr el scrapper insertar las credenciales de usuario en las variables de enviroment
### Pasos a seguir
- nano ~/.profile
- agregar export FLEET_API_KEY=<CREDENCIAL> a lo ultimo de todo
- source ~/.profile
- verificar corriendo fleet_srapper.py

## Activar fleet_scrapper sin docker
Dentro de la carpeta de fleet_scrapper generar un virtual environment:
```bash
python3 -m venv .venv
```

Activarlo:
```bash
source .venv/bin/activate
```

Instalar las dependencias:
```bash
pip install -r requirements.txt
```

Crear un archivo .env en base a .env.example:
```
AISSTREAM_API_KEY=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

Ejecutar lo siguiente:
```bash
set -a
source .env
set +a

python3 fleet_scrapper.py
```