const configs = {
    ssl: false,
    disabledDirectLogin: true,
    serverDomainMapper: {
        localhost: "lumigame.com",
        "10.5.10.14": "lumigame.com"
    },
    serverGameEndPoints: {
        0: {
            //Main Server
            subDomain: "haproxy",
            port: 7001,
            path: "",
            proxyRoute: "/main"
        },
        2: {
            subDomain: "haproxy",
            port: "7001",
            path: "/user/xocxoc",
            proxyRoute: "/sedie/socket.io"
        },
        22: {
            subDomain: "haproxy",
            port: "7001",
            path: "/user/vipsedie",
            proxyRoute: "/vipsedie/socket.io"
        },
        23: {
            subDomain: "haproxy",
            port: "7001",
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

    sentryUrl: "https://bb445a2db0534a549906991ccf4bf895@sentryuat.sabagame.com/20",
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
    resultPageUrl: "http://result.lumigame.com/vi-VN/auth?key=58148de3-b895-4f6b-82de-a35eed1b4b28",
    systemType: "L2"
};

module.exports = configs;
