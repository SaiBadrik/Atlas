const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Bus operators
const OPERATORS = {
  KMB: 'kmb',
  CTB: 'ctb',
  NWFB: 'nwfb'
};

// GET /api/bus/eta?stop_id=<STOP_ID>&route=<ROUTE>&service_type=<SERVICE_TYPE>&operator=KMB|CTB|NWFB
router.get('/eta', async (req, res) => {
  try {
    const { stop_id, route, service_type, operator } = req.query;
    if (!stop_id || !route || !service_type || !operator) {
      return res.status(400).json({ error: 'Missing required query parameters: stop_id, route, service_type, operator (KMB, CTB, NWFB)' });
    }

    const operatorCode = operator.toUpperCase();
    if (!Object.values(OPERATORS).includes(operatorCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid operator '${operatorCode}'. Use: KMB, CTB, NWFB` });
    }

    const stopId = stop_id;
    const routeCode = route.toUpperCase();
    const serviceTypeCode = service_type;

    // ETABus API endpoint with new format: /eta/{stop_id}/{route}/{service_type}
    const etabusUrl = `https://data.etabus.gov.hk/v1/transport/${operatorCode.toLowerCase()}/eta/${encodeURIComponent(stopId)}/${encodeURIComponent(routeCode)}/${encodeURIComponent(serviceTypeCode)}`;

    const r = await fetch(etabusUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream ETABus API', status: r.status });
    }
    const data = await r.json();

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { stop_id: stopId, route: routeCode, service_type: serviceTypeCode, operator: operatorCode }
    };

    return res.json({ meta, data });
  } catch (err) {
    console.error('Bus ETA proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bus/routes?operator=KMB|CTB|NWFB&lang=EN|TC
router.get('/routes', async (req, res) => {
  try {
    const { operator, lang } = req.query;
    if (!operator) {
      return res.status(400).json({ error: 'Missing required query parameter: operator (KMB, CTB, NWFB)' });
    }

    const operatorCode = operator.toUpperCase();
    if (!Object.values(OPERATORS).includes(operatorCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid operator '${operatorCode}'. Use: KMB, CTB, NWFB` });
    }

    const queryLang = (lang || 'EN').toUpperCase();

    // Get all routes for operator
    const csdiUrl = `https://rt.data.gov.hk/v1/transport/${operatorCode.toLowerCase()}/route`;

    const r = await fetch(csdiUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream CSDI API', status: r.status });
    }
    const data = await r.json();

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { operator: operatorCode, lang: queryLang }
    };

    return res.json({ meta, data });
  } catch (err) {
    console.error('Bus routes proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bus/stops?operator=KMB|CTB|NWFB
router.get('/stops', async (req, res) => {
  try {
    const { operator } = req.query;
    if (!operator) {
      return res.status(400).json({ error: 'Missing required query parameter: operator (KMB, CTB, NWFB)' });
    }

    const operatorCode = operator.toUpperCase();
    if (!Object.values(OPERATORS).includes(operatorCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid operator '${operatorCode}'. Use: KMB, CTB, NWFB` });
    }

    // Get all stops for operator
    const csdiUrl = `https://rt.data.gov.hk/v1/transport/${operatorCode.toLowerCase()}/stop`;

    const r = await fetch(csdiUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream CSDI API', status: r.status });
    }
    const data = await r.json();

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { operator: operatorCode }
    };

    return res.json({ meta, data });
  } catch (err) {
    console.error('Bus stops proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bus/route-detail?route=<ROUTE>&operator=KMB|CTB|NWFB&direction=inbound|outbound
router.get('/route-detail', async (req, res) => {
  try {
    const { route, operator, direction } = req.query;
    if (!route || !operator) {
      return res.status(400).json({ error: 'Missing required query parameters: route, operator (KMB, CTB, NWFB)' });
    }

    const operatorCode = operator.toUpperCase();
    if (!Object.values(OPERATORS).includes(operatorCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid operator '${operatorCode}'. Use: KMB, CTB, NWFB` });
    }

    const routeCode = route.toUpperCase();
    const directionParam = direction ? `?direction=${encodeURIComponent(direction)}` : '';

    // Get route detail with stops
    const csdiUrl = `https://rt.data.gov.hk/v1/transport/${operatorCode.toLowerCase()}/route/${encodeURIComponent(routeCode)}${directionParam}`;

    const r = await fetch(csdiUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream CSDI API', status: r.status });
    }
    const data = await r.json();

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { route: routeCode, operator: operatorCode, direction: direction || 'all' }
    };

    return res.json({ meta, data });
  } catch (err) {
    console.error('Bus route detail proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bus/route-stop?route=<ROUTE>&operator=KMB|CTB|NWFB&direction=inbound|outbound&service_type=1|2|3
router.get('/route-stop', async (req, res) => {
  try {
    const { route, operator, direction, service_type } = req.query;
    if (!route || !operator || !direction || !service_type) {
      return res.status(400).json({ error: 'Missing required query parameters: route, operator (KMB, CTB, NWFB), direction (inbound/outbound), service_type (1/2/3)' });
    }

    const operatorCode = operator.toUpperCase();
    if (!Object.values(OPERATORS).includes(operatorCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid operator '${operatorCode}'. Use: KMB, CTB, NWFB` });
    }

    const routeCode = route.toUpperCase();
    const dir = direction.toLowerCase();
    const svc = service_type;

    // Valid directions: inbound, outbound
    if (!['inbound', 'outbound'].includes(dir)) {
      return res.status(400).json({ error: 'Invalid direction. Use: inbound, outbound' });
    }

    // Valid service types: 1, 2, 3
    if (!['1', '2', '3'].includes(svc)) {
      return res.status(400).json({ error: 'Invalid service_type. Use: 1 (standard), 2 (express), 3 (night)' });
    }

    // Get route stops with direction and service type
    const csdiUrl = `https://data.etabus.gov.hk/v1/transport/${operatorCode.toLowerCase()}/route-stop/${encodeURIComponent(routeCode)}/${dir}/${svc}`;

    const r = await fetch(csdiUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream API', status: r.status });
    }
    const apiResponse = await r.json();

    // Extract just the stops array from the API response
    const stops = apiResponse.data || [];

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { route: routeCode, operator: operatorCode, direction: dir, service_type: svc }
    };

    return res.json({ meta, data: stops });
  } catch (err) {
    console.error('Bus route-stop proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bus/stop?stop_id=<STOP_ID>&operator=KMB|CTB|NWFB
router.get('/stop', async (req, res) => {
  try {
    const { stop_id, operator } = req.query;
    if (!stop_id || !operator) {
      return res.status(400).json({ error: 'Missing required query parameters: stop_id, operator (KMB, CTB, NWFB)' });
    }

    const operatorCode = operator.toUpperCase();
    if (!Object.values(OPERATORS).includes(operatorCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid operator '${operatorCode}'. Use: KMB, CTB, NWFB` });
    }

    const stopId = encodeURIComponent(stop_id);

    // Get stop details with bilingual names
    const etabusUrl = `https://data.etabus.gov.hk/v1/transport/${operatorCode.toLowerCase()}/stop/${stopId}`;

    const r = await fetch(etabusUrl, { timeout: 10000 });
    if (!r.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream API', status: r.status });
    }
    const data = await r.json();

    const meta = {
      proxiedAt: new Date().toISOString(),
      requested: { stop_id: stop_id, operator: operatorCode }
    };

    return res.json({ meta, data });
  } catch (err) {
    console.error('Bus stop proxy error', err && err.stack || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
