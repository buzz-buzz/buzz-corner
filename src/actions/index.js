export const ADD_USER = 'ADD_USER'
export const ADD_USERS = 'ADD_USERS'

export function addUser(payload) {
    return { type: ADD_USER, payload }
}

export function addUsers(users) {
    return { type: ADD_USERS, payload: users }
}