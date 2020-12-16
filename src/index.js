import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import {
  createStore,
} from 'redux'
import {
  Provider
} from 'react-redux'
import AllReducers from './reducer'
const GlobalState = createStore(AllReducers)
// GlobalState.subscribe(() => console.log('global state', GlobalState.getState()))

ReactDOM.render(
  <Provider store={GlobalState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
