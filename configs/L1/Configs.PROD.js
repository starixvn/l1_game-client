const configs = {
    systemType: "SC1",
    ssl: true,
    serverDomainMapper: {
        "www.sabagame.com": "sabagame.com",
        "sabagame.com": "sabagame.com",
        "www.gamesaba.com": "gamesaba.com",
        "gamesaba.com": "gamesaba.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "proxy",
            port: "",
            path: "/main"
        },
        1: {
            subDomain: "proxy",
            port: "",
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "proxy",
            port: "",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "proxy",
            port: "",
            path: "/user/baucua",
            proxyRoute: "/fishprawncrab/socket.io"
        },
        4: {
            subDomain: "proxy",
            port: "",
            path: "/user/txturbo",
            proxyRoute: "/turbobigsmall/socket.io"
        },
        6: {
            subDomain: "proxy",
            port: "",
            path: "/user/oeturbo",
            proxyRoute: "/turbooddeven/socket.io"
        },
        7: {
            subDomain: "proxy",
            port: "",
            path: "/user/dragontiger",
            proxyRoute: "/dragontiger/socket.io"
        },
        8: {
            subDomain: "proxy",
            port: "",
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "proxy",
            port: "",
            path: "/user/minisedie",
            proxyRoute: "/minisedie/socket.io"
        },
        10: {
            subDomain: "proxy",
            port: "",
            path: "/user/baccarat",
            proxyRoute: "/baccarat/socket.io"
        },
        21: {
            subDomain: "proxy",
            port: "",
            path: "/user/roulette",
            proxyRoute: "/roulette/socket.io"
        },
        22: {
            subDomain: "proxy",
            port: "",
            path: "/user/vipsedie",
            proxyRoute: "/vsedie/socket.io"
        },
        23: {
            subDomain: "proxy",
            port: "",
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "proxy",
            port: "",
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "proxy",
            port: "",
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "proxy",
            port: "",
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "proxy",
            port: "",
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "proxy",
            port: "",
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        },
        29: {
            subDomain: "proxy",
            port: "",
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        }
    },
    sentryUrl: "https://19b3909c434341f0b13eb3a8529e5862@sentry.sabagame.com/9",
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    userServiceUrl: "https://proxy.sabagame.com/user"
};

module.exports = configs;
