import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { HiLoGameConfigsHandler } from "../events-handlers/HiLoGameConfigsHandler";
import { HiLoRoundCounter } from "./HiLoRoundCounter";
import { HiLoOwnBetHandler } from "../events-handlers/HiLoOwnBetHandler";
import HiLoOwnBetModel from "./HiLoOwnBetModel";
import { HiLoResultHandler } from "../events-handlers/HiLoResultHandler";
import { HiLoResultModel } from "./HiLoResultModel";
import { HiLoStatusModel } from "./HiLoStatusModel";
import { HiLoStatusHandler } from "../events-handlers/HiLoStatusHandler";
import { TimeEventHandler } from "../../_new/_base/game-data-management/event-handlers/time-handler";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import HiLoGameConfigs from "./HiLoGameConfigs";
import { HiLoTurnModel } from "./HiLoTurnModel";
import { HiLoStateModel } from "./HiLoStateModel";

export default class HiLoGameData<Choices> extends GameData<Choices> {
    static Events = {
        CHANGE_STATE: "changeState",
        SHOW_PROCESSING_BET: "showProcessingBet",
        HIDE_PROCESSING_BET: "hideProcessingBet",
        SETTLED: "settled"
    };

    readonly roundCounter: HiLoRoundCounter;
    readonly ownBetModel: HiLoOwnBetModel;
    readonly configs: HiLoGameConfigs;
    readonly resultModel: HiLoResultModel;
    readonly statusModel: HiLoStatusModel;
    readonly turnModel: HiLoTurnModel;
    readonly stateModel: HiLoStateModel;

    constructor() {
        super();
        this.roundCounter = new HiLoRoundCounter();
        this.ownBetModel = new HiLoOwnBetModel();
        this.resultModel = new HiLoResultModel();
        this.statusModel = new HiLoStatusModel();
        this.turnModel = new HiLoTurnModel();
        this.stateModel = new HiLoStateModel();
        this.configs = new HiLoGameConfigs();
        this.durations = new Durations();
    }

    protected registerEventHandlers() {
        super.registerEventHandlers();
        const handlers = [TimeEventHandler, HiLoGameConfigsHandler, HiLoOwnBetHandler, HiLoResultHandler, HiLoStatusHandler];

        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }

    receiveUIData(data: any) {
        if (!!data.bet) {
            this.stateModel.startRound();
        }

        if (!!data.deal) {
            this.stateModel.deal();
        }

        if (!!data.collect) {
            this.stateModel.collect();
        }
    }
}
