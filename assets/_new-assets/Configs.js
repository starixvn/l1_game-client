const configs = {
  ssl: false,
  disabledDirectLogin: true,
  serverDomainMapper: {
    localhost: 'lumigame.com',
    '10.5.10.14': 'lumigame.com',
  },
  serverGameEndPoints: {
    0: { //Main Server
      subDomain: "",
      port: 8080,
      path: ""
    },
    2: {
      subDomain: "",
      port: 8082,
      path: "/user/xocxoc"
    }
  },
  gameIds: {
    TaiXiu: 1,
    XocXoc: 2,
    BauCua: 3,
    TaiXiuTurbo: 4,
    ChanLe: 5,
    ChanLeTurbo: 6,
    RongHo: 7,
    KenoProMax: 8,
    MiniSedie: 9,
    Baccarat: 10,
    KenoProViet: 11,
    KenoMax: 12,
    KenoMax2: 13,
    KenoMini: 14,
    KenoMini2: 15,
    KenoEast: 16,
    KenoWest: 17,
    KenoSouth: 18,
    KenoNorth: 19,
  },
  gameNames: {
    1: 'Tài Xỉu',
    2: 'Xóc Đĩa',
    3: 'Bầu Cua',
    4: 'Tài Xỉu Siêu Tốc',
    5: 'Chẵn Lẻ',
    6: 'Chẵn Lẻ Siêu Tốc',
    7: 'Rồng Hổ',
    8: 'Keno Pro Max',
    9: 'Xóc Đĩa Mini',
    10: 'Cào Baccarat',
    11: 'Keno Pro Viet',
    12: 'Keno Max',
    13: 'Keno Max 2',
    14: 'Keno Mini',
    15: 'Keno Mini 2',
    16: 'Keno Đông',
    17: 'Keno Tây',
    18: 'Keno Nam',
    19: 'Keno Bắc',
    21: "Roulette",
  },
  gameRoomRegNames: {
    8: 'KenoProMax',
    10: 'baccarat',
    21: 'roulette',
  },
  gameRoomIds: [8, 10, 21],
  gameRoomNewSocketIds: [2],
  sentryUrl: '',
  gameAnalytics: {
    clientId: '093146669bf12df12eeedd2d57ddb469',
    secretKey: 'f41dc948ed66a029406413327a68b6ae27fe4e6c',
  },
  kenoVietLotUrl:
    'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno',
  resultPageUrl:
    'http://result.lumigame.com/vi-VN/auth?key=58148de3-b895-4f6b-82de-a35eed1b4b28',

};

module.exports = configs;
