const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const mongoDB = 'mongodb://localhost:27017/Test_DB';

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected!\n\n');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: String,
  userID: String,
  status: String,
  id: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/', (req, res) => {
  res.send('Root Dir');
});

// Fetch init
app.post('/stupid-endpoint-zero', cors(), (req, res) => {
  const userID = req.body.userID;

  console.log(userID)

  Message.find({ userID: userID })
      .then(documents => {
          if (documents.length === 0) {
              res.status(200).json({});
          } else {
              console.log(documents)
              res.status(200).json(documents);
          }
      })
      .catch(err => {
          console.error('Error retrieving messages:', err);
          res.status(500).json({ message: 'Error retrieving messages.' });
      });
});

// Add
app.post('/stupid-endpoint-one', cors(), (req, res) => {
    const newMessage = new Message({ 
      text: `${req.body.text}`,
      userID: `${req.body.userID}`,
      status: `${req.body.status}`,
      id: `${req.body.id}`
    });

    newMessage.save()
    .then(doc => console.log('Message inserted:', doc))
    .catch(err => console.error('Error inserting message:', err));
    
    res.status(200).json({
        message: 'message propogated!',
    });
});

app.post('/stupid-endpoint-two', cors(), (req, res) => {
  const messageId = req.body.id;

  Message.deleteOne({ id: messageId })
  .then(result => {
      if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Message deleted successfully!' });
      } else {
          res.status(404).json({ message: 'Message not found.' });
      }
  })
  .catch(err => {
      console.error('Error deleting message:', err);
      res.status(500).json({ message: 'Error deleting message.' });
  });
});

app.post('/stupid-endpoint-three', cors(), (req, res) => {
  const messageId = req.body.id;
  const newStatus = req.body.status;

  Message.findOneAndUpdate({ id: messageId }, { status: newStatus }, { new: true })
  .then(updatedDocument => {
      if (updatedDocument) {
          res.status(200).json({  message: 'Message status updated successfully!'});
      } else {
          res.status(404).json({ message: 'Message not found.' });
      }
  })
  .catch(err => {
      console.error('Error updating message status:', err);
      res.status(500).json({ message: 'Error updating message status.' });
  });
});

app.get('/weather-api', cors(), (req, res) => {
  const apiKey = '4193bb3945abb40f31c692fdb262d542';
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=Boston`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok for Weather API');
      }
      return response.json()
    })
    .then(data => {
      res.json(data);
    })
    .catch(error => console.error('Error:', error));
});

app.get('/money-api', (req, res) => {
  const url = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange'; // Rates of Exchange endpoint

  fetch(url)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok for Money API');
      }
      return response.json();
    })
    .then(data => {
      res.json(data); 
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' }); // Send back an error response
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


module.exports = app;


