import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
const DOWNLOAD_DIR = '/data/music'; // This will be mapped to the Docker volume
// Ensure download directory exists (for local dev and Docker)
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}
export const processCSV = async (filePath) => {
    console.log(`Processing CSV: ${filePath}`);
    const parser = fs.createReadStream(filePath).pipe(parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
    }));
    for await (const record of parser) {
        try {
            await processRecord(record);
        }
        catch (err) {
            console.error(`Failed to process record: ${JSON.stringify(record)}`, err);
        }
    }
    // Cleanup CSV after processing
    fs.unlinkSync(filePath);
    console.log('CSV processing complete.');
};
const processRecord = async (record) => {
    const url = record['FLAC URL'];
    if (!url) {
        console.warn('No URL found for record', record);
        return;
    }
    // Sanitize filename
    const safeTitle = record.Title.replace(/[^a-z0-9]/gi, '_');
    const safeArtist = record.Artist.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${safeArtist} - ${safeTitle}.flac`;
    const tempPath = path.join('/tmp', fileName);
    const finalPath = path.join(DOWNLOAD_DIR, fileName);
    console.log(`Downloading: ${record.Title} by ${record.Artist}`);
    // 1. Download
    await downloadFile(url, tempPath);
    // 2. Tag and Move (using ffmpeg)
    // ffmpeg can copy the stream and add metadata
    await new Promise((resolve, reject) => {
        ffmpeg(tempPath)
            .outputOptions('-c', 'copy', '-metadata', `title=${record.Title}`, '-metadata', `artist=${record.Artist}`, '-metadata', `album=${record.Album}`)
            .save(finalPath)
            .on('end', () => {
            console.log(`Tagged and saved: ${finalPath}`);
            fs.unlinkSync(tempPath); // Remove temp file
            resolve();
        })
            .on('error', (err) => {
            console.error(`Error tagging file ${fileName}:`, err);
            reject(err);
        });
    });
};
const downloadFile = async (url, dest) => {
    const writer = fs.createWriteStream(dest);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};
