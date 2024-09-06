// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const Text = require('./models/Text');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/qna', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to get embeddings by calling the Python script
const getEmbedding = (text) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['embedding.py', text]);

    pythonProcess.stdout.on('data', (data) => {
      const embedding = JSON.parse(data.toString());
      resolve(embedding);
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
};

// Endpoint to add new text with its embedding to MongoDB
app.post('/addText', async (req, res) => {
  const { text } = req.body;
  try {
    const embedding = await getEmbedding(text);

    const newText = new Text({ text, embedding });
    await newText.save();
    
    res.json({ message: 'Text added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to query the text based on a question
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  try {
    const questionEmbedding = await getEmbedding(question);

    // Fetch all texts from the database
    const texts = await Text.find();
    
    // Calculate cosine similarity between question embedding and stored text embeddings
    const cosineSimilarity = (vec1, vec2) => {
      const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
      const magnitudeA = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
      const magnitudeB = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };

    let bestMatch = null;
    let highestSimilarity = -1;

    texts.forEach(textObj => {
      const similarity = cosineSimilarity(questionEmbedding, textObj.embedding);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = textObj;
      }
    });

    res.json({ answer: bestMatch ? bestMatch.text : 'No relevant answer found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
