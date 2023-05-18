import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import logo from './GravitiLogo.png';

const App = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [distance, setDistance] = useState('');

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleStopChange = (event, index) => {
    const updatedStops = [...stops];
    updatedStops[index] = event.target.value;
    setStops(updatedStops);
  };

  const handleRemoveStop = (index) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    setStops(updatedStops);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const waypoints = stops.filter((stop) => stop.trim() !== '');
    setWaypoints(waypoints);

    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsDisplay = new window.google.maps.DirectionsRenderer();

      directionsService.route(
        {
          origin,
          destination,
          waypoints: waypoints.map((stop) => ({ location: stop, stopover: true })),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            const route = result.routes[0];
            const totalDistance = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
            const distanceInKm = (totalDistance / 1000).toFixed(2);
            setDistance(distanceInKm);
          }
        }
      );

      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 0, lng: 0 },
      });
      directionsDisplay.setMap(map);
    }
  };

  return (
    <div className="container-fluid">
      <div className='nav'><img src={logo} alt="Logo" /></div>
      <h3>Let's calculate <b>distance</b> from Google maps</h3>
      <div className='row'>
        <div className='col-md-6'>
          <form onSubmit={handleSubmit} className="form row">
            <div className='col-md-8 left-inner-div'>
              <label>
                Origin
                <input type="text" value={origin} onChange={handleOriginChange} className="form-input" />
              </label>
              {stops.map((stop, index) => (
                <div key={index} className="stop">
                  <label>Stop {index + 1}
                  <input type="text" value={stop} onChange={(event) => handleStopChange(event, index)} className="form-input" />
                  <button type="button" onClick={() => handleRemoveStop(index)} className="remove-stop-button btn btn-default active btn-sm">Remove</button>
                  </label>
                </div>
              ))}
              <button type="button" onClick={handleAddStop} className="add-stop-button btn btn-default active">Add Stop</button>
              <label>
                Destination
                <input type="text" value={destination} onChange={handleDestinationChange} className="form-input" />
              </label>
            </div>
            <div className="col-md-4">
              <button type="submit" className="calc-button">Calculate</button>
            </div>
          </form>
          <div className='dist-box'>
            {distance && <p className="distance">Distance <b className='dist-number'>{distance} kms </b></p>}
            {distance &&
            <p className='sentence'>The distance between <b>{origin}</b> and <b>{destination}</b> via the selected route is <b>{distance} kms</b>. </p>}
          </div>
        </div>
        <div className='col-md-6'>
          <div id="map" className="map"></div>
        </div>
      </div>
    </div>
  );  
};

export default App;