import { GameBaseConfigs } from "../../_base/GameBaseConfig";

export interface CLGameConfigs extends GameBaseConfigs {
    readonly nanTime: number;
    readonly displayResultTime: number;
    readonly presetBetSettingKey: string;
}

export class ChanLeConfigs implements CLGameConfigs {
    fullTime = 61;
    betTime = 51;
    waitTime = 10;
    nanTime = 55;
    stopBetTime = 5;
    minBetTime = 1;
    displayResultTime = 58;
    presetBetSettingKey = "odd_even_preset_bet";
}
