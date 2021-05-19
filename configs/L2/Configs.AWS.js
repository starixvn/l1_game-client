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
        1: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/baucua",
            proxyRoute: "/fishprawncrab/socket.io"
        },
        4: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/txturbo",
            proxyRoute: "/turbobigsmall/socket.io"
        },
        6: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/oeturbo",
            proxyRoute: "/turbooddeven/socket.io"
        },
        7: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/dragontiger",
            proxyRoute: "/dragontiger/socket.io"
        },
        8: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/minisedie",
            proxyRoute: "/minisedie/socket.io"
        },
        10: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/baccarat",
            proxyRoute: "/baccarat/socket.io"
        },
        21: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/roulette",
            proxyRoute: "/socket.io"
        },
        22: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/vsedie/socket.io"
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
        },
        31: {
            subDomain: "sc2-proxy",
            port: "",
            path: "/user/lottery",
            proxyRoute: "/lottery/socket.io"
        }
    },
    sentry: {
        url: "https://eb5f1c92d1da4cb6a059fa40c1276a9d@sentry.sabagame.com/48",
        env: "AWS"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno"
};

module.exports = configs;
