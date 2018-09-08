import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home.jsx'
import Start from './Start.jsx'
import Results from './Results.jsx'

const Router = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/start' component={Start}/>
      <Route path='/results' component={Results}/>
    </Switch>
  </main>
)

export default Router
