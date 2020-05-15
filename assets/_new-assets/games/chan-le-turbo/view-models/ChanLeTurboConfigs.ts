import { CLGameConfigs } from "../../chan-le/view-models/ChanLeConfigs";

export default class ChanLeTurboConfigs implements CLGameConfigs {
    stopBetTime: number = 5;
    fullTime: number = 36;
    betTime: number = 31;
    waitTime: number = 5;
    nanTime: number = 32;
    minBetTime: number = 1;
}