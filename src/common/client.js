export const ClientType = {
    LargeScreen: 'tablet',
    Mobile: 'phone'
}

export default class Client {

    static showComponent(mobileView, largeScreenView) {
<<<<<<< HEAD
=======
        return mobileView;

>>>>>>> master
        let client = Client.getClient();

        if (client === ClientType.Mobile) {
            return mobileView;
        } else {
            return largeScreenView;
        }
    }

    static getClient() {
        const width = window.screen.width;
        const height = window.screen.height;
        return Math.min(width, height) >= 600 ? ClientType.LargeScreen : ClientType.Mobile;
    }
}