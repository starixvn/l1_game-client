const configs = {
    systemType: "SC2",
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
        1: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/taixiu",
            proxyRoute: "/bigsmall/socket.io"
        },
        2: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        3: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/baucua",
            proxyRoute: "/fishprawncrab/socket.io"
        },
        7: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/dragontiger",
            proxyRoute: "/dragontiger/socket.io"
        },
        8: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/kenopromax",
            proxyRoute: "/kenopromax/socket.io"
        },
        9: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/minisedie",
            proxyRoute: "/minisedie/socket.io"
        },
        10: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/baccarat",
            proxyRoute: "/baccarat/socket.io"
        },
        21: {
            subDomain: "haproxy",
            port: "7101",
            path: "/user/roulette",
            proxyRoute: "/roulette/socket.io"
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
            proxyRoute: "/vsediewar/socket.io"
        },
        29: {
            subDomain: "haproxy",
            port: 7101,
            path: "/user/fourguardians",
            proxyRoute: "/fourguardians/socket.io"
        }
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    sentryUrl: "https://4c2b6824d6ed41f291540878d9c76181@sentryuat.sabagame.com/50"
};

module.exports = configs;
