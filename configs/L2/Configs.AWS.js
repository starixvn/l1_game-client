const configs = {
    systemType: "SC2",
    ssl: true,
    disabledDirectLogin: true,
    serverDomainMapper: {
        "sc2-games.sportsfun.app": "sportsfun.app"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "sc2-proxy",
            port: "",
            path: "/main",
            proxyRoute: "/main"
        },
        2: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        22: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/vipsedie/socket.io"
        },
        23: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        },
        29: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        }
    },
    sentryUrl: "https://eb5f1c92d1da4cb6a059fa40c1276a9d@sentry.sabagame.com/48",
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno"
};

module.exports = configs;
