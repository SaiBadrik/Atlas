const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const fs = require('fs');
const path = require('path');

// Load lines/stations dataset
let linesData = {};
try {
  const raw = fs.readFileSync(path.join(__dirname, '..', 'data', 'mtr_lines.json'), 'utf8');
  linesData = JSON.parse(raw);
} catch (e) {
  console.warn('Could not load mtr_lines.json, lines endpoint will be empty', e && e.message);
}

// GET /api/mtr/schedule?line=TKL&sta=TKO&lang=EN
router.get('/schedule', async (req, res) => {
  try {
    const { line, sta, lang } = req.query;
    if (!line || !sta) {
      return res.status(400).json({ error: 'Missing required query parameters: line, sta' });
    }

    const queryLang = (lang || 'EN').toUpperCase();

    // Validate against dataset when available
    const lineCode = line.toUpperCase();
    const staCode = sta.toUpperCase();
    if (Object.keys(linesData).length > 0) {
      if (!linesData[lineCode]) {
        return res.status(400).json({ error: `Unknown line '${lineCode}'. Use /api/mtr/lines to see supported lines.` });
      }
      const stations = linesData[lineCode].stations.map(s => s.code);
      if (!stations.includes(staCode)) {
        return res.status(400).json({ error: `Station '${staCode}' not valid for line '${lineCode}'.`, availableStations: linesData[lineCode].stations });
      }
    }

    const csdiUrl = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${encodeURIComponent(lineCode)}&sta=${encodeURIComponent(staCode)}&lang=${encodeURIComponent(queryLang)}`;

    const r = await fetch(csdiUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream CSDI API', status: r.status });
    }
    const data = await r.json();

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { line: lineCode, sta: staCode, lang: queryLang }
    };

    return res.json({ meta, data });
  } catch (err) {
    console.error('MTR proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mtr/lines -> returns dataset for frontend
router.get('/lines', (req, res) => {
  return res.json(linesData);
});

module.exports = router;
