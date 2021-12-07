import { injectable } from "inversify";

import { GameIds } from "../../../configs/SabaConfigs";
import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class LobbyMenuConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    smPromotion: boolean;
    bannerAds = [43, 35, 2, 23];
    bannerAdsInfo = {
        43: {
            displayTime: 10
        },
        35: {
            displayTime: 5
        },
        2: {
            displayTime: 5
        },
        23: {
            displayTime: 5
        }
    };
    list = [38, 29, 22, 2, 28, 9, 25, 1, 4, 6, 8, GameIds.KenoProViet, 27, 10, 26, 3, 7, 24, 23, 21, 31, 35, 43];
    seDieGames = [
        //
        GameIds.VipSedie,
        GameIds.SeDie,
        GameIds.VipSedieWar,
        GameIds.MiniSedie,
        GameIds.SpecialSeDie
    ];
    casinoGames = [
        //
        GameIds.SicBo,
        GameIds.Roulette,
        GameIds.VipFishPrawnCrab
    ];
    cardGames = [
        //
        GameIds.VipBaccarat,
        GameIds.Baccarat,
        GameIds.DragonTiger,
        GameIds.ThreeCards,
        GameIds.BlackJack
    ];
    slotGames = [
        //
        GameIds.HeroesSlot,
        GameIds.FourGuardians
    ];
    lotteryGames = [
        //
        GameIds.KenoProMax,
        GameIds.KenoProViet,
        GameIds.Lottery
    ];
    othersGames = [GameIds.BitcoinMaster];
    miniList = [1, 4, 6, 3, 0, 7, GameIds.KenoProViet, 9];
    detail = {
        29: {
            size: cc.v2(1, 2)
        },
        38: {
            size: cc.v2(1, 2)
        }
    };

    customizeCredit(): void {
        this.smPromotion = true;
    }

    customizeCash(): void {
        this.smPromotion = false;
    }
}
