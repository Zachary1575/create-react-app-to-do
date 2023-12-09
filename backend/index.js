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
    console.log('MongoDB connected...');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// Function to insert a message
function insertMessage(msg) {
  const newMessage = new Message({ text: `${msg}` });

  newMessage.save()
    .then(doc => console.log('Message inserted:', doc))
    .catch(err => console.error('Error inserting message:', err));
}

app.get('/', (req, res) => {
  res.send('Root Dir');
});

app.post('/stupid-endpoint-one', cors(), (req, res) => {
    const to_do_data = req.body.text;

    console.log(to_do_data);

    insertMessage(to_do_data);

    res.status(200).json({
        message: 'message propogated!',
    });
});

app.get('/weather-api', cors(), (req, res) => {
  const apiKey = 'pItpp0CXe44WkYWVXC0Uy3lWNXgKTUPx'; // Replace with your API key
  const city = '02108'; // Boston
  const url = `http://dataservice.accuweather.com/currentconditions/v1/${city}?apikey=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data); // This contains the weather information
    })
    .catch(error => console.error('Error:', error));
});

app.get('/money-api', cors(), (req, res) => {
  const url = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange'; // Rates of Exchange endpoint

  fetch(url)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Process the data
    })
    .catch(error => {
      console.error('Fetch Error:', error);
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


module.exports = app;


