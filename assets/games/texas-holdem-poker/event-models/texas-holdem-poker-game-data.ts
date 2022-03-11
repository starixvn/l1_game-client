import { HoldemPockerMD5Model } from "./../../holdem-poker/event-models/HoldemPockerMD5Model";
import { HoldemPokerGameData } from "../../holdem-poker/event-models/HoldemPokerGameData";
import TexasHoldemPokerErrorUIEventHandler from "../event-handlers/texas-holdem-poker-error-ui-event-handler";
import TexasHoldemPokerAutoSettleEventHandler from "../event-handlers/texas-holdem-poker-auto-settle-event-handler";
import TexasHoldemPokerCallEventHandler from "../event-handlers/texas-holdem-poker-call-event-handler";
import TexasHoldemPokerConfigsHandler from "../event-handlers/texas-holdem-poker-configs-handler";
import TexasHoldemPokerDealEventHandler from "../event-handlers/texas-holdem-poker-deal-event-handler";
import TexasHoldemPokerFinishHandler from "../event-handlers/texas-holdem-poker-finish-handler";
import TexasHoldemPokerOwnBetHandler from "../event-handlers/texas-holdem-poker-own-bet-handler";
import TexasHoldemPokerRiverEventHandler from "../event-handlers/texas-holdem-poker-river-event-handler";
import TexasHoldemPokerTicketDetailEventHandler from "../event-handlers/texas-holdem-poker-ticket-detail-event-handler";
import TexasHoldemPokerTurnEventHandler from "../event-handlers/texas-holdem-poker-turn-event-handler";
import TexasHoldemPokerAutoSettleModel from "./texas-holdem-poker-auto-settle-model";
import TexasHoldemPokerCallModel from "./texas-holdem-poker-call-model";
import { TexasHoldemPokerChoicesConst } from "../texas-contants";
import TexasHoldemPokerConfigs from "./texas-holdem-poker-configs";
import TexasHoldemPokerAfterDealModel from "./texas-holdem-poker-deal-model";
import TexasHoldemPokerFinishModel from "./texas-holdem-poker-finish-model";
import TexasHoldemPokerOwnBetModel from "./texas-holdem-poker-own-bet-model";
import TexasHoldemPokerPlaceBetModel from "./texas-holdem-poker-place-bet-model";
import TexasHoldemPokerRiverModel from "./texas-holdem-poker-river-model";
import TexasHoldemPokerSettlement from "./texas-holdem-poker-settlement";
import TexasHoldemPokerStateModel from "./texas-holdem-poker-state-model";
import TexasHoldemPokerTicketDetailModel from "./texas-holdem-poker-ticket-detail-model";
import TexasHoldemPokerTurnModel from "./texas-holdem-poker-turn-model";
import HoldemPockerMD5Handler from "../../holdem-poker/event-handlers/HoldemPockerMD5Handler";

export default class TexasHoldemPokerGameData<Choices> extends HoldemPokerGameData<Choices> {
    readonly configs: TexasHoldemPokerConfigs;
    readonly placeBetModel: TexasHoldemPokerPlaceBetModel;
    readonly stateModel: TexasHoldemPokerStateModel;
    readonly dealModel: TexasHoldemPokerAfterDealModel;
    readonly ownBets: TexasHoldemPokerOwnBetModel;
    readonly finishModel: TexasHoldemPokerFinishModel;
    readonly settlement: TexasHoldemPokerSettlement;
    readonly ticketDetailModel: TexasHoldemPokerTicketDetailModel;

    readonly callModel: TexasHoldemPokerCallModel;
    readonly turnModel: TexasHoldemPokerTurnModel;
    readonly riverModel: TexasHoldemPokerRiverModel;
    readonly autoSettleModel: TexasHoldemPokerAutoSettleModel;
    readonly md5Model: HoldemPockerMD5Model;

    constructor() {
        super();

        this.configs = new TexasHoldemPokerConfigs();
        this.placeBetModel = new TexasHoldemPokerPlaceBetModel();
        this.stateModel = new TexasHoldemPokerStateModel();
        this.settlement = new TexasHoldemPokerSettlement();
        this.autoSettleModel = new TexasHoldemPokerAutoSettleModel();

        this.dealModel = new TexasHoldemPokerAfterDealModel();
        this.callModel = new TexasHoldemPokerCallModel();
        this.turnModel = new TexasHoldemPokerTurnModel();
        this.riverModel = new TexasHoldemPokerRiverModel();
        this.ownBets = new TexasHoldemPokerOwnBetModel();
        this.finishModel = new TexasHoldemPokerFinishModel();
        this.ticketDetailModel = new TexasHoldemPokerTicketDetailModel();
        this.md5Model = new HoldemPockerMD5Model();
    }

    // Override isProcessingBet
    set isProcessingBet(value: boolean) {
        this.processingBetFlag = value;
        if (!this.processingBetFlag) {
            this.emit(TexasHoldemPokerGameData.Events.HIDE_PROCESSING_BET);
        }
    }

    protected handleHandler() {
        const handlers = [
            TexasHoldemPokerConfigsHandler,
            TexasHoldemPokerErrorUIEventHandler,
            TexasHoldemPokerAutoSettleEventHandler,
            TexasHoldemPokerDealEventHandler,
            TexasHoldemPokerCallEventHandler,
            TexasHoldemPokerTurnEventHandler,
            TexasHoldemPokerRiverEventHandler,
            TexasHoldemPokerOwnBetHandler,
            TexasHoldemPokerFinishHandler,
            HoldemPockerMD5Handler,
            TexasHoldemPokerTicketDetailEventHandler
        ];

        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }

    protected registerEventHandlers() {
        this.registerBaseEventHandlers();
        this.handleHandler();
    }
    receiveUIData(data: any) {
        if (!!data.bet) {
            this.placeBetModel.placeBet(data.bet.choice, data.bet.amount);
            this.stateModel.placeBet(data.bet.choice);
        }
        if (!!data.deal) {
            this.stateModel.deal();
        }
        if (!!data.double) {
            this.placeBetModel.double(data.double.choice);
        }
        if (!!data.cancel) {
            this.placeBetModel.resetBets();
            this.stateModel.cancelBet();
        }

        if (!!data.doubleCall) {
            this.placeBetModel.doubleAndCall();
            this.stateModel.call();
        }
        if (!!data.betTurn) {
            this.placeBetModel.updateBetModel(TexasHoldemPokerChoicesConst.turnBet, TexasHoldemPokerPlaceBetModel.Events.TURN);
            this.stateModel.turning();
        }
        if (!!data.checkTurn) {
            this.stateModel.checkTurn();
        }
        if (!!data.betRiver) {
            this.placeBetModel.updateBetModel(TexasHoldemPokerChoicesConst.riverBet, TexasHoldemPokerPlaceBetModel.Events.RIVER);
            this.stateModel.rivering();
        }
        if (!!data.checkRiver) {
            this.stateModel.checkRiver();
        }
        if (!!data.rebet) {
            this.placeBetModel.rebet();
            this.stateModel.rebet();
        }
        if (!!data.rebetAndDeal) {
            this.placeBetModel.rebetAndDeal();
            this.stateModel.deal();
        }
        if (!!data.new) {
            this.placeBetModel.new();
            this.stateModel.resetState();
        }
        if (!!data.replayNew) {
            this.placeBetModel.replayNew();
            this.stateModel.replayNew();
        }
        if (!!data.fold) {
            this.stateModel.fold();
        }
    }
}
