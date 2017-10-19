import React from 'react'
import ReactDOM from 'react-dom'
import { createStore} from 'redux'
import { Provider } from 'react-redux'
import App from './router/router'
import todoApp from './reducers/index.js'
// import "babel-polyfill";
let store = createStore(todoApp)

let rootElement = document.getElementById('mainContainer')
const render = () => ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
)
render()
store.subscribe(() =>
  {
    //console.log(store.getState())
  }
)
store.dispatch({ type: 'INCREMENT' })
