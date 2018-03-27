import ServiceProxy from '../service-proxy';

let currentUser;

class User {
    constructor(userId) {
        console.log('userId = ', userId);
        this.userId = userId;
    }

    static async getInstance() {
        if (!currentUser) {
            let userData = await ServiceProxy.proxy('/user-info');
            console.log('userData = ', userData);

            currentUser = new User(userData.userId);
        }

        return currentUser;
    }
}

export default class CurrentUser {
    static async getUserId() {
        let userId = (await User.getInstance()).userId;
        console.log('got user id = ', userId);
        return userId;
    }

    static async getProfile() {
        let userId = await CurrentUser.getUserId();

        if (!currentUser.profile) {
            let profile = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                }
            })

            currentUser.profile = profile;
        }

        return currentUser.profile;
    }
}