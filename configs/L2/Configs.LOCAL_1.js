const configs = {
    systemType: "SC2",
    ssl: true,
    serverDomainMapper: {
        "l2-games1.lumigame.com": "lumigame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "l2-proxy1",
            port: "",
            path: "/main",
            proxyRoute: "/main"
        },
        1: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/baucua",
            proxyRoute: "/fishprawncrab/socket.io"
        },
        4: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/txturbo",
            proxyRoute: "/turbobigsmall/socket.io"
        },
        6: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/oeturbo",
            proxyRoute: "/turbooddeven/socket.io"
        },
        7: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/dragontiger",
            proxyRoute: "/dragontiger/socket.io"
        },
        8: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/minisedie",
            proxyRoute: "/minisedie/socket.io"
        },
        10: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/baccarat",
            proxyRoute: "/baccarat/socket.io"
        },
        21: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/roulette",
            proxyRoute: "/roulette/socket.io"
        },
        22: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/vsedie/socket.io"
        },
        23: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        },
        29: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        },
        31: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/lottery",
            proxyRoute: "/lottery/socket.io"
        },
        35: {
            subDomain: "l2-proxy1",
            port: "",
            path: "/user/threecards",
            proxyRoute: "/threecards/socket.io"
        }
    },
    sentry: {
        url: "https://b015ef787273452c8fce4af733e62d59@sentry.lumigame.com/29",
        env: "LOCAL_1"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    userServiceUrl: "https://l2-proxy1.lumigame.com/user"
};

module.exports = configs;
