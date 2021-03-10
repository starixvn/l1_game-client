const configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        "sit.sabagame.com": "sabagame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "uatproxy",
            port: "",
            path: "/sit/main"
        },
        1: {
            subDomain: "haproxy",
            port: "",
            path: "/user/taixiu",
            proxyRoute: "/sit/bigsmall/socket.io"
        },
        2: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sit/sedie/socket.io"
        },
        3: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/baucua",
            proxyRoute: "/sit/baucua/socket.io"
        },
        7: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/dragontiger",
            proxyRoute: "/sit/dragontiger/socket.io"
        },
        8: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/kenopromax",
            proxyRoute: "/sit/kenopromax/socket.io"
        },
        9: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/minisedie",
            proxyRoute: "/sit/minisedie/socket.io"
        },
        10: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/baccarat",
            proxyRoute: "/sit/baccarat/socket.io"
        },
        22: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/sit/vipsedie/socket.io"
        },
        23: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/blackjack",
            proxyRoute: "/sit/blackjack/socket.io"
        },
        24: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/specialsedie",
            proxyRoute: "/sit/specialsedie/socket.io"
        },
        25: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/sicbo",
            proxyRoute: "/sit/sicbo/socket.io"
        },
        26: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipfishprawncrab",
            proxyRoute: "/sit/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipbaccarat",
            proxyRoute: "/sit/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipsediewar",
            proxyRoute: "/sit/vipsediewar/socket.io"
        },
        29: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/fourguardians",
            proxyRoute: "/sit/fourguardians/socket.io"
        }
    },
    sentryUrl: "https://08d902b128ea45b6a11639833224f481@sentryuat.sabagame.com/25",
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno"
};

module.exports = configs;
