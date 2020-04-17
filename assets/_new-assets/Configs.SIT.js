const configs = {
    ssl: true,
    disabledDirectLogin: true,
    serverEndpoints: {
        "sit.saba.vin": 'sit-gsr.saba.vin',
    },
    gameIds: {
        TaiXiu: 1,
        XocXoc: 2,
        BauCua: 3,
        TaiXiuTurbo: 4,
    },
    gameNames: {
        1: "Tài Xỉu",
        2: "Xóc Đĩa",
        3: "Bầu Cua",
        4: "Tài Xỉu Siêu Tốc",
    },
    sentryUrl: 'https://08d902b128ea45b6a11639833224f481@sentry.saba.vin/25',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    }
}

module.exports = configs;