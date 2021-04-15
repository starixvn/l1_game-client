const configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        "uat.sabagame.com": "sabagame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "uatproxy",
            port: "",
            path: "/uat/main"
        },
        1: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/taixiu",
            proxyRoute: "/uat/bigsmall/socket.io"
        },
        2: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/uat/sedie/socket.io"
        },
        3: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/baucua",
            proxyRoute: "/uat/fishprawncrab/socket.io"
        },
        4: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/txturbo",
            proxyRoute: "/uat/turbobigsmall/socket.io"
        },
        6: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/oeturbo",
            proxyRoute: "/uat/turbooddeven/socket.io"
        },
        7: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/dragontiger",
            proxyRoute: "/uat/dragontiger/socket.io"
        },
        8: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/kenopromax",
            proxyRoute: "/uat/kenopromax/socket.io"
        },
        9: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/minisedie",
            proxyRoute: "/uat/minisedie/socket.io"
        },
        10: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/baccarat",
            proxyRoute: "/uat/baccarat/socket.io"
        },
        21: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/roulette",
            proxyRoute: "/uat/roulette/socket.io"
        },
        22: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/uat/vsedie/socket.io"
        },
        23: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/blackjack",
            proxyRoute: "/uat/blackjack/socket.io"
        },
        24: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/specialsedie",
            proxyRoute: "/uat/specialsedie/socket.io"
        },
        25: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/sicbo",
            proxyRoute: "/uat/sicbo/socket.io"
        },
        26: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipfishprawncrab",
            proxyRoute: "/uat/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipbaccarat",
            proxyRoute: "/uat/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/vipsediewar",
            proxyRoute: "/uat/vipsediewar/socket.io"
        },
        29: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/fourguardians",
            proxyRoute: "/uat/fourguardians/socket.io"
        },
        31: {
            subDomain: "uatproxy",
            port: "",
            path: "/user/lottery",
            proxyRoute: "/uat/lottery/socket.io"
        }
    },
    sentry: {
        url: "https://08d902b128ea45b6a11639833224f481@sentryuat.sabagame.com/25",
        env: "UAT"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    userServiceUrl: "https://uatproxy.sabagame.com/uat/user"
};

module.exports = configs;
