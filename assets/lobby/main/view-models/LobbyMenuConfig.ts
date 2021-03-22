import { injectable } from "inversify";

import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class LobbyMenuConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    bannerAds = [22, 27, 25];
    list = [29, 31, 22, 2, 28, 9, 25, 1, 4, 6, 8, 11, 27, 10, 26, 3, 7, 24, 23, 21];
    miniList = [1, 4, 6, 3, 0, 7, 11, 9];
    detail = {
        31: {
            size: cc.v2(1, 1),
            category: 1
        },
        29: {
            size: cc.v2(1, 2),
            category: 1
        },
        28: {
            size: cc.v2(1, 1),
            category: 1
        },

        27: {
            size: cc.v2(1, 1),
            category: 1
        },
        26: {
            size: cc.v2(1, 1),
            category: 1
        },
        25: {
            size: cc.v2(1, 1),
            category: 1
        },
        24: {
            size: cc.v2(1, 1),
            category: 1
        },
        23: {
            size: cc.v2(1, 1),
            category: 1
        },
        22: {
            size: cc.v2(1, 1),
            category: 1
        },
        21: {
            size: cc.v2(1, 1),
            category: 1
        },
        11: {
            size: cc.v2(1, 1),
            category: 1
        },
        10: {
            size: cc.v2(1, 1),
            category: 1
        },
        9: {
            size: cc.v2(1, 1),
            category: 1
        },
        8: {
            size: cc.v2(1, 1),
            category: 1
        },
        7: {
            size: cc.v2(1, 1),
            category: 1
        },
        6: {
            size: cc.v2(1, 1),
            category: 1
        },
        4: {
            size: cc.v2(1, 1),
            category: 1
        },
        3: {
            size: cc.v2(1, 1),
            category: 1
        },
        2: {
            size: cc.v2(1, 1),
            category: 1
        },
        1: {
            size: cc.v2(1, 1),
            category: 1
        }
    };

    customizeCredit(): void {}

    customizeCash(): void {}
}
