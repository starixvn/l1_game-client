const configs = {
    ssl: false,
    serverDomainMapper: {
        "l2-games1.lumigame.com": "lumigame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "haproxy",
            port: 7101,
            path: "",
            proxyRoute: "/main"
        },
        2: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        22: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/vipsedie",
            proxyRoute: "/vipsedie/socket.io"
        },
        23: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/blackjack",
            proxyRoute: "/blackjack/socket.io"
        },
        24: {
            subDomain: "haproxy",
            port: 7101,
            path: "/user/specialsedie",
            proxyRoute: "/specialsedie/socket.io"
        },
        25: {
            subDomain: "haproxy",
            port: 7101,
            path: "/user/sicbo",
            proxyRoute: "/sicbo/socket.io"
        },
        26: {
            subDomain: "haproxy",
            port: 7101,
            path: "/user/vipfishprawncrab",
            proxyRoute: "/vipfishprawncrab/socket.io"
        },
        27: {
            subDomain: "haproxy",
            port: 7101,
            path: "/user/vipbaccarat",
            proxyRoute: "/vipbaccarat/socket.io"
        },
        28: {
            subDomain: "haproxy",
            port: 7101,
            path: "/user/vipsediewar",
            proxyRoute: "/vipsediewar/socket.io"
        }
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    sentryUrl: "https://4c2b6824d6ed41f291540878d9c76181@sentryuat.sabagame.com/50"
};

module.exports = configs;
