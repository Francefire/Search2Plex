# Search2Plex Deployment Walkthrough

This guide explains how to deploy the Search2Plex application.

## Prerequisites
- Docker & Docker Compose (or Coolify)
- Supabase Project (URL and Anon Key)

## Configuration
1.  Copy `.env.example` to `.env` (if running locally) or configure these variables in Coolify.
    ```bash
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_ANON_KEY=your-anon-key
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    VITE_BACKEND_URL=https://your-backend-url.com # (or http://localhost:3000 for local)
    ```

## Local Development
1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Docker / Coolify Deployment
The project includes a `docker-compose.yml` file.

1.  **Coolify**:
    - Create a new Service -> "Docker Compose".
    - Paste the contents of `docker-compose.yml`.
    - **Important**: You must set the Environment Variables in Coolify for *both* build time (for Frontend) and runtime.
    - Map the volume `./plex_media` to your actual Plex media path on the host if needed.

2.  **Manual Docker**:
    ```bash
    docker-compose up --build -d
    ```

## Usage
1.  Open the Frontend URL.
2.  Log in with your Supabase credentials.
3.  Upload a CSV file with the required columns: `Index, Title, Artist, Album, Duration, FLAC URL`.
4.  The backend will:
    - Parse the CSV.
    - Download the FLAC files.
    - Tag them with Title, Artist, Album.
    - Save them to the mapped `/data/music` directory.
