import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processCSV } from './processor.js';
import { requireAuth } from './auth.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure upload directory exists
const UPLOAD_DIR = '/tmp/uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/health', (req, res) => {
    res.send('OK');
});

// Protected Upload Endpoint
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Start processing in background
    processCSV(req.file.path).catch(err => {
        console.error('Background processing error:', err);
    });

    res.json({ message: 'File uploaded successfully. Processing started.' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
