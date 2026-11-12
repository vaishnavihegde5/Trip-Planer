# Smart Trip Planner

Plan a day in India with photographed stops, suggested visit times, and three routes built around your interests and the time you have.

## Try a trip

1. Choose **Plan my trip → Continue as guest**. Guest planning requires no account details.
2. Pick a city, your start and finish times, and a day budget from ₹100 to ₹25,000. Add up to five interests and an optional neighbourhood.
3. Compare **Neighbourhood stroll**, **Culture trail**, and **City sampler**. Each route has a different set of stops. Walk, auto-rickshaw, or taxi suggestions appear between stops.
4. Drag a stop by its grip to change the order. Switch on **Rainy Day** for indoor alternatives, or open **Google Maps** on a stop to look up the venue.

The eight featured destinations are Mumbai, Delhi, Bangalore, Jaipur, Goa, Kochi, Agra, and Udaipur. They use a bundled catalogue with 46 photographed venues. Other cities depend on finding enough nearby, photographed places through Wikipedia. Transfer times are estimates based on straight-line distances. Check opening hours and current directions before setting out.

## Run locally

Use Node.js 22.12 or later and npm. Clone the repository, then open two terminals in its root directory.

**Terminal 1 — Express API**

```sh
npm ci --prefix backend
node backend/index.js
```

**Terminal 2 — React frontend**

```sh
npm ci --prefix frontend
npm run dev --prefix frontend
```

Open the local URL printed by Vite, usually [localhost:5173](http://localhost:5173). The development server forwards API requests to port 5000. Guest planning works without PostgreSQL. Without a `DATABASE_URL`, the backend uses process-local memory and saved records are temporary.

To build the frontend after installing its dependencies, run `npm run build --prefix frontend`. Vite writes the production assets to `frontend/dist/`.

## Deployment

Vercel builds the React/Vite frontend and Express backend as separate services in one project. Use the repository root as the Vercel project root so it can read [vercel.json](vercel.json). Requests under `/api/` go to Express. The frontend serves the browser routes, landmark photos, and compass favicon.

The public production URL is [thetriplaner.vercel.app](https://thetriplaner.vercel.app/). To check a particular release, open its commit on GitHub and follow the **Vercel** status link. Opening the homepage and then refreshing a nested page such as `/login` checks both static hosting and browser routing.

## Project layout

| Path | Purpose |
| --- | --- |
| `frontend/src/` | Destination picker, budget controls, guest entry, and drag-and-drop itinerary |
| `frontend/public/places/` | Bundled venue photographs. Itinerary photo links open the source credits. |
| `backend/planner.js` | Route selection, time windows, transfers, and indoor replacements |
| `backend/venues.json` | Featured venues, coordinates, and photo sources |
| `backend/venueDiscovery.js` | Nearby venue discovery for other destinations |
| `backend/index.js` | Express endpoints for planning, accounts, and saved trips |
