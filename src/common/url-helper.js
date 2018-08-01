export default class URLHelper {
    static getSearchParam(search, name) {
        if (typeof window.URLSearchParams !== 'undefined') {
            let urlSearchParams = new window.URLSearchParams(search);
            let value = urlSearchParams.get(name);

            if (value) {
                return value;
            }
        }

        let pairs = search.replace('?', '').split('&');

        for (let i = 0; i < pairs.length; i++) {
            let keyValue = pairs[i].split('=');

            if (keyValue[0] === name) {
                return keyValue[1]
            }
        }

        return '';
    }

    static handleOrigin() {
        let callbackOrigin = URLHelper.getSearchParam(window.location.search, 'callback_origin');

        if (callbackOrigin) {
            try {
                callbackOrigin = atob(callbackOrigin);
            } catch (ex) {
                return false;
            }
        }

        if (callbackOrigin && callbackOrigin !== window.location.origin) {
            window.location = callbackOrigin + window.location.pathname + window.location.search;

            return true;
        }

        return false;
    }
}
