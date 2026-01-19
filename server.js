const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// JSON body parsing if needed later
app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/mtr', require('./routes/mtr'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Tourism app listening on http://localhost:${port}`);
});
