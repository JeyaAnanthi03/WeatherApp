import { useEffect, useState } from "react";
//import PropTypes from "prop-types";
import "./App.css";
import searchIcon from "./assets/search.jpg";
import clearIcon from "./assets/clear.jpg";
import snowIcon from "./assets/snow.jpg";
import humudityIcon from "./assets/humudity.jpg";
import windIcon from "./assets/wind.jpg";
import rainIcon from "./assets/rain.jpg";
import drizzleIcon from "./assets/drizzle.jpg";

const WeatherDetails = ({
  icon,
  temp,
  location,
  country,
  lat,
  log,
  humudity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img className="Icon" src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{location}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div className="lat">
          <span>Latitude</span>
          <span>{lat}</span>
        </div>
        <div className="log">
          <span>Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humudityIcon} alt="humudity" />
          <div className="data">
            <div className="humudity-percent">{humudity}%</div>
            <div className="text">Humudity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" />
          <div className="data">
            <div className="wind-percent">{wind} km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let api_key = "79f1398b4059ae2fa5311617f8e573ae";
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [location, setLocation] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLatitude] = useState(0);
  const [log, setLongitude] = useState(0);
  const [humudity, setHumudity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": clearIcon,
    "02n": clearIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumudity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setLocation(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred fetching weather data.");
    } finally {
      setLoading(false);
    }
  };
  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  useEffect(function () {
    search();
  }, []);
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div
            className="search-icon"
            onClick={() => {
              search();
            }}
          >
            <img className="searchIcon" src={searchIcon} alt="Search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            location={location}
            country={country}
            lat={lat}
            log={log}
            humudity={humudity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;
