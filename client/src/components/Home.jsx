import React from 'react'

import { Link } from 'react-router-dom'

const Home = () => (
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-4 text-center">
        <Link to='/start'><button type="button" class="btn btn-primary">Start</button></Link>
      </div>
    </div>
  </div>
)

export default Home
