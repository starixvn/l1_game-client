const configs = {
    systemType: "SC1",
    ssl: false,
    serverDomainMapper: {
        // localhost: "lumigame.com",
        localhost: "localhost",
        "10.5.10.14": "lumigame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "haproxy",
            port: 8080,
            path: "",
            proxyRoute: "/main"
        },
        1: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "haproxy",
            port: "7002",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "",
            port: "8085",
            path: "/user/baucua",
            proxyRoute: ""
        },
        8: {
            subDomain: "haproxy",
            port: "7002",
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "haproxy",
            port: "7002",
            path: "/user/minisedie",
            proxyRoute: ""
        },
        22: {
            subDomain: "haproxy",
            port: "7002",
            path: "/user/vipsedie",
            proxyRoute: "/vipsedie/socket.io"
        },
        23: {
            subDomain: "haproxy",
            port: "7002",
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        },
        29: {
            subDomain: "haproxy",
            port: 7002,
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        }
    },
    sentryUrl: "https://bb445a2db0534a549906991ccf4bf895@sentryuat.sabagame.com/20",
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno"
};

module.exports = configs;
