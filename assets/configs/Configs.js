const defaultConfig = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
        "l1-games3.lumigame.com": "lumigame.com"
    },
    subDomain: "l1-proxy3",
    env: "",
    sentry: {
        url: "",
        env: "LOCAL3"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    guideDomain: "https://l1-guide-3.lumigame.com",
    enableMsgpackParserAllGames: false,
    enableMsgpackParserOnNotification: false
};

const configs = window.envConfig && window.envConfig.isDev ? defaultConfig : { ...defaultConfig, ...window.envConfig };

module.exports = configs;
