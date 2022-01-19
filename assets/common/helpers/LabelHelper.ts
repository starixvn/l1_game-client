const updateCacheModeFollowLanguage = (message: cc.Label) => {
    switch (window.i18n.curLang) {
        case "vi":
        case "en":
        case "id":
            message.cacheMode = 2;
            break;
        default:
            message.cacheMode = 0;
            break;
    }

    return message.cacheMode;
};

export { updateCacheModeFollowLanguage };
