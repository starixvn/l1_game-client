import { GameBaseConfigs } from "../../_base/GameBaseConfig";

export interface CLGameConfigs extends GameBaseConfigs {
    readonly nanTime: number;
    readonly displayResultTime: number;
    readonly presetBetSettingKey: string;
}

export class ChanLeConfigs implements CLGameConfigs {
    fullTime: number = 61;
    betTime: number = 51;
    waitTime: number = 10;
    nanTime: number = 55;
    stopBetTime: number = 5;
    minBetTime: number = 1;
    displayResultTime: number = 58;
    presetBetSettingKey: string = "odd_even_preset_bet";
}
