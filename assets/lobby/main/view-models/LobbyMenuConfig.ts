import { injectable } from "inversify";

import { GameIds } from "../../../configs/SabaConfigs";
import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class LobbyMenuConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    smPromotion: boolean;
    bannerAds = [GameIds.TexasHoldemPoker, GameIds.HiLo, GameIds.CasinoHoldemPoker, GameIds.SeDie];
    bannerAdsInfo = {
        [GameIds.TexasHoldemPoker]: {
            displayTime: 10
        },
        [GameIds.HiLo]: {
            displayTime: 5
        },
        [GameIds.CasinoHoldemPoker]: {
            displayTime: 5
        },
        [GameIds.SeDie]: {
            displayTime: 5
        }
    };
    list = [
        GameIds.HeroesSlot,
        GameIds.FourGuardians,
        GameIds.VipSedie,
        GameIds.SeDie,
        GameIds.VipSedieWar,
        GameIds.MiniSedie,
        GameIds.SicBo,
        GameIds.BigSmall,
        GameIds.TurboBigSmall,
        GameIds.TurboOddEven,
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
    slotGames = [GameIds.HeroesSlot, GameIds.FourGuardians];
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
        }
    };
    newGames = [GameIds.TexasHoldemPoker];

    customizeCredit(): void {
        this.smPromotion = true;
    }

    customizeCash(): void {
        this.smPromotion = false;
    }
}
