# Advanced CSS3 & Responsive Portfolio

This is the upgraded version of the semantic HTML5 portfolio.

## Included
- CSS Grid for responsive card and page layouts.
- Flexbox for navigation, buttons, and component alignment.
- Mobile-first breakpoints for phone, tablet, and desktop.
- CSS custom properties for consistent design tokens.
- Light/dark theme toggle with saved preference (`localStorage`) and system-theme detection.
- Visible keyboard focus, reduced-motion support, and responsive form controls.

## Run
Extract the ZIP and open `index.html` in a browser, or serve the folder using a local development server.

## Customize
Update the sample name and content in the HTML files. Replace canonical URLs in each page with your real website domain. The contact form is a front-end demonstration and needs a server-side form handler to deliver messages.

No source-only implementation can guarantee pixel-perfect rendering on every device or a perfect Lighthouse score. Test with browser responsive mode and Lighthouse after deployment.


## JavaScript To-Do List
Open `todo.html` to use the task manager. It supports create, read, update, delete, completion toggles, All/Active/Completed filters, delegated event handling, and automatic persistence through `window.localStorage`. Data is stored locally in the current browser and is not synchronized between devices. Use the same browser profile to see saved tasks after reload.


## Asynchronous JavaScript Weather Dashboard
Open `weather.html` and search for a city. `weather.js` first calls the Open-Meteo Geocoding API to resolve a city to latitude/longitude, then calls the Forecast API for current temperature, relative humidity, apparent temperature, weather code, and wind speed. It uses `fetch`, `async`/`await`, JSON parsing, loading states, HTTP/network error handling, and dynamic DOM rendering. Open-Meteo's public API can be used without an API key for non-commercial use; review its terms before other use.
