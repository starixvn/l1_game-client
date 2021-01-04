import { CLGameConfigs } from "../../chan-le/view-models/ChanLeConfigs";

export default class ChanLeTurboConfigs implements CLGameConfigs {
    stopBetTime = 5;
    fullTime = 36;
    betTime = 31;
    waitTime = 5;
    nanTime = 32;
    minBetTime = 1;
    displayResultTime = 34;
    presetBetSettingKey = "turbo_odd_even_preset_bet";
}
