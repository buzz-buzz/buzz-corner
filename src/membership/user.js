import ServiceProxy from '../service-proxy';
import ErrorHandler from "../common/error-handler";

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
                currentUser = new User(userData.userId, userData.profile.isSuper, userData.profile);
            } catch (ex) {
                if (ex.message.startsWith('http')) {
                    window.location.href = ex.message;
                } else {
                    ErrorHandler.notify('获取当前用户信息出错', ex);
                }
                return {};
            }
        }

        return currentUser;
    }

    static async signOut() {
        User.destroy();
        try {
            await ServiceProxy.proxy(`/sign-out`);
        } catch (ex) {
            if (ex.message.startsWith('http')) {
                window.location.href = ex.message;
            } else {
                console.error(ex);
                window.location.href = `/select-role?return_url=${encodeURIComponent(window.location.pathname + (window.location.search || ''))}`;
            }
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

    static async signOut() {
        await User.signOut();
    }
}
