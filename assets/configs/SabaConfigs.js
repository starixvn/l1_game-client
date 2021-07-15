const configs = {
    GameIds: {
        Lobby: 0,
        BigSmall: 1,
        SeDie: 2,
        FishPrawnCrab: 3,
        TurboBigSmall: 4,
        TurboOddEven: 6,
        DragonTiger: 7,
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
        Roulette: 21,
        VipSedie: 22,
        BlackJack: 23,
        SpecialSeDie: 24,
        SicBo: 25,
        VipFishPrawnCrab: 26,
        VipBaccarat: 27,
        VipSedieWar: 28,
        FourGuardians: 29,
        Lottery: 31,
        ThreeCards: 35
    },
    GameInfos: {
        0: {
            key: "main"
        },
        1: {
            key: "taixiu",
            route: "bigsmall"
        },
        2: {
            key: "XocXoc",
            route: "sedie"
        },
        3: {
            key: "BauCua",
            route: "fishprawncrab"
        },
        4: {
            key: "TXTurbo",
            route: "turbobigsmall"
        },
        6: {
            id: 6,
            key: "OETurbo",
            route: "turbooddeven"
        },
        7: {
            key: "DragonTiger"
        },
        8: {
            key: "KenoProMax"
        },
        9: {
            key: "MiniSeDie"
        },
        10: {
            key: "Baccarat"
        },
        11: {
            key: "KenoProViet"
        },
        21: {
            key: "Roulette"
        },
        22: {
            key: "VipSeDie",
            route: "vsedie"
        },
        23: {
            key: "BlackJack"
        },
        24: {
            key: "SpecialSeDie"
        },
        25: {
            key: "SicBo"
        },
        26: {
            key: "VipFishPrawnCrab"
        },
        27: {
            key: "VipBaccarat"
        },
        28: {
            key: "VipSedieWar"
        },
        29: {
            key: "FourGuardians"
        },
        31: {
            key: "Lottery"
        },
        35: {
            key: "ThreeCards"
        }
    },
    gameRoomRegNames: {},
    gameRoomIds: [],
    gameRoomNewSocketIds: [2, 8, 10, 21, 22, 23, 25, 26, 27, 28, 29, 31, 35],
    gameMiniNewSocketIds: [24, 9, 1, 3, 4, 6, 7]
};

module.exports = configs;
