 🚗 Parking API - Nelumbo Test

API REST en **NestJS** para la gestión de parqueaderos, usuarios y control de vehículos.  
Se comunica con un **microservicio de correos** para el envío simulado de notificaciones.

---
## 📂 Estructura del proyecto

  parking-api/
├── src/
│ ├── auth/
│ ├── users/ 
│ ├── parking/ 
│ ├── current-parking/ 
│ ├── history-parking/ 
│ ├── app.module.ts # Configuración principal
│ └── main.ts # Punto de entrada
├── .env # Variables de entorno
├── package.json # Dependencias y scripts
└── README.md # Documentación

---

## 🛠️ Requisitos

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **Docker** (opcional, recomendado para BD)

---

## 🐘 Levantar la base de datos con Docker

Ejecuta el siguiente comando para crear el contenedor de PostgreSQL:

```bash
docker run --name parkingPG \
  -e POSTGRES_PASSWORD=ParkingPass \
  -e POSTGRES_DB=parkingDB \
  -e POSTGRES_USER=AdminP \
  -p 5432:5432 \
  -d postgres:alpine


## ⚙️ Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JulianQuirozG/parking.git
   cd parking

2. Instalar dependencias:
    npm install


3. Crear un archivo .env en la raíz con las siguientes variables:
    DBHOST='localhost'
    DBPORT=5432
    DBUSER='AdminP'
    DBPASSWORD='ParkingPass'
    DBNAME='parkingDB'
    JWTSECRET='NELUMBO'  # microservicio de correos
    MICROSERVICEHOST='localhost:3001'

4. Ejecutar el servidor en watch mode:

    npm run start:dev
    El servicio quedará disponible en:
    http://localhost:3000   