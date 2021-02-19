import { GameConfigBase } from "../../_base/view-models/GameConfigBase";

export interface CLGameConfigs extends GameConfigBase {
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
