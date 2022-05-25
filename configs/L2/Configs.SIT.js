const configs = {
    systemType: "SC2",
    ssl: true,
    disabledDirectLogin: true,
    serverDomainMapper: {
        "l2sit.sgamesuat.com": "sgamesuat.com"
    },
    subDomain: "l2uatproxy",
    env: "sit",
    sentry: {
        url: "https://df0ce89a96b045e4ae626c16a143d8f9@scsentry.sgamesuat.com/51",
        env: "SIT"
    },
    guideDomain: "https://l2guidessit.sgamesuat.com",
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
