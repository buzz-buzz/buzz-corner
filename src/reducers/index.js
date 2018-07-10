import {combineReducers} from 'redux'
import {ADD_USER, ADD_USERS, TOAST} from '../actions'

function multipleUsers(state = [], action) {
    switch (action.type) {
        case ADD_USER:
            return [
                ...state,
                action.payload
            ]

        case ADD_USERS:
            return [
                ...state,
                ...action.payload
            ]

        default:
            return state
    }
}

function toastMessage(state = {show: false, message: ''}, action) {
    switch (action.type) {
        case TOAST:
            return {show: true, message: action.payload};
        default:
            return state;
    }
}

export default combineReducers({
    users: multipleUsers,
    toast: toastMessage
})