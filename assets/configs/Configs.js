const defaultConfig = {
    systemType: "SC2",
    ssl: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
        "l2-games1.lumigame.com": "lumigame.com"
    },
    subDomain: "l1-proxy",
    env: "",
    sentry: {
        url: "",
        env: "LOCAL1"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    guideDomain: "https://l2-guide-1.lumigame.com",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false
};

const configs = window.envConfig && window.envConfig.isDev ? defaultConfig : { ...defaultConfig, ...window.envConfig };

module.exports = configs;
