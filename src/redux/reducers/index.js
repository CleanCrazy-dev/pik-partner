import {combineReducers} from 'redux';
import auth from './authReducer';
import documents from './documentsReducer';
import app from './appReducer';

export default combineReducers({
    auth,
    documents,
    app
});
