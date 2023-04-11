const defaultConfig = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
        "games.lumigame.com": "lumigame.com"
    },
    subDomain: "l1-proxy",
    env: "",
    sentry: {
        url: "",
        env: "LOCAL"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    subGuideDomain: "l1-guide",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false,
    SGConnectSubDomain: "connectsite",
    AppDownloadSubDomain: "l1-appdownload"
};

const domainMapper = window.envConfig ? undefined : defaultConfig.serverDomainMapper;
const configs =
    window.envConfig && window.envConfig.isDev
        ? defaultConfig
        : { ...defaultConfig, serverDomainMapper: domainMapper, ...window.envConfig };

module.exports = configs;
