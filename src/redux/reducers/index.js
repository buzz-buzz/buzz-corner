import {combineReducers} from 'redux'
import {ADD_USER, ADD_USERS, CLEAR_USERS, REPLACE_CLASS_LIST, TOAST} from '../actions/index'

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

        case CLEAR_USERS:
            return []

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

function currentUserClassList(state = null, action) {
    switch (action.type) {
        case REPLACE_CLASS_LIST:
            return action.classList
        default:
            return state;
    }
}

export default combineReducers({
    users: multipleUsers,
    toast: toastMessage,
    currentUserClassList: currentUserClassList
})
