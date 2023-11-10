const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/stupid-endpoint-one', cors(), (req, res) => {
    const to_do_data = req.body.text;

    console.log(to_do_data);

    res.status(200).json({
        message: 'Got ur message nerd',
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


module.exports = app;


