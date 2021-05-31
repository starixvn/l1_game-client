const configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
        "10.5.10.14": "lumigame.com",
        "games.lumigame.com": "lumigame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "l1-proxy",
            port: "",
            path: "/main",
            proxyRoute: "/main"
        },
        1: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/baucua",
            proxyRoute: "/fishprawncrab/socket.io"
        },
        4: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/txturbo",
            proxyRoute: "/turbobigsmall/socket.io"
        },
        6: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/oeturbo",
            proxyRoute: "/turbooddeven/socket.io"
        },
        7: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/dragontiger",
            proxyRoute: "/dragontiger/socket.io"
        },
        8: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/minisedie",
            proxyRoute: "/minisedie/socket.io"
        },
        10: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/baccarat",
            proxyRoute: "/baccarat/socket.io"
        },
        21: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/roulette",
            proxyRoute: "/roulette/socket.io"
        },
        22: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/vsedie/socket.io"
        },
        23: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        },
        29: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        },
        31: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/lottery",
            proxyRoute: "/lottery/socket.io"
        },
        35: {
            subDomain: "l1-proxy",
            port: "",
            path: "/user/threecards",
            proxyRoute: "/threecards/socket.io"
        }
    },
    sentry: {
        url: "https://2af29bdacdbf4d9ba2db6600b450541f@sentry.lumigame.com/28",
        env: "DEV"
    },
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    userServiceUrl: "https://l1-proxy.lumigame.com/user"
};

module.exports = configs;
