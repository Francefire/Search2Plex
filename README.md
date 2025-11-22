# Search2Plex

A web application for automated music library management that downloads FLAC audio files from URLs provided in CSV format, tags them with metadata, and organizes them for Plex Media Server.

## Overview

Search2Plex is a full-stack application that streamlines the process of building a music library. Users upload CSV files containing music metadata and download URLs, and the system automatically downloads, tags, and organizes the files for use with Plex.

## Features

- 🔐 **Secure Authentication** - Supabase-based user authentication with JWT tokens
- 📤 **CSV Upload** - Simple web interface for uploading music metadata
- 🎵 **Automatic Download** - Downloads FLAC audio files from provided URLs
- 🏷️ **Metadata Tagging** - Automatically tags files with artist, title, and album information using FFmpeg
- 📁 **File Organization** - Saves processed files to a designated directory
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 🎨 **Modern UI** - Clean, dark-themed interface built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Supabase Auth UI** for authentication

### Backend
- **Node.js** with Express and TypeScript
- **Supabase** for authentication
- **FFmpeg** for audio file processing
- **csv-parse** for CSV parsing
- **Axios** for file downloads

## Project Structure

```
Search2Plex/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── App.tsx    # Main app component with auth and upload UI
│   │   ├── main.tsx   # Entry point
│   │   └── supabaseClient.ts
│   └── package.json
├── backend/            # Express backend API
│   ├── src/
│   │   ├── index.ts   # Main server with upload endpoint
│   │   ├── auth.ts    # Supabase JWT authentication middleware
│   │   └── processor.ts # CSV processing and file download logic
│   └── package.json
├── docker-compose.yml  # Docker orchestration
├── .env.example        # Environment variables template
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- FFmpeg installed (for backend processing)
- Supabase account and project

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:3000
```

### Local Development

**Backend:**
```bash
cd backend
npm install
cp ../.env .env  # Copy env file to backend directory
npm run dev     # Runs on port 3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev     # Runs on port 5173
```

### Docker Deployment

```bash
docker-compose up -d
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Music files saved to: `./plex-media/music`

## Usage

1. **Sign up / Log in** - Create an account or log in using Supabase authentication
2. **Prepare CSV** - Create a CSV file with the following columns:
   - `Index` - Track number
   - `Title` - Song title
   - `Artist` - Artist name
   - `Album` - Album name
   - `Duration` - Track duration
   - `FLAC URL` - Direct download URL for the FLAC file
3. **Upload** - Upload your CSV file through the web interface
4. **Processing** - The backend automatically:
   - Downloads each FLAC file
   - Tags it with metadata (title, artist, album)
   - Saves it to `/data/music` (or `./plex-media/music` in Docker)
5. **Access in Plex** - Point your Plex Media Server to the output directory

### CSV Format Example

```csv
Index,Title,Artist,Album,Duration,FLAC URL
1,Song One,Artist Name,Album Name,3:45,https://example.com/song1.flac
2,Song Two,Artist Name,Album Name,4:12,https://example.com/song2.flac
```

## Implementation Task List

### ✅ Completed Features
- [x] Project structure setup
- [x] Frontend authentication with Supabase
- [x] Backend Express server
- [x] File upload endpoint
- [x] Supabase JWT authentication middleware
- [x] Environment variable configuration
- [x] CSV parsing
- [x] FLAC file download from URLs
- [x] FFmpeg metadata tagging
- [x] File organization to destination directory
- [x] Docker Compose configuration
- [x] Protected upload endpoint
- [x] Error handling for missing auth
- [x] Frontend UI with Tailwind CSS
- [x] Backend CORS support

### 🚧 In Progress / Potential Improvements
- [ ] Progress tracking for file downloads
- [ ] Frontend notifications for processing status
- [ ] WebSocket support for real-time progress updates
- [ ] Batch processing status display
- [ ] Error reporting in frontend UI
- [ ] Download retry logic for failed files
- [ ] Duplicate file detection
- [ ] File validation before processing
- [ ] Support for additional audio formats (MP3, M4A, etc.)
- [ ] Advanced metadata editing
- [ ] User file history and management
- [ ] Admin dashboard

### 📋 Future Enhancements
- [ ] Album artwork download and embedding
- [ ] Playlist generation
- [ ] Integration with music metadata APIs (MusicBrainz, Discogs)
- [ ] Automatic folder organization by artist/album
- [ ] Multi-user support with separate libraries
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Search and filter uploaded files
- [ ] API rate limiting
- [ ] Comprehensive logging system
- [ ] Unit and integration tests

## API Endpoints

### `GET /health`
Health check endpoint (public)

**Response:** `OK`

### `POST /upload`
Upload CSV file for processing (requires authentication)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body:** CSV file

**Response:**
```json
{
  "message": "File uploaded successfully. Processing started."
}
```

## Security

- All upload endpoints require valid Supabase JWT authentication
- Tokens are verified on each request
- Environment variables keep sensitive credentials secure
- CORS enabled for frontend communication

## Troubleshooting

**Server won't start:**
- Ensure `.env` file exists in the backend directory
- Verify all environment variables are set correctly

**Authentication errors:**
- Check Supabase URL and anon key are correct
- Ensure user is logged in on the frontend

**Files not processing:**
- Check backend logs for errors
- Verify FFmpeg is installed and accessible
- Ensure download URLs are valid and accessible

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
