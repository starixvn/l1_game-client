const configs = {
    systemType: "SC1",
    ssl: false,
    serverDomainMapper: {
        "l1-games1.lumigame.com": "lumigame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "haproxy",
            port: 7001,
            path: "",
            proxyRoute: "/main"
        },
        1: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/baucua",
            proxyRoute: "/fishprawncrab/socket.io"
        },
        4: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/txturbo",
            proxyRoute: "/turbobigsmall/socket.io"
        },
        6: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/oeturbo",
            proxyRoute: "/turbooddeven/socket.io"
        },
        7: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/dragontiger",
            proxyRoute: "/dragontiger/socket.io"
        },
        8: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/minisedie",
            proxyRoute: "/minisedie/socket.io"
        },
        10: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/baccarat",
            proxyRoute: "/baccarat/socket.io"
        },
        21: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/roulette",
            proxyRoute: "/roulette/socket.io"
        },
        22: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/vipsedie",
            proxyRoute: "/vsedie/socket.io"
        },
        23: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        },
        29: {
            subDomain: "haproxy",
            port: 7001,
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        }
    },
    sentryUrl: "https://fa56ea3af2784789a971ee09e84b57df@sentryuat.sabagame.com/185",
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    userServiceUrl: "http://haproxy.lumigame.com:7001/user"
};

module.exports = configs;
