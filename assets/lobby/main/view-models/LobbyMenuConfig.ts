import { injectable } from "inversify";

import { GameIds } from "../../../configs/SabaConfigs";
import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class LobbyMenuConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    smPromotion: boolean;
    bannerAds = [35, 2, 23, 10];
    bannerAdsInfo = {
        35: {
            displayTime: 10
        },
        2: {
            displayTime: 5
        },
        23: {
            displayTime: 5
        },
        10: {
            displayTime: 5
        },
        0: {
            displayTime: 5
        }
    };
    list = [38, 29, 22, 2, 28, 9, 25, 1, 4, 6, 8, 11, 27, 10, 26, 3, 7, 24, 23, 21, 31, 35];
    diceGames = [
        GameIds.VipSedie,
        GameIds.SeDie,
        GameIds.VipSedieWar,
        GameIds.MiniSedie,
        GameIds.SicBo,
        GameIds.BigSmall,
        GameIds.TurboBigSmall,
        GameIds.TurboOddEven,
        GameIds.VipFishPrawnCrab,
        GameIds.FishPrawnCrab,
        GameIds.SpecialSeDie
    ];
    cardGames = [GameIds.VipBaccarat, GameIds.Baccarat, GameIds.DragonTiger, GameIds.BlackJack, GameIds.ThreeCards];
    slotGames = [GameIds.FourGuardians];
    miniList = [1, 4, 6, 3, 0, 7, 11, 9];
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
