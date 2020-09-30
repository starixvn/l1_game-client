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
      proxyRoute: "/uat/main"
    },
    2: {
        subDomain: "uatproxy",
        port: "",
        path: "/user/xocxoc",
        proxyRoute: "/uat/sedie/socket.io"
    },
    sentryUrl: 'https://e2d54dceaaab4ccc8e3b3b20d806d6ac@sentryuat.sabagame.com/30',
    gameAnalytics: {
        clientId: "093146669bf12df12eeedd2d57ddb469",
        secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c"
    },
    kenoVietLotUrl: "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno",
}

module.exports = configs;
