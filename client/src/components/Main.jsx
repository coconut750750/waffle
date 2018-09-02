import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home.jsx'
import Start from './Start.jsx'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/start' component={Start}/>
    </Switch>
  </main>
)

export default Main
