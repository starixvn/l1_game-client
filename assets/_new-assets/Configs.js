const configs = {
  ssl: false,
  disabledDirectLogin: true,
  serverDomainMapper: {
    localhost: 'lumigame.com',
    '10.5.10.14': 'lumigame.com',
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: 'haproxy',
      port: 7000,
      path: '',
      proxyRoute: '/main',
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
      subDomain: 'haproxy',
      port: '7000',
      path: '/user/blackjack',
      proxyRoute: '/blackjack/socket.io',
    },
    24: {
      subDomain: 'haproxy',
      port: 7001,
      path: '/user/specialsedie',
      proxyRoute: '/specialsedie/socket.io',
    },
    26: {
      subDomain: 'haproxy',
      port: 7000,
      path: '/user/vipfishprawncrab',
      proxyRoute: '/vipfishprawncrab/socket.io',
    },
  },
  sentryUrl: 'https://bb445a2db0534a549906991ccf4bf895@sentryuat.sabagame.com/20',
  gameAnalytics: {
    clientId: '093146669bf12df12eeedd2d57ddb469',
    secretKey: 'f41dc948ed66a029406413327a68b6ae27fe4e6c',
  },
  kenoVietLotUrl: 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno',
  resultPageUrl: 'http://result.lumigame.com/vi-VN/auth?key=58148de3-b895-4f6b-82de-a35eed1b4b28',
};

module.exports = configs;
