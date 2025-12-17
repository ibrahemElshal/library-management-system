# Setup & Run Instructions

## 🐳 Docker Setup (Recommended)

1.  **Prerequisites**: Ensure Docker Desktop is installed and running.
2.  **Start Services**:
    ```bash
    docker-compose up --build -d
    ```
3.  **Access Application**:
    - Server: `http://localhost:5001`
    - Verify: `curl http://localhost:5001`

4.  **Stop Services**:
    ```bash
    docker-compose down
    ```

## 🛠 Local Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    - Ensure `.env` exists (see `README.md` for example)
    - Set `PORT=5001`
    - Ensure MySQL and Redis are running locally.
3.  **Run Application**:
    ```bash
    npm start
    ```
