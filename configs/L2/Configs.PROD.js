const configs = {
    systemType: "SC2",
    ssl: true,
    disabledDirectLogin: true,
    serverDomainMapper: {
        "www.v-gaming.net": "v-gaming.net",
        "v-gaming.net": "v-gaming.net"
    },
    subDomain: "proxy",
    env: "",
    sentry: {
        url: "https://eb5f1c92d1da4cb6a059fa40c1276a9d@sentry.sabagame.com/48",
        env: "PRO"
    },
    guideDomain: "https://guides.v-gaming.net",
    enableMsgpackParserOnGame: {
        45: true,
        42: true,
        1: true,
        2: true,
        3: true,
        4: true,
        9: true,
        10: true,
        22: true,
        25: true,
        27: true,
        46: true
    },
    enableMsgpackParserOnNotification: true
};

module.exports = configs;
