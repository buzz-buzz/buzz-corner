import ServiceProxy from '../service-proxy';

let currentUser;

class User {
    constructor(userId) {
        this.userId = userId;
    }

    static async getInstance() {
        if (!currentUser) {
            let userData = await ServiceProxy.proxy('/user-info');

            currentUser = new User(userData.userId);
        }

        return currentUser;
    }
}

export default class CurrentUser {
    static async getUserId() {
        return (await User.getInstance()).userId;
    }
}