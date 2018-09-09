import { combineReducers } from 'redux';
import fileStrageReducer from './fileStrageReducer';

export default combineReducers({
  fileStrage: fileStrageReducer
});