const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/opinionsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Schema
const opinionSchema = new mongoose.Schema({
  name: String,
  email: String,
  topic: String,
  content: String,
  wordCount: Number,
  price: Number
});

const Opinion = mongoose.model('Opinion', opinionSchema);

// Route to handle form submission
app.post('/submit-opinion', async (req, res) => {
  try {
    const newOpinion = new Opinion(req.body);
    await newOpinion.save();
    res.status(201).json({ message: 'Opinion saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});
// Route to get all opinions
app.get('/opinions', async (req, res) => {
  try {
    const opinions = await Opinion.find().sort({ _id: -1 }); // newest first
    res.json(opinions);
  } catch (error) {
    console.error('Error fetching opinions:', error);
    res.status(500).json({ error: 'Failed to fetch opinions' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

