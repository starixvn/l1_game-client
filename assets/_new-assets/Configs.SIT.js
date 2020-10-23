const configs = {
    ssl: true,
    serverDomainMapper: {
        "sit.sabagame.com": 'sabagame.com',
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: 'uatproxy',
            port: '',
            path: '',
            proxyRoute: "/sit/main"
        },
        2: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sit/sedie/socket.io"
        },
        22: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/sit/vipsedie/socket.io"
        },
        23: {
            subDomain: "uatproxy",
            port: '',
            path: "/user/blackjack",
            proxyRoute: "/sit/blackjack/socket.io"
        },
        24: {
            subDomain: 'uatproxy',
            port: '',
            path: '/user/specialsedie',
            proxyRoute: "/sit/specialsedie/socket.io"
        },
    },
    sentryUrl: 'https://08d902b128ea45b6a11639833224f481@sentryuat.sabagame.com/25',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
}

module.exports = configs;