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
        try {
          const embedding = JSON.parse(data.toString());  // Parse the JSON response
          resolve(embedding);
        } catch (error) {
          console.error('Error parsing embedding:', error);
          reject('Failed to parse embedding from Python script.');
        }
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.error('Python script error:', data.toString());
        reject(data.toString());
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`Python script exited with code ${code}`);
        }
      });
    });
  };
  

// Endpoint to add new text with its embedding to MongoDB
// Endpoint to add new text with its embedding to MongoDB
app.post('/addText', async (req, res) => {
    const { text } = req.body;
    try {
      const embedding = await getEmbedding(text);  // Get embeddings from Python script
  
      // Ensure the embedding is correctly stored in the embedding field
      const newText = new Text({ text, embedding });
      await newText.save();
      
      res.json({ message: 'Text and embedding added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Endpoint to query the text based on a question
app.post('/ask', async (req, res) => {
    const { question } = req.body;
  
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
  
    try {
      console.log(`Question received: ${question}`);
      const questionEmbedding = await getEmbedding(question);
      console.log(`Embedding generated for question: ${questionEmbedding}`);
  
      // Fetch all texts from the database
      const texts = await Text.find();
      console.log(`Texts fetched from database: ${texts.length}`);
  
      if (!texts || texts.length === 0) {
        return res.status(404).json({ error: 'No texts found in the database' });
      }
  
      // Calculate cosine similarity between question embedding and stored text embeddings
      const cosineSimilarity = (vec1, vec2) => {
        if (!vec1 || !vec2 || vec1.length !== vec2.length) {
          return 0; // If vectors are invalid, return 0 similarity
        }
      
        const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
        const magnitudeA = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
      };
      
  
      let bestMatch = null;
      let highestSimilarity = -1;
  
      texts.forEach(textObj => {
        if (!textObj.embedding) {
          console.error(`Text entry "${textObj.text}" has no embedding!`);
          return;
        }
      
        const similarity = cosineSimilarity(questionEmbedding, textObj.embedding);
        console.log(`Similarity with text "${textObj.text}": ${similarity}`);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = textObj;
        }
      });
      
  
      res.json({ answer: bestMatch ? bestMatch.text : 'No relevant answer found' });
    } catch (error) {
      console.error('Error processing question:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
