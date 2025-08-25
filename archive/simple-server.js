import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Starting simple backend server...');

const app = express();
const PORT = 5000;

// Create upload directories
const uploadDirs = ['uploads', 'uploads/images', 'uploads/documents', 'uploads/temp'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created upload directory: ${dir}`);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple backend server is running' });
});

// Team member upload endpoint
app.post('/admin/dashboard/about-settings/team', upload.single('image'), (req, res) => {
  try {
    console.log('📤 Team member upload request received');
    console.log('File info:', req.file);
    console.log('Body data:', req.body);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    // Move file to images directory
    const finalPath = path.join('uploads/images', `team_${Date.now()}_${req.file.filename}`);
    fs.renameSync(req.file.path, finalPath);
    
    const imageUrl = `/uploads/images/${path.basename(finalPath)}`;
    
    // Mock team member data
    const teamMember = {
      _id: Date.now().toString(),
      name: req.body.name || 'Test Member',
      role: req.body.role || 'Developer',
      image: imageUrl,
      bio: req.body.bio || 'Test bio',
      fun_fact: req.body.fun_fact || 'Loves coding',
      skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : ['JavaScript'],
      social: req.body.social ? JSON.parse(req.body.social) : {},
      order: parseInt(req.body.order) || 1,
      status: 'active'
    };
    
    res.json({
      success: true,
      message: 'Team member created successfully',
      data: {
        aboutSettings: {
          team_members: [teamMember]
        }
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Get about settings
app.get('/admin/dashboard/about-settings', (req, res) => {
  res.json({
    success: true,
    data: {
      aboutSettings: {
        about_numbers: {
          projects_completed: "50+",
          client_satisfaction: "100%",
          support_availability: "24/7",
          team_members: "10+"
        },
        team_members: [],
        journey_milestones: []
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple backend server running on http://localhost:${PORT}`);
  console.log(`📘 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Team upload endpoint: http://localhost:${PORT}/admin/dashboard/about-settings/team`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
