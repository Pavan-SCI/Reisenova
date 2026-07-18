import express from 'express';
import multer from 'multer';
import path from 'path';
import { bucket } from '../config/firebaseAdmin.js';

const router = express.Router();

// Use memory storage so the file is kept in a buffer instead of written to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!bucket) return res.status(503).json({ error: 'Firebase Storage is not configured' });

  try {
    const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
    const destination = `uploads/${filename}`;
    const file = bucket.file(destination);

    await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype }, public: true });
    res.json({ imageUrl: `https://storage.googleapis.com/${bucket.name}/${destination}` });
  } catch (error) {
    console.error('Error uploading:', error);
    res.status(500).json({ error: 'Failed to upload' });
  }
});

router.post('/multiple', upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  if (!bucket) {
    return res.status(503).json({ error: 'Firebase Storage is not configured' });
  }

  try {
    const uploadPromises = req.files.map(async (fileObj) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(fileObj.originalname)}`;
      const destination = `uploads/${filename}`;
      const file = bucket.file(destination);

      await file.save(fileObj.buffer, {
        metadata: { contentType: fileObj.mimetype },
        public: true,
      });

      return `https://storage.googleapis.com/${bucket.name}/${destination}`;
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.json({ imageUrls });
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    res.status(500).json({ error: 'Failed to upload multiple images' });
  }
});

export default router;
