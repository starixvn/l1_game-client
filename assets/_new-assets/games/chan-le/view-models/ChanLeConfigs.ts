import { GameBaseConfigs } from "../../../common/game/GameBaseConfig";

export interface CLGameConfigs extends GameBaseConfigs {
    readonly nanTime: number;
}

export class ChanLeConfigs implements CLGameConfigs {
    fullTime: number = 66;
    betTime: number = 51;
    waitTime: number = 15;
    nanTime: number = 55;
    stopBetTime: number = 5;
    minBetTime: number = 1;
}
