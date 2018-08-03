async function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        let signInUrl = `${window.location.origin}/sign-in`;
        if (response.url.indexOf(signInUrl) === 0) {
            window.location.href = `${signInUrl}?return_url=${encodeURIComponent(window.location.pathname + (window.location.search || ''))}`;
        }
        return response;
    } else {
        const error = new Error(`
            HTTP
            Error: ${response.statusText}`);
        error.statusText = response.statusText;
        error.status = response.status;
        if (response.status === 401) {
            error.authPath = await response.text();
        } else {
            let errorResult = await response.text();
            try {
                error.result = JSON.parse(errorResult);
            } catch (e) {
                error.result = errorResult;
            }
        }

        throw error;
    }
}

async function handleError(ex) {
    if (ex.status === 401 && ex.authPath) {
        window.location.href = ex.authPath;
        return;
    }

    throw ex;
}

export default {
    proxy: async function (url, options) {
        if (options && options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            options.body = JSON.stringify(options.body);
        }

        try {
            let mergedOptions = Object.assign({
                accept: 'application/json',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            }, options);

            let res = (await checkStatus(await fetch(url, mergedOptions)));

            if (res.redirected && (res.url.startsWith(`${window.location.origin}/select-role`) || res.url.startsWith(`${window.location.origin}/sign-in`))) {
                let error = new Error(res.url);
                error.status = 401;
                error.authPath = res.url;

                throw error;
            }

            let textResult = typeof res.text === 'function' ? await res.text() : res.body;
            if (mergedOptions.accept === 'application/json') {
                try {
                    return JSON.parse(textResult);
                } catch (ex) {
                    return textResult;
                }
            } else {
                return textResult;
            }
        } catch (ex) {
            await handleError(ex);
        }
    },

    proxyTo: async function (options) {
        options.method = options.method || 'POST';
        return await this.proxy('/proxy', options);
    }
}
