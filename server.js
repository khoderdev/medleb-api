const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const User = require('./backend/models/User');

const app = express();
const port = 9000;
app.use(cors());

// Set up body-parser middleware with increased payload size limit
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Increase the limit as needed

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploaded-images'); // Save uploaded files to the 'uploaded-images' directory
  },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Rename uploaded files with timestamp
//   },
});

const upload = multer({ storage });

/// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new user
app.post('/api/users', upload.single('avatar'), async (req, res) => {
  try {
    let avatarUrl = null;
    if (req.body.avatarUrl) {
      // If avatarUrl is provided as base64 data
      const base64Data = req.body.avatarUrl.replace(/^data:image\/jpeg;base64,/, '');
      const imagePath = path.join(__dirname, 'uploaded-images', `${Date.now()}-avatar.jpg`);
      fs.writeFileSync(imagePath, base64Data, 'base64');
      avatarUrl = `/uploaded-images/${path.basename(imagePath)}`;
    }
    const newUser = await User.create({
      ...req.body,
      avatarUrl,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update existing user
app.put('/api/users/:userId', upload.single('avatar'), async (req, res) => {
  const { userId } = req.params;
  try {
    let avatarUrl = null;
    if (req.body.avatarUrl) {
      // If avatarUrl is provided as base64 data
      const base64Data = req.body.avatarUrl.replace(/^data:image\/jpeg;base64,/, '');
      const imagePath = path.join(__dirname, 'uploaded-images', `${Date.now()}-avatar.jpg`);
      fs.writeFileSync(imagePath, base64Data, 'base64');
      avatarUrl = `/uploaded-images/${path.basename(imagePath)}`;
    }
    const [updated] = await User.update(
      {
        ...req.body,
        avatarUrl,
      },
      { where: { id: userId } }
    );
    if (updated) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
app.delete('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const deleted = await User.destroy({ where: { id: userId } });
    if (deleted) {
      res.status(204).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, This is Node Backend!');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
