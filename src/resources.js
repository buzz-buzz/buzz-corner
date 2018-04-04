let resources;

export default class Resources {
    static setCulture(culture) {
        try {
            resources = require(`./languageResources/${culture}`);
        } catch (ex) {
            resources = require(`./languageResources/zh-CN`);
        }
    }

    static getInstance() {
        if (!resources) {
            Resources.setCulture(window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US');
        }

        return resources;
    }
}