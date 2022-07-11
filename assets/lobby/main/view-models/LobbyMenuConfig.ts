import { injectable } from "inversify";

import configs = require("../../../configs/Configs");
import { GameIds } from "../../../configs/SabaConfigs";
import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class LobbyMenuConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    smPromotion: boolean;
    categoryList = {
        seDieGames: [GameIds.VipSedie, GameIds.SeDie, GameIds.VipSedieWar, GameIds.MiniSedie, GameIds.SpecialSeDie],
        casinoGames: [
            GameIds.SicBo,
            GameIds.BigSmall,
            GameIds.TurboBigSmall,
            GameIds.TurboOddEven,
            GameIds.VipFishPrawnCrab,
            GameIds.FishPrawnCrab,
            GameIds.Roulette
        ],
        cardGames: [
            GameIds.VipBaccarat,
            GameIds.Baccarat,
            GameIds.DragonTiger,
            GameIds.ThreeCards,
            GameIds.BlackJack,
            GameIds.CasinoHoldemPoker,
            GameIds.HiLo,
            GameIds.TexasHoldemPoker
        ],
        slotGames: [GameIds.TreasureIsland, GameIds.FourGuardians, GameIds.HeroesSlot, GameIds.NightClub],
        lotteryGames: [GameIds.KenoProMax, GameIds.KenoProViet, GameIds.Lottery],
        othersGames: [GameIds.BitcoinMaster]
    };
    bannerAds = {
        SC1: [GameIds.SeDie, GameIds.TexasHoldemPoker, GameIds.HiLo],
        SC2: [GameIds.SeDie, GameIds.TexasHoldemPoker, GameIds.HiLo]
    };
    bannerAdsInfo = {
        SC1: {
            [GameIds.SeDie]: {
                displayTime: 10
            },
            [GameIds.TexasHoldemPoker]: {
                displayTime: 5
            },
            [GameIds.HiLo]: {
                displayTime: 5
            }
        },
        SC2: {
            [GameIds.SeDie]: {
                displayTime: 10
            },
            [GameIds.TexasHoldemPoker]: {
                displayTime: 5
            },
            [GameIds.HiLo]: {
                displayTime: 5
            }
        }
    };
    list = [
        GameIds.TreasureIsland,
        GameIds.VipSedie,
        GameIds.SeDie,
        GameIds.VipSedieWar,
        GameIds.MiniSedie,
        GameIds.SicBo,
        GameIds.BigSmall,
        GameIds.TurboBigSmall,
        GameIds.TurboOddEven,
        GameIds.FourGuardians,
        GameIds.HeroesSlot,
        GameIds.NightClub,
        GameIds.KenoProMax,
        GameIds.KenoProViet,
        GameIds.VipBaccarat,
        GameIds.Baccarat,
        GameIds.VipFishPrawnCrab,
        GameIds.FishPrawnCrab,
        GameIds.DragonTiger,
        GameIds.SpecialSeDie,
        GameIds.BlackJack,
        GameIds.Roulette,
        GameIds.Lottery,
        GameIds.ThreeCards,
        GameIds.BitcoinMaster,
        GameIds.CasinoHoldemPoker,
        GameIds.HiLo,
        GameIds.TexasHoldemPoker
    ];
    seDieGames = [GameIds.VipSedie, GameIds.SeDie, GameIds.VipSedieWar, GameIds.MiniSedie, GameIds.SpecialSeDie];
    casinoGames = [
        GameIds.SicBo,
        GameIds.BigSmall,
        GameIds.TurboBigSmall,
        GameIds.TurboOddEven,
        GameIds.VipFishPrawnCrab,
        GameIds.FishPrawnCrab,
        GameIds.Roulette
    ];
    cardGames = [
        GameIds.VipBaccarat,
        GameIds.Baccarat,
        GameIds.DragonTiger,
        GameIds.ThreeCards,
        GameIds.BlackJack,
        GameIds.CasinoHoldemPoker,
        GameIds.HiLo,
        GameIds.TexasHoldemPoker
    ];
    slotGames = [GameIds.TreasureIsland, GameIds.FourGuardians, GameIds.HeroesSlot, GameIds.NightClub];
    lotteryGames = [GameIds.KenoProMax, GameIds.KenoProViet, GameIds.Lottery];
    othersGames = [GameIds.BitcoinMaster];

    miniList = [
        GameIds.BigSmall,
        GameIds.TurboBigSmall,
        GameIds.TurboOddEven,
        GameIds.FishPrawnCrab,
        GameIds.Lobby,
        GameIds.DragonTiger,
        GameIds.HiLo,
        GameIds.MiniSedie
    ];
    detail = {
        [GameIds.FourGuardians]: {
            size: cc.v2(1, 2)
        },
        [GameIds.HeroesSlot]: {
            size: cc.v2(1, 2)
        },
        [GameIds.NightClub]: {
            size: cc.v2(1, 2)
        },
        [GameIds.TreasureIsland]: {
            size: cc.v2(1, 2)
        }
    };
    newGames = {
        SC1: [GameIds.TreasureIsland],
        SC2: []
    };
    iconBigSize = [GameIds.FourGuardians, GameIds.HeroesSlot, GameIds.NightClub, GameIds.TreasureIsland];
    customGameIconBySystem = [GameIds.FourGuardians];

    customizeCredit(): void {
        this.smPromotion = true;
    }

    customizeCash(): void {
        this.smPromotion = false;
    }

    isNewGame(gameId: number): boolean {
        return this.newGames[configs.systemType].includes(gameId);
    }
}
