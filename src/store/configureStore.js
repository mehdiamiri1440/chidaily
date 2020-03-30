import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk'

import reducers from '../reducers/index';
//const reducers = require('../reducers/index').default
//import { createLogger } from 'redux-logger';

//const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

export default function configureStore() {
  // const enhancer = compose(
  //   applyMiddleware(
  //     loggerMiddleware
  //   )
  // )
  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}