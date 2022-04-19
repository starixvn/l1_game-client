const configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        "sit.sabagame.com": "sgamesuat.com",
        "l1sit.sgamesuat.com": "sgamesuat.com"
    },
    subDomain: "l1uatproxy",
    env: "sit",
    sentry: {
        url: "https://08d902b128ea45b6a11639833224f481@scsentry.sgamesuat.com/25",
        env: "SIT"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    guideDomain: "https://l1guidessit.sgamesuat.com",
    enableMsgpackParserOnGame: {
        45: true,
        42: true,
        1: true,
        2: true,
        4: true,
        9: true,
        10: false,
        22: true,
        27: false
    }
};

module.exports = configs;
