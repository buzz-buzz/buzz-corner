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

    static async getProfile(force) {
        let userId = await CurrentUser.getUserId();

        if (!userId) {
            window.location.href = `/sign-in?return_url=${encodeURIComponent(window.location.pathname)}${window.location.search || ''}`;
        }

        if (force || !currentUser.profile) {
            let profile = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}?t=${new Date().getTime()}`
                }
            }).catch(e => {
              window.location.href = `/sign-in?return_url=${encodeURIComponent(window.location.pathname)}${window.location.search || ''}`;
            });

            currentUser.profile = profile;
        }

        return currentUser.profile;
    }
}
