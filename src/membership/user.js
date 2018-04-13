import ServiceProxy from '../service-proxy';

let currentUser;

class User {
    constructor(userId) {
        this.userId = userId;
    }

    static async getInstance() {
        if (!currentUser) {
            try {
                //let userData = await ServiceProxy.proxy('/user-info');

                currentUser = new User(351);
            } catch (ex) {
                await User.signOut();
            }
        }

        return currentUser;
    }

    static async signOut() {
        User.destroy();
        try {
            await ServiceProxy.proxy(`/sign-out`);
        } catch (ex) {
            console.error(ex);
        } finally {
            window.location.href = `/select-role?return_url=${encodeURIComponent(window.location.pathname + (window.location.search || '')) }`;
        }
    }

    static destroy() {
        if (currentUser) {
            currentUser = null;
        }
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
                    await User.signOut();
                }

                throw ex;
            }
        }

        return currentUser.profile;
    }
}
