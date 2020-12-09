const configs = {
  ssl: false,
  serverDomainMapper: {
    'l1-games1.lumigame.com': 'lumigame.com',
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: 'haproxy',
      port: 7002,
      path: '',
      proxyRoute: '/main',
    },
    2: {
      subDomain: 'haproxy',
      port: 7002,
      path: '/user/xocxoc',
      proxyRoute: '/sedie/socket.io',
    },
    22: {
      subDomain: 'haproxy',
      port: 7002,
      path: '/user/vipsedie',
      proxyRoute: '/vipsedie/socket.io',
    },
    23: {
      subDomain: 'haproxy',
      port: 7002,
      path: '/user/blackjack',
      proxyRoute: '/blackjack/socket.io',
    },
    24: {
      subDomain: 'haproxy',
      port: 7002,
      path: '/user/specialsedie',
      proxyRoute: '/specialsedie/socket.io',
    },
    25: {
      subDomain: 'haproxy',
      port: 7002,
      path: '/user/sicbo',
      proxyRoute: '/sicbo/socket.io',
    },
    26: {
      subDomain: 'haproxy',
      port: 7002,
      path: '/user/vipfishprawncrab',
      proxyRoute: '/vipfishprawncrab/socket.io',
    },
  },
  sentryUrl: 'https://fa56ea3af2784789a971ee09e84b57df@sentryuat.sabagame.com/185',
  gameAnalytics: {
    clientId: '093146669bf12df12eeedd2d57ddb469',
    secretKey: 'f41dc948ed66a029406413327a68b6ae27fe4e6c',
  },
  kenoVietLotUrl: 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno',
};

module.exports = configs;
