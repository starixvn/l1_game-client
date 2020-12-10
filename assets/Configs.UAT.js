const configs = {
  ssl: true,
  disabledDirectLogin: true,
  serverDomainMapper: {
    'uat.sabagame.net': 'sabagame.net',
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: 'uatproxy',
      port: '',
      path: '/uat/main',
      proxyRoute: '/uat/main',
    },
    2: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/xocxoc',
      proxyRoute: '/uat/sedie/socket.io',
    },
    22: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/vipsedie',
      proxyRoute: '/uat/vipsedie/socket.io',
    },
    23: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/blackjack',
      proxyRoute: '/uat/blackjack/socket.io',
    },
    24: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/specialsedie',
      proxyRoute: '/uat/specialsedie/socket.io',
    },
    25: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/sicbo',
      proxyRoute: '/uat/sicbo/socket.io',
    },
    26: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/vipfishprawncrab',
      proxyRoute: '/uat/vipfishprawncrab/socket.io',
    },
  },
  sentryUrl: 'https://7c448e6d62e14af6a041086f23642377@sentryuat.sabagame.com/49',
  kenoVietLotUrl: 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno',
};

module.exports = configs;
