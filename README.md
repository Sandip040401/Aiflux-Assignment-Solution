
---

# Temperature Monitoring System

This repository contains a real-time temperature monitoring system with the following components:
1. Python scripts (`publisher.py` and `subscriber.py`) for publishing and subscribing to temperature data.
2. A Node.js server (TypeScript) that uses Prisma to store temperature data along with timestamps into a PostgreSQL database.
3. A PostgreSQL database running in Docker.
4. A React.js (TypeScript) frontend styled with Tailwind CSS to display temperature data graphically in real time.


## Installation and Setup

### 1. Backend Setup (Node.js)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your PostgreSQL connection details.

4. You can get it from Aiven.io [https://aiven.io/] or use docker to create locally.
    Using Docker
   To get a PostgreSQL connection using Docker, follow these steps:

    ### 1. Install Docker
    Make sure Docker is installed and running on your system. You can download it from [here](https://www.docker.com/get-started).

    ### 2. Run the Postgres Container
   
    ```bash
    docker-compose up -d
    ```
    This command will start the PostgreSQL container in detached mode. It will bind the PostgreSQL service to port `5432` on your local machine.
    
    ### 3. Update Your `.env` File
    In your `backend` directory, create or update the `.env` file with the following environment variables to match the values in the `docker-compose.yml` file:
    
    ```plaintext
    DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase
    ```
    ### 4. Verify the Connection with Prisma
    Once Docker is running the PostgreSQL container, you can verify the connection by running:
    
    ```bash
    npx prisma migrate dev
    ```
    Prisma will connect to the PostgreSQL database defined in the `.env` file and run any migrations if needed.

7. Start the Node.js server:
   ```bash
   npm start
   ```


### 2. Frontend Setup (React.js)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your server url [https://localhost:5000]

4. Start the React development server:
   ```bash
   npm run dev
   ```
