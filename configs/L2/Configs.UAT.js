const configs = {
    systemType: "SC2",
    ssl: true,
    disabledDirectLogin: true,
    serverDomainMapper: {
        "uat.sabagame.net": "sabagame.net"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "uatproxy",
            port: "",
            path: "/uat/main",
            proxyRoute: "/uat/main"
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
            proxyRoute: "/uat/baucua/socket.io"
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
            proxyRoute: "/uat/vipsedie/socket.io"
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
        }
    },
    sentryUrl: "https://7c448e6d62e14af6a041086f23642377@sentryuat.sabagame.com/49",
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno"
};

module.exports = configs;
