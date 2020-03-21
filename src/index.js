import React from 'react'
import './css/style.css';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App.jsx';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
