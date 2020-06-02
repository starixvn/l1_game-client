import { GameBaseConfigs } from "../../_base/GameBaseConfig";

export interface CLGameConfigs extends GameBaseConfigs {
    readonly nanTime: number;
    readonly displayResultTime: number;
}

export class ChanLeConfigs implements CLGameConfigs {
    fullTime: number = 56;
    betTime: number = 51;
    waitTime: number = 15;
    nanTime: number = 55;
    stopBetTime: number = 5;
    minBetTime: number = 1;
    displayResultTime: number = 54;
}
