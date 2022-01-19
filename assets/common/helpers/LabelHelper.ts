const updateCacheModeFollowLanguage = (message: cc.Label) => {
    const currentLanguage = window?.i18n?.curLang ?? "en";
    switch (currentLanguage) {
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
