const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const Image = require('./models/Image');

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gallerie',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, isPublic, userId } = req.body;
    const newImage = new Image({
      url: req.file.path,
      title,
      description,
      tags: tags ? tags.split(',') : [],
      isPublic: isPublic === 'true',
      userId: userId || 'anonymous',
      createdAt: new Date()
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/images', async (req, res) => {
  try {
    const images = await Image.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/my-images', async (req, res) => {
  try {
    const { userId } = req.query;
    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
