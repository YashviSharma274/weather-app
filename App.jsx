// App.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form, InputGroup, Card, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaLocationArrow, FaWind, FaCloudRain, FaCloud } from 'react-icons/fa';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import './App.css';

function App() {
  const API_KEY = 'f5494dd8ea66dd629c985ae34fb471b0';
  
  // State management
  const [loading, setLoading] = useState(false);
  const [showStarter, setShowStarter] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState({ show: false, message: '' });
  const [view, setView] = useState('grant'); // 'grant', 'search', 'weather'
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Show starter screen
    const timer = setTimeout(() => {
      setShowStarter(false);
      // Show alert message after starter screen
      setTimeout(() => {
        alert(`Note: It is advised to zoom out the screen on smaller devices and reload the screen to get exact information.
Have a good weather 😊`);
      }, 500);
    }, Math.random() * 2000 + 2000); // Between 2-4 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  const getWeatherByCoords = async (lat, long) => {
    try {
      setLoading(true);
      setError({ show: false, message: '' });
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
        setView('weather');
      } else {
        setError({ show: true, message: data.message });
      }
    } catch (err) {
      setError({ show: true, message: 'Failed to fetch weather data' });
    } finally {
      setLoading(false);
    }
  };
  
  const getWeatherByCityName = async () => {
    if (!searchInput.trim()) return;
    
    try {
      setLoading(true);
      setError({ show: false, message: '' });
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
        setView('weather');
      } else {
        setError({ show: true, message: data.message });
        setView('search'); // Stay on search view if error occurs
      }
    } catch (err) {
      setError({ show: true, message: 'Failed to fetch weather data' });
      setView('search'); // Stay on search view if error occurs
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        (err) => {
          setLoading(false);
          setError({
            show: true,
            message: 'Failed to get location. Please enable location access.'
          });
          setView('grant'); // Keep grant view visible on error
        }
      );
    } else {
      setError({
        show: true,
        message: 'Geolocation is not supported by this browser.'
      });
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      e.preventDefault();
      getWeatherByCityName();
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const handleYourWeatherClick = () => {
    // If we already have weather data, just show it
    if (weatherData) {
      setView('weather');
    } else {
      // Otherwise, go to grant location view
      setView('grant');
    }
  };
  
  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {showStarter && (
        <div className="starter-screen">
          <h1 className="loading-text">LOADING...</h1>
        </div>
      )}
      
      <Container className={`main-container ${showStarter ? 'opacity-0' : ''}`}>
        <Row className="mb-4 justify-content-between align-items-center">
          <Col md={8}>
            <h1 className="app-heading text-center text-md-start">Weather App</h1>
          </Col>
          <Col md={4} className="text-end">
            <Button 
              variant={darkMode ? "light" : "dark"} 
              onClick={toggleDarkMode}
              className="mode-toggle"
            >
              {darkMode ? <BsSunFill /> : <BsMoonFill />}
              <span className="ms-2">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col className="d-flex justify-content-center gap-4">
            <Button 
              variant={darkMode ? "outline-light" : "outline-dark"} 
              onClick={handleYourWeatherClick}
            >
              Your Weather
            </Button>
            <Button 
              variant={darkMode ? "outline-light" : "outline-dark"} 
              onClick={() => setView('search')}
            >
              Search
            </Button>
          </Col>
        </Row>
        
        {view === 'grant' && (
          <Card className="grant-card mx-auto text-center">
            <Card.Body>
              <div className="location-icon mb-3">
                <FaLocationArrow size={60} />
              </div>
              <Card.Title className="mb-3">Grant Location Access</Card.Title>
              <Card.Text>Allow access to get weather information</Card.Text>
              <Button 
                variant={darkMode ? "light" : "primary"} 
                onClick={handleLocationAccess}
              >
                GRANT ACCESS
              </Button>
            </Card.Body>
          </Card>
        )}
        
        {view === 'search' && (
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  placeholder="Search for city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={darkMode ? 'dark-input' : ''}
                />
                <Button 
                  variant={darkMode ? "light" : "primary"} 
                  onClick={getWeatherByCityName}
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        )}
        
        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant={darkMode ? "light" : "primary"}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        
        {error.show && !loading && (
          <Alert variant="danger" className="text-center mx-auto" style={{ maxWidth: '600px' }}>
            <img src="/err.jpeg" alt="Error" className="error-image mb-3" />
            <p className="mb-0 text-capitalize">{error.message}</p>
          </Alert>
        )}
        
        {weatherData && view === 'weather' && !loading && (
          <Card className="weather-card mx-auto">
            <Card.Body>
              <div className="city-header mb-3">
                <h2>{weatherData.name}</h2>
                {weatherData.sys?.country && (
                  <img 
                    src={`https://flagcdn.com/144x108/${weatherData.sys.country.toLowerCase()}.png`} 
                    alt="Country flag" 
                    height="30"
                  />
                )}
              </div>
              
              <div className="weather-main mb-4">
                <h3>{weatherData.weather[0].main} ({weatherData.weather[0].description})</h3>
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                  alt="Weather icon"
                  className="weather-icon"
                />
                <h2 className="temperature">{kelvinToCelsius(weatherData.main.temp)}°C</h2>
              </div>
              
              <Row className="weather-details">
                <Col md={4}>
                  <Card className="detail-card mb-3 mb-md-0">
                    <Card.Body className="text-center">
                      <FaWind className="detail-icon mb-2" />
                      <p className="detail-title">WINDSPEED</p>
                      <p className="detail-value">{weatherData.wind.speed} m/s</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="detail-card mb-3 mb-md-0">
                    <Card.Body className="text-center">
                      <FaCloudRain className="detail-icon mb-2" />
                      <p className="detail-title">HUMIDITY</p>
                      <p className="detail-value">{weatherData.main.humidity}%</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="detail-card">
                    <Card.Body className="text-center">
                      <FaCloud className="detail-icon mb-2" />
                      <p className="detail-title">CLOUDS</p>
                      <p className="detail-value">{weatherData.clouds.all}%</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default App;