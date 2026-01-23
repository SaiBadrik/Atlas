const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// JSON body parsing if needed later
app.use(express.json());

// Static frontend (index.html is served by default at /)
app.use(express.static(path.join(__dirname, 'public')));

// Routes to serve different module pages
app.get('/mtr', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mtr.html'));
});

app.get('/bus', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bus.html'));
});

// API routes
app.use('/api/mtr', require('./routes/mtr'));
app.use('/api/bus', require('./routes/bus'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Tourism app listening on http://localhost:${port}`);
});
