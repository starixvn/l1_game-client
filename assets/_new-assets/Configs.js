const configs = {
    ssl: false,
    disabledDirectLogin: false,
    serverEndpoints: {
        "localhost": '124.158.13.228:8080',
    },
    gameIds: {
        TaiXiu: 1,
        XocXoc: 2,
        BauCua: 3,
        MiniPoker: 4
    },
    gameNames: {
        1: "Tài Xỉu",
        2: "Xóc Đĩa",
        3: "Bầu Cua"
    },
    sentryUrl: 'https://bb445a2db0534a549906991ccf4bf895@sentry.saba.vin/20',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    }
}

module.exports = configs;