const express = require('express');
const fs = require('fs');
const path = require('path');
const notesDB = require('./db/db.json')
const uuid = require('./uuid');
const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      Note_id: uuid(),
    };


    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedReviews = JSON.parse(data);

        // Add a new review
        parsedReviews.push(newReview);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/reviews.json',
          JSON.stringify(parsedReviews, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting Note');
  }
});

// GET request for a specific Note's upvotes
app.get('/api/upvotes/:Note_id', (req, res) => {
  console.info(`${req.method} request received to get upvotes for a Note`);
  for (let i = 0; i < Notes.length; i++) {
    const currentNote = Notes[i];
    if (currentNote.Note_id === req.params.Note_id) {
      res.status(200).json({
        message: `The Note with ID ${currentNote.Note_id} has `,
        upvotes: currentNote.upvotes,
      });
      return;
    }
  }
  res.status(404).json('Note ID not found');
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
)
