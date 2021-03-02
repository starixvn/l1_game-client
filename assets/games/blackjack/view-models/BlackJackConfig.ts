import { injectable } from "inversify";

import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class BlackJackConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    chipOption: number[];

    customizeCredit(): void {
        this.chipOption = [2000, 1000, 500, 200, 100, 50, 10, 5, 1, 0.5];
    }

    customizeCash(): void {
        this.chipOption = [20000, 5000, 1000, 500, 200, 100, 50, 20, 10, 5];
    }
}
