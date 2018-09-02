import React from 'react'
import '../css/header.css'

import { Link } from 'react-router-dom'

const Header = () => (
  <div class="container-fluid">
    <div id="header" class="row justify-content-center pb-2 pt-2">
      <div class="col text-center">
        <Link to='/' id='logo'><h3>waffle</h3></Link>
      </div>
    </div>
  </div>
)

export default Header
