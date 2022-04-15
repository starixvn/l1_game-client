import { EventEmitter } from "events";

import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import HoldemPokerAfterCallEventHandler from "../event-handlers/HoldemPokerAfterCallEventHandler";
import HoldemPokerAfterDealEventHandler from "../event-handlers/HoldemPokerAfterDealEventHandler";
import HoldemPokerConfigsHandler from "../event-handlers/HoldemPokerConfigsHandler";
import HoldemPokerFinishHandler from "../event-handlers/HoldemPokerFinishHandler";
import HoldemPokerOwnBetHandler from "../event-handlers/HoldemPokerOwnBetHandler";
import HoldemPokerTicketDetailEventHandler from "../event-handlers/HoldemPokerTicketDetailHandler";
import { HoldemPokerAfterCallModel } from "./HoldemPokerAfterCallModel";
import { HoldemPokerAfterDealModel } from "./HoldemPokerAfterDealModel";
import { HoldemPokerConfigs } from "./HoldemPokerConfigs";
import { HoldemPokerFinishModel } from "./HoldemPokerFinishModel";
import { HoldemPokerOwnBet } from "./HoldemPokerOwnBet";
import { HoldemPokerPlaceBetModel } from "./HoldemPokerPlaceBetModel";
import { HoldemPokerRoundCounter } from "./HoldemPokerRoundCounter";
import { HoldemPokerSettlement } from "./HoldemPokerSettlement";
import { HoldemPokerStateModel } from "./HoldemPokerStateModel";
import { HoldemPokerTicketDetailModel } from "./HoldemPokerTicketDetailModel";
import { HoldemPokerMD5Model } from "./HoldemPokerMD5Model";
import HoldemPockerMD5Handler from "../event-handlers/HoldemPockerMD5Handler";

export class HoldemPokerGameData<Choices> extends GameData<Choices> {
    //base for Poker
    static Events = {
        CHANGE_STATE: "changeState",
        CHOICES_RESULT: "choicesResult",
        SHOW_PROCESSING_BET: "showProcessingBet",
        HIDE_PROCESSING_BET: "hideProcessingBet",
        SETTLED: "settled"
    };

    readonly configs: HoldemPokerConfigs;
    readonly placeBetModel: HoldemPokerPlaceBetModel;
    readonly stateModel: HoldemPokerStateModel;
    readonly dealModel: HoldemPokerAfterDealModel;
    readonly callModel: EventEmitter;
    readonly ownBets: HoldemPokerOwnBet;
    readonly finishModel: HoldemPokerFinishModel;
    readonly settlement: HoldemPokerSettlement;
    readonly ticketDetailModel: HoldemPokerTicketDetailModel;
    readonly md5Model: HoldemPokerMD5Model;
    //end base for Poker

    readonly roundCounter: HoldemPokerRoundCounter;

    constructor() {
        super();

        this.placeBetModel = new HoldemPokerPlaceBetModel();
        this.stateModel = new HoldemPokerStateModel();
        this.configs = new HoldemPokerConfigs();
        this.dealModel = new HoldemPokerAfterDealModel();
        this.callModel = new HoldemPokerAfterCallModel();
        this.ownBets = new HoldemPokerOwnBet();
        this.finishModel = new HoldemPokerFinishModel();
        this.roundCounter = new HoldemPokerRoundCounter();
        this.settlement = new HoldemPokerSettlement();
        this.ticketDetailModel = new HoldemPokerTicketDetailModel();
        this.md5Model = new HoldemPokerMD5Model();
    }

    // Override isProcessingBet
    set isProcessingBet(value: boolean) {
        this.processingBetFlag = value;
        if (!this.processingBetFlag) {
            this.emit(HoldemPokerGameData.Events.HIDE_PROCESSING_BET);
        }
    }

    get isProcessingBet() {
        return this.processingBetFlag;
    }

    receiveData(data: unknown) {
        if (!this.eventHandlers.length) {
            this.registerEventHandlers();
        }

        this.eventHandlers.forEach((handler) => handler.onReceiveEvent(data));
    }

    protected handleHandler() {
        const handlers = [
            HoldemPokerConfigsHandler,
            HoldemPokerAfterDealEventHandler,
            HoldemPokerAfterCallEventHandler,
            HoldemPokerOwnBetHandler,
            HoldemPokerFinishHandler,
            HoldemPokerTicketDetailEventHandler,
            HoldemPockerMD5Handler
        ];

        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }

    protected registerEventHandlers() {
        super.registerEventHandlers();
        this.handleHandler();
    }

    receiveUIData(data: any) {
        if (!!data.bet) {
            this.placeBetModel.isUsingHand = true;
            this.placeBetModel.placeBet(data.bet.choice, data.bet.amount);
            this.stateModel.placeBet(data.bet.choice, this.placeBetModel);
        }
        if (!!data.double) {
            this.placeBetModel.double(data.double.choice, data.double.amount);
        }
        if (!!data.clear) {
            this.placeBetModel.clear(data.clear.choice);
            this.stateModel.clearBet(data.clear.choice);
        }
        if (!!data.deal) {
            this.stateModel.deal();
        }
        if (!!data.cancel) {
            this.placeBetModel.resetBets();
            this.stateModel.cancelBet();
        }

        if (!!data.rebetAndDeal) {
            this.placeBetModel.rebetAndDeal(data.rebetAndDeal.amount);
            this.stateModel.deal();
        }

        if (!!data.doubleAndCall) {
            this.placeBetModel.doubleAndCall(data.doubleAndCall.amount);
            this.stateModel.call();
        }
        if (!!data.fold) {
            this.stateModel.fold();
        }
        if (!!data.new) {
            this.placeBetModel.new();
            this.stateModel.resetState();
        }
        if (!!data.replayNew) {
            this.placeBetModel.replayNew(data.replayNew.amount);
            this.stateModel.replayNew();
        }
    }
}
