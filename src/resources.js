let resources;
let savedCulture;

export default class Resources {
    static setCulture(culture) {
        savedCulture = culture;
    }

    static getCulture() {
        if (!savedCulture) {
            savedCulture = window.navigator.language.toLowerCase();
        }

        return savedCulture;
    }

    static getInstance(culture) {
        if (culture) {
            Resources.setCulture(culture);
        }

        if (!resources) {
            try {
                resources = require(`./languageResources/${Resources.getCulture()}`);
            } catch (ex) {
                resources = require(`./languageResources/zh-cn`);
            }
        }

        return resources;
    }
}