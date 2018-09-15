import React from 'react'
import '../css/header.css'

import { Link } from 'react-router-dom'

const Header = () => (
  <div className="container-fluid">
    <div id="header" className="row justify-content-center mb-4 h-100 back-image">
      <div className="col text-center">
        <Link to='/'><img style={{width: '15%'}}  src="/images/waffle_logo.png" alt="logo"/></Link>
      </div>
    </div>
  </div>
)

export default Header
