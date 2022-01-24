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
import { TimeEventHandler } from "../../_new/_base/game-data-management/event-handlers/time-handler";

export default class HiLoGameData<Choices> extends GameData<Choices> {
    static Events = {
        CHANGE_STATE: "changeState",
        SHOW_PROCESSING_BET: "showProcessingBet",
        HIDE_PROCESSING_BET: "hideProcessingBet",
        SETTLED: "settled"
    };

    readonly roundCounter: HiLoRoundCounter;
    readonly ownBetModel: HiLoOwnBetModel;
    readonly configs: HiLoConfigs;
    readonly resultModel: HiLoResultModel;
    readonly statusModel: HiLoStatusModel;

    constructor() {
        super();
        this.roundCounter = new HiLoRoundCounter();
        this.ownBetModel = new HiLoOwnBetModel();
        this.resultModel = new HiLoResultModel();
        this.statusModel = new HiLoStatusModel();
    }

    protected registerEventHandlers() {
        super.registerEventHandlers();
        const handlers = [TimeEventHandler, HiLoConfigsHandler, HiLoOwnBetHandler, HiLoResultHandler, HiLoStatusHandler];

        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
