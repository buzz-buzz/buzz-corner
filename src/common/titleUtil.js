const titleUtil = {};

titleUtil.setTitle = (title) => {
    if(!title){
       title = 'BuzzBuzz';
    }
    document.title = title;
    let ua = navigator.userAgent;
    if (/\bMicroMessenger\/([\d.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        var i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = () => {
            setTimeout(() => {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }
};

export default titleUtil;