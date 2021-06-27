import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import HomePage from './pages/home'

const App = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
