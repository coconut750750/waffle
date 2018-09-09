import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from './Header.jsx'
import Home from './Home.jsx'
import Start from './Start.jsx'
import Results from './Results.jsx'

const HeaderRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <div>
        <Header />
        <Component {...props}/>
    </div>
  )}/>
)

const Router = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <HeaderRoute path='/start' component={Start}/>
      <HeaderRoute path='/results' component={Results}/>
    </Switch>
  </main>
)

export default Router
