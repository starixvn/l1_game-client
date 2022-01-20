import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { HiLoConfigsHandler } from "../events-handlers/HiLoConfigsHandler";
import HiLoConfigs from "./HiLoConfigs";
import { HiLoRoundCounter } from "./HiLoRoundCounter";
import { HiLoOwnBetHandler } from "../events-handlers/HiLoOwnBetHandler";
import HiLoOwnBetModel from "./HiLoOwnBetModel";
import { HiLoResultHandler } from "../events-handlers/HiLoResultHandler";
import { HiLoResultModel } from "./HiLoResultModel";
import { HiLoStatusModel } from "./HiLoStatusModel";
import { HiLoStatusHandler } from "../events-handlers/HiLoStatusHandler";

export default class HiLoGameData<Choices> extends GameData<Choices> {
    static Events = {
        CHANGE_STATE: "changeState",
        SHOW_PROCESSING_BET: "showProcessingBet",
        HIDE_PROCESSING_BET: "hideProcessingBet",
        SETTLED: "settled"
    };

    readonly roundCounter: HiLoRoundCounter;
    readonly betModel: HiLoOwnBetModel;
    readonly configs: HiLoConfigs;
    readonly dealModel: HiLoResultModel;
    readonly collectModel: HiLoStatusModel;

    constructor() {
        super();
        this.roundCounter = new HiLoRoundCounter();
        this.betModel = new HiLoOwnBetModel();
        this.dealModel = new HiLoResultModel();
        this.collectModel = new HiLoStatusModel();
    }

    receiveData(data: unknown) {
        if (!this.eventHandlers.length) {
            this.registerEventHandlers();
        }

        this.eventHandlers.forEach((handler) => handler.onReceiveEvent(data));
    }

    protected registerEventHandlers() {
        super.registerEventHandlers();
        const handlers = [HiLoConfigsHandler, HiLoOwnBetHandler, HiLoResultHandler, HiLoStatusHandler];

        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }

    receiveUIData(data: any) {
        if (!!data.ownBets) {
        }
    }
}
