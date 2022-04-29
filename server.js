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

// GET route for home page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received`);
  return res.json(notesDB);
});

app.post('/api/notes', (req, res) =>{
 // Log that a POST request was received
 console.info(`${req.method} request received`);

 // Destructuring assignment for the items in req.body
 const { title, text } = req.body;

 // If all the required properties are present
 if (title && text) {
   // Variable for the object we will save
   const newNotes = {
     title,
     text,
     id: uuid(),
   };

   fs.readFile('./db/db.json', 'utf-8', (err,data) => {
      const notes = JSON.parse(data);
      console.log(req.body);
      notes.push(newNotes);
      const noteStr = JSON.stringify(notes);
      fs.writeFile('./db/db.json', noteStr, (err) =>
      err
        ? console.error(err)
        : console.log(`New note has been written to JSON file`)
      )
   })
   const response = {
     status: 'success',
     body: newNotes,
   };

   console.log(response);
   res.status(201).json(response);
 } else {
   res.status(500).json('Error in posting review');
 }
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);