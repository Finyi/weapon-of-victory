# Military Equipment Catalog

A simple pet propject in vanilla HTML/CSS/JavaScript that displays a catalog of military equipment based on JSON data.

## Overview

The project consists of a website with several HTML pages:

- `index.html` - main page
- `catalog.html` - equipment catalog
- `admin.html` - admin panel for generating JSON descriptions of equipment 

## Structure

- `data/equipment.json` - data of equipmnet in JSON
- `src/js/app.js` - basic functions of standard bar windows and a simple slider
- `src/js/catalog.js` - key features of the filter, modal windows, and lazy loading.
- `src/js/adm-panel.js` - admin form for generating JSON data

since the data is downloaded via `fetch`, It's best to run the website on a local server.

for Python:

```bash
cd c:/Users/admin/Desktop/weapon-of-victory
python -m http.server 8000
```

open in browser:
```text
http://localhost:8000/index.html
```
