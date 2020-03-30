import { combineReducers } from 'redux';
import initialReducer from './initialReducer'
import navigationReducer from './navigationReducer'

//import router from './router'

export default combineReducers({
    initial: initialReducer,
    navigation: navigationReducer,
    //router
});