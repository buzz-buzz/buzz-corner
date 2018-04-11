import ServiceProxy from '../service-proxy';

let currentUser;

class User {
    constructor(userId) {
        this.userId = userId;
    }

    static async getInstance() {
        if (!currentUser) {
            try {
                let userData = await ServiceProxy.proxy('/user-info');

                currentUser = new User(userData.userId);
            } catch (ex) {
                User.redirectToSignInPage();
            }
        }

        return currentUser;
    }

    static redirectToSignInPage() {
        console.log('redirecting...');
        window.location.href = `/select-role?return_url=${encodeURIComponent(window.location.pathname + (window.location.search || '')) }`;
    }
}

export default class CurrentUser {
    static async getUserId() {
        return (await User.getInstance()).userId;
    }

    static async getProfile(force) {
        let userId = await CurrentUser.getUserId();

        if (force || !currentUser.profile) {
            try {
                currentUser.profile = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${userId}?t=${new Date().getTime()}`
                    }
                });
            } catch (ex) {
                if (ex.status === 404) {
                    await ServiceProxy.proxy(`/sign-out`);

                    User.redirectToSignInPage();
                }

                throw ex;
            }
        }

        return currentUser.profile;
    }
}
