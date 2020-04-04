const configs = {
    ssl: true,
    disabledDirectLogin: true,
    gameServerUrl: 'https://sit-gsr.saba.vin/',
    webSocketEndpoint: 'sit-gsr.saba.vin',
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
    sentryUrl: 'https://1531d94a789547ffbd304c1ada616bc9@sentry.io/5176896',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    }
}

module.exports = configs;