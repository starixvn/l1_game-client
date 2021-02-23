/* eslint-disable @typescript-eslint/no-this-alias */
import * as configs from "./configs/Configs.js";

interface IApplicationSystem {
    initSystem(): void;
}

export enum SystemType {
    L1 = "L1",
    L2 = "L2"
}

export interface ICreditSystem extends IApplicationSystem {
    customizeCredit(): void;
}

export interface ICashSystem extends IApplicationSystem {
    customizeCash(): void;
}

export class ApplicationSystem extends cc.Component implements IApplicationSystem {
    constructor() {
        super();
        this.initSystem();
    }

    initSystem(): void {
        switch (configs.systemType) {
            case SystemType.L1:
                const creditSystem: IApplicationSystem = this;
                (creditSystem as ICreditSystem).customizeCredit();
                break;

            case SystemType.L2:
                const cashSystem: IApplicationSystem = this;
                (cashSystem as ICashSystem).customizeCash();
                break;
        }
    }
}
