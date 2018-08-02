export default class RequestHelper {
    static isXHR(context) {
        let xRequestedWith = context.request.get('X-Requested-With');

        return xRequestedWith === 'XMLHttpRequest';
    }
}
