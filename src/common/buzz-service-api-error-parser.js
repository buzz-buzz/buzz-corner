export default class BuzzServiceApiErrorParser {
    static isNewUser(error) {
        return error.status === 404 && error.result && error.result.error === 'The requested user does not exists';
    }
}