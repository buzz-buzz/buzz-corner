export default class URLHelper {
    static getSearchParam(search, name) {
        if (window.URLSearchParams) {
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
}