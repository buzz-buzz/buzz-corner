let resources;

export default class Resources {
    static setCulture(culture) {
        try {
            resources = require(`./languageResources/${culture}`);
        } catch (ex) {
            resources = require(`./languageResources/zh-CN`);
        }
    }

    static getInstance(culture) {
        if (culture) {
            return require(`./languageResources/${culture}`);
        }

        if (!resources) {
            Resources.setCulture(window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US');
        }

        return resources;
    }
}