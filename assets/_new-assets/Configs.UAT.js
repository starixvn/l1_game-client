const configs = {
    ssl: true,
    serverDomainMapper: {
        "uat.sabagame.com": 'sabagame.com',
    },
    serverGameEndPoints: {
        0: { //Main Server
            subDomain: "uat-gsr",
            port: "",
            path: ""
        },
        2: {
            subDomain: "uatsed",
            port: "",
            path: "/user/xocxoc"
        },
        22: {
            subDomain: "uatvipsedie",
            port: "",
            path: "/user/vipsedie"
        },
        24: {
            subDomain: 'uatproxy',
            port: '',
            path: '/user/specialsedie',
            proxyRoute: "/uat/specialsedie/socket.io"
        },
    },
    sentryUrl: 'https://e2d54dceaaab4ccc8e3b3b20d806d6ac@sentryuat.sabagame.com/30',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
}

module.exports = configs;