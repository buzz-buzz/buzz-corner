import ServiceProxy from '../service-proxy';

let currentUser;

class User {
    constructor(userId, isSuper, profile) {
        this.userId = userId;
        this.isSuper = isSuper;
        this.profile = profile;
    }

    static async getInstance() {
        if (!currentUser) {
            try {
                let userData = await ServiceProxy.proxy('/user-info');

                if (typeof userData !== 'object' || !userData.userId) {
                    await User.signOut();
                    return;
                }

                currentUser = new User(userData.userId, userData.super, userData.profile);
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
    static async isSuper() {
        return (await User.getInstance()).isSuper;
    }

    static async getUserId() {
        return (await User.getInstance()).userId;
    }

    static async getProfile(refresh) {
        if (refresh) {
            User.destroy();
        }

        let instance = await User.getInstance();
        return instance.profile;
    }
}
