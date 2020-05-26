const configs = {
    ssl: false,
    disabledDirectLogin: true,
    serverEndpoints: {
        "games.lumigame.com": 'lumigame.com:8080',
    },
    gameIds: {
        TaiXiu: 1,
        XocXoc: 2,
        BauCua: 3,
        TaiXiuTurbo: 4,
        ChanLe: 5,
        ChanLeTurbo: 6,
        RongHo: 7,
        KenoProMax: 8,
        MiniSedie: 9,
    },
    gameNames: {
        1: "Tài Xỉu",
        2: "Xóc Đĩa",
        3: "Bầu Cua",
        4: "Tài Xỉu Siêu Tốc",
        5: "Chẵn Lẻ",
        6: "Chẳn Lẻ Siêu Tốc",
        7: "Rồng Hổ",
        8: "Keno Pro Max",
        9: "Xóc Đĩa Mini",
    },
    sentryUrl: 'https://bb445a2db0534a549906991ccf4bf895@sentry.saba.vin/20',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    }
}

module.exports = configs;