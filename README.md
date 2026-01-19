# Hong Kong Tourism App — MTR Schedule Module

This small project is the first module of a Tourism App for Hong Kong. It demonstrates an MTR Schedule module that proxies the CSDI MTR schedule API and provides a minimal frontend demo.

Quick start (Windows PowerShell):

```powershell
cd 'c:\Bittu\Atlas'
npm install
npm start
```

Then open: http://localhost:3000

## Deploy to Public Domain

This app is ready to deploy **freely** to Glitch or Render. See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

## API Endpoints
- `GET /api/mtr/schedule?line=<LINE>&sta=<STA>&lang=EN|TC`
- `GET /api/mtr/lines` returns available lines and their stations (used by frontend)

**Example**: `/api/mtr/schedule?line=TKL&sta=TKO&lang=EN`

## Notes
- This module proxies the CSDI API at `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php`.
- The project is intentionally minimal: add more modules (attractions, weather, maps) under `routes/` and `public/`.
