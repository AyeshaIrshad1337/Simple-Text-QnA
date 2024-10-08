# Text QnA System with Embeddings and MongoDB

This project is a simple **Question and Answer (QnA) System** using **Text Embeddings** and **MongoDB**. It allows users to store text content in a MongoDB database, generate embeddings for the text using a pre-trained model, and later query the stored content by asking questions. The system compares the question embedding with stored text embeddings to find the most relevant answer.

## Features

- Store text and its corresponding embeddings in MongoDB.
- Generate text embeddings using **Hugging Face Sentence Transformers**.
- Ask questions and retrieve the most relevant stored text based on cosine similarity of embeddings.
- Powered by **Node.js** for the API and **Python** for embedding generation.

## Impact

This system allows for semantic search through stored text content using machine learning embeddings. By leveraging embeddings, the system understands the meaning of text and retrieves relevant answers even when there is no exact keyword match between the question and the stored text. It can be useful in building intelligent knowledge bases, FAQs, or customer support systems.

---

## Project Structure

```
Text-QnA/
│
├── models/             
│   └── Text.js          # MongoDB Schema for storing text and embeddings
│
├── node_modules/        # Node.js dependencies
│
├── embedding.py         # Python script to generate embeddings
│
├── server.js            # Main Node.js server file
│
├── package.json         # Node.js package manager file
│
└── README.md            # Documentation for the project
```

---

## Prerequisites

1. **MongoDB**: You must have a MongoDB instance running locally or on a server.
2. **Node.js**: The backend server is built using Node.js, so you will need Node.js installed.
3. **Python**: The embedding generation is done in Python, so Python 3.x must be installed.
4. **Sentence Transformers**: Install the sentence-transformers library in Python for embeddings.

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Text-QnA.git
cd Text-QnA
```

### 2. Install Node.js Dependencies

Run the following command to install the Node.js dependencies:

```bash
npm install
```

### 3. Install Python Dependencies

Make sure you have Python installed, then install the necessary Python packages:

```bash
pip install sentence-transformers
```

### 4. Set Up MongoDB

Ensure that MongoDB is installed and running on your machine or server. You can install MongoDB [here](https://www.mongodb.com/try/download/community).

If MongoDB is running locally, you don’t need to change any connection strings.

---

## Usage

### 1. Start the Node.js Server

After setting up all dependencies, you can start the Node.js server by running:

```bash
node server.js
```

The server will run on `http://localhost:3000`.

### 2. Adding Text and Embeddings to MongoDB

You can add a piece of text and generate its embedding by making a `POST` request to the `/addText` endpoint.

Example using **PowerShell**:

```bash
Invoke-WebRequest -Uri http://localhost:3000/addText `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{ "text": "The Eiffel Tower is located in Paris, France." }'
```

You should see a response like:

```json
{
  "message": "Text and embedding added successfully"
}
```

The text and its embedding will now be stored in MongoDB.

### 3. Asking a Question

You can ask a question, and the system will return the most relevant stored text based on embeddings.

Example using **PowerShell**:

```bash
Invoke-WebRequest -Uri http://localhost:3000/ask `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{ "question": "Where is the Eiffel Tower?" }'
```

The server will respond with the most relevant answer based on the stored embeddings.

Example response:

```json
{
  "answer": "The Eiffel Tower is located in Paris, France."
}
```

### 4. Retrieve All Stored Texts

You can add an additional endpoint to retrieve all the stored texts for inspection. You can do this by querying the database directly from MongoDB or by adding an endpoint to the Node.js server.

---

## Technical Details

### Embedding Generation

The embeddings are generated using **Hugging Face's Sentence Transformers**, specifically the `all-MiniLM-L6-v2` model. These embeddings represent the semantic meaning of the text as a vector. When you query the system with a question, it generates an embedding for the question and compares it with the stored text embeddings using **cosine similarity**.

### Cosine Similarity

The similarity between two embeddings (the stored text and the query) is calculated using **cosine similarity**, which measures the cosine of the angle between two vectors in a multi-dimensional space. The text with the highest similarity score is returned as the answer.

---

## Potential Use Cases

1. **Knowledge Base**: Create a QnA system where users can store and query relevant documents.
2. **Customer Support**: Answer questions based on a pre-defined set of support documents or FAQs.
3. **Semantic Search**: Enhance search functionality by retrieving relevant content based on semantic meaning, not just keywords.

---

## Contributions

Feel free to open issues or submit pull requests to contribute to the project.

---

## License

This project is licensed under the MIT License.

---

### Explanation of the `README.md`

1. **Project Overview**: Brief explanation of what the project does and the impact of using embeddings for text-based queries.
2. **Project Structure**: Provides a basic understanding of how the project is organized.
3. **Installation & Setup**: Detailed instructions for installing dependencies, setting up MongoDB, and running the project.
4. **Usage**: Example commands to add text, ask questions, and view data stored in MongoDB.
5. **Technical Details**: Explains embedding generation, cosine similarity, and the underlying logic of the system.
6. **Use Cases**: Lists potential applications for the project.
7. **Contributions and License**: Information on how to contribute and the project's licensing.
