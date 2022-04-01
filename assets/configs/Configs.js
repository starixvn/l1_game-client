const configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
        "l1-games3.lumigame.com": "lumigame.com"
    },
    subDomain: "l1-proxy3",
    env: "",
    sentry: {
        url: "https://2af29bdacdbf4d9ba2db6600b450541f@sentry.lumigame.com/28",
        env: "LOCAL"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    guideDomain: "https://l1-guide-3.lumigame.com",
    enableMsgpackParserOnGame: {
        45: false,
        1: true,
        2: true,
        4: true,
        9: true,
        10: false,
        22: false,
        27: true
    },
    enableMD5OnGame: [1, 4, 2, 9, 22, 10, 27]
};

module.exports = configs;
