import { injectable } from 'inversify';

import { ICashSystem, ICreditSystem, System } from './../../../System';

@injectable()
export default class BauCuaConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    gameConfigs: object;

    customizeCredit(): void {
        this.gameConfigs = {
            minbet: 1,
            maxbet: 2000,
            maxbetRound: 2000,
            odds: {
                oddSingle: 0,
                oddDouble: 0,
                oddTriple: 0
            }
        };
    }

    customizeCash(): void {
        this.gameConfigs = {
            minbet: 10,
            maxbet: 10000,
            maxbetRound: 20000,
            odds: {
                odds: {
                    oddSingle: 0,
                    oddDouble: 0,
                    oddTriple: 0
                }
            }
        };
    }
}
