import * as configs from "./configs/Configs.js";

export enum SystemType {
    L1 = "L1",
    L2 = "L2"
}

export class ApplicationSystemType {
    static get IsCredit(): boolean {
        return configs.systemType === SystemType.L1;
    }

    static get IsCash(): boolean {
        return configs.systemType === SystemType.L2;
    }
}
