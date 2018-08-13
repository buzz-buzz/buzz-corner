export const ADD_USER = 'ADD_USER'
export const ADD_USERS = 'ADD_USERS'
export const CLEAR_USERS = 'CLEAR_USERS'
export const TOAST = 'TOAST'
export const REPLACE_CLASS_LIST = 'REPLACE_CLASS_LIST'

export function addUser(payload) {
    return {type: ADD_USER, payload}
}

export function addUsers(users) {
    return {type: ADD_USERS, payload: users}
}

export function clearUsers() {
    return {type: CLEAR_USERS, payload: {}}
}

export function toastMessage(message) {
    return {type: TOAST, payload: message}
}

export function replaceCurrentUserClassList(classList) {
    return {type: REPLACE_CLASS_LIST, classList}
}
