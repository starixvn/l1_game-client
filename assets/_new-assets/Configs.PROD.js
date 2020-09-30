const configs = {
    ssl: true,
    serverDomainMapper: {
        "www.sabagame.com": 'sabagame.com',
        "sabagame.com": 'sabagame.com',
        "www.gamesaba.com": 'gamesaba.com',
        "gamesaba.com": 'gamesaba.com'
    },
    serverGameEndPoints: {
        0: { //Main Server
            subDomain: "gsr",
            port: "",
            path: ""
        },
        2: {
            subDomain: "sed",
            port: "",
            path: "/user/xocxoc"
        },
        22: {
            subDomain: "vipsedie",
            port: "",
            path: "/user/vipsedie"
        },
        24: {
            subDomain: 'proxy',
            port: '',
            path: '/user/specialsedie',
            proxyRoute: "/specialsedie/socket.io"
        },
    },
    sentryUrl: 'https://19b3909c434341f0b13eb3a8529e5862@sentry.sabagame.com/9',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
}

module.exports = configs;