(() => {
  "use strict";

  const form = document.querySelector("#weather-form");
  const cityInput = document.querySelector("#city-input");
  const searchButton = document.querySelector("#search-button");
  const message = document.querySelector("#weather-message");
  const result = document.querySelector("#weather-result");

  const fields = {
    location: document.querySelector("#location-name"),
    condition: document.querySelector("#condition"),
    temperature: document.querySelector("#temperature"),
    feelsLike: document.querySelector("#feels-like"),
    humidity: document.querySelector("#humidity"),
    wind: document.querySelector("#wind"),
    updated: document.querySelector("#updated-time")
  };

  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
   };

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function displayNumber(value, suffix, digits = 0) {
    if (typeof value !== "number" || !Number.isFinite(value)) return "Not available";
    return `${value.toFixed(digits)}${suffix}`;
  }

  async function fetchJSON(url) {
    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error(`The weather service returned an error (${response.status}).`);
    }
    return response.json();
  }

  async function getCoordinates(city) {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.search = new URLSearchParams({
      name: city,
      count: "1",
      language: "en",
      format: "json"
    });
    const data = await fetchJSON(url);
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error(`No matching city found for "${city}". Check the spelling and try again.`);
    }
    return data.results[0];
  }

  async function getCurrentWeather(latitude, longitude) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
      timezone: "auto"
    });
    return fetchJSON(url);
  }

  function renderWeather(place, data) {
    const current = data.current;
    if (!current || typeof current !== "object") {
      throw new Error("The weather response did not contain current conditions.");
    }

    const code = current.weather_code;
    fields.location.textContent = [place.name, place.admin1, place.country]
      .filter((part, index, arr) => part && arr.indexOf(part) === index)
      .join(", ");
    fields.condition.textContent = weatherDescriptions[code] || "Conditions unavailable";
    fields.temperature.textContent = displayNumber(current.temperature_2m, "°C");
    fields.feelsLike.textContent = displayNumber(current.apparent_temperature, "°C");
    fields.humidity.textContent = displayNumber(current.relative_humidity_2m, "%");
    fields.wind.textContent = displayNumber(current.wind_speed_10m, " km/h", 1);

    const time = current.time ? new Date(current.time) : null;
    fields.updated.textContent = time && !Number.isNaN(time.getTime())
      ? `Observation time: ${time.toLocaleString()} · Time zone: ${data.timezone || "local"}`
      : "Observation time not provided by the service.";

    result.hidden = false;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
      setMessage("Please enter a city name.", true);
      cityInput.focus();
      return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching…";
    result.classList.add("loading");
    setMessage(`Searching for weather in ${city}…`);

    try {
      // First resolve the city name to coordinates, then request weather for those coordinates.
      const place = await getCoordinates(city);
      const weather = await getCurrentWeather(place.latitude, place.longitude);
      renderWeather(place, weather);
      setMessage(`Weather loaded for ${place.name}.`);
    } catch (error) {
      result.hidden = true;
      setMessage(
        error instanceof TypeError
          ? "A network error occurred. Check your internet connection and try again."
          : (error.message || "Unable to load weather right now. Please try again."),
        true
      );
    } finally {
      searchButton.disabled = false;
      searchButton.textContent = "Search weather";
      result.classList.remove("loading");
    }
  });
})();