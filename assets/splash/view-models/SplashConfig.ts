import { injectable } from 'inversify';

import { ICashSystem, ICreditSystem, System } from '../../System';

@injectable()
export default class SplashConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    enabledSC1: boolean;

    customizeCredit(): void {
        this.enabledSC1 = true;
    }

    customizeCash(): void {
        this.enabledSC1 = false;
    }
}
