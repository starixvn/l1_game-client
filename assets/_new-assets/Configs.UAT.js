const configs = {
  ssl: true,
  serverDomainMapper: {
    'uat.sabagame.com': 'sabagame.com',
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: 'uatproxy',
      port: '',
      path: '/uat/main',
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
    27: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/vipbaccarat',
      proxyRoute: '/uat/vipbaccarat/socket.io',
    },
    28: {
      subDomain: 'uatproxy',
      port: '',
      path: '/user/vipsediewar',
      proxyRoute: '/uat/vipsediewar/socket.io',
    },
  },
  sentryUrl: 'https://e2d54dceaaab4ccc8e3b3b20d806d6ac@sentryuat.sabagame.com/30',
  gameAnalytics: {
    clientId: '093146669bf12df12eeedd2d57ddb469',
    secretKey: 'f41dc948ed66a029406413327a68b6ae27fe4e6c',
  },
  kenoVietLotUrl: 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno',
};

module.exports = configs;
