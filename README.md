# Hong Kong Tourism App — MTR Schedule Module

This small project is the first module of a Tourism App for Hong Kong. It demonstrates an MTR Schedule module that proxies the  MTR schedule API and provides a minimal frontend demo.

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

### MTR Schedule Module
- `GET /api/mtr/schedule?line=<LINE>&sta=<STA>&lang=EN|TC` - Get MTR schedule for a station
- `GET /api/mtr/lines` - Get available MTR lines and their stations

**Example**: `/api/mtr/schedule?line=TKL&sta=TKO&lang=EN`

### Bus Arrival & Routes Module
- `GET /api/bus/eta?route=<ROUTE>&stop=<STOP>&operator=KMB|CTB|NWFB` - Get real-time bus ETA
- `GET /api/bus/routes?operator=KMB|CTB|NWFB&lang=EN|TC` - Get all bus routes for operator
- `GET /api/bus/stops?operator=KMB|CTB|NWFB` - Get all bus stops for operator
- `GET /api/bus/route-detail?route=<ROUTE>&operator=KMB|CTB|NWFB&direction=inbound|outbound` - Get route details with stops

**Bus Operators**: KMB (Kowloon Motor Bus), CTB (Citybus), NWFB (New World First Bus)

**Examples**:
- `/api/bus/eta?route=1&stop=BV01&operator=KMB`
- `/api/bus/routes?operator=KMB&lang=EN`
- `/api/bus/route-detail?route=1&operator=KMB`

## Notes
- MTR module proxies the CSDI API at `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php`
- Bus module proxies the CSDI APIs at `https://rt.data.gov.hk/v1/transport/{operator}/...`
- The project is intentionally minimal: add more modules (attractions, weather, maps) under `routes/` and `public/`.
