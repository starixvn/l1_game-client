const configs = {
    ssl: true,
    disabledDirectLogin: true,
    serverEndpoints: {
        "www.sabagame.com": 'gsr.sabagame.com',
        "sabagame.com": 'gsr.sabagame.com',
        "www.gamesaba.com": 'gsr.gamesaba.com',
        "gamesaba.com": 'gsr.gamesaba.com',
        "www.saba.win": 'gsr.saba.win',
        "saba.win": 'gsr.saba.win'
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
    sentryUrl: 'https://19b3909c434341f0b13eb3a8529e5862@sentry.saba.vin/9',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    }
}

module.exports = configs;