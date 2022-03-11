import { HoldemPockerMD5Model } from "./../../holdem-poker/event-models/HoldemPockerMD5Model";
import { HoldemPokerGameData } from "../../holdem-poker/event-models/HoldemPokerGameData";
import TexasErrorHandler from "../event-handlers/texas-error-handler";
import TexasAutoSettleHandler from "../event-handlers/texas-auto-settle-handler";
import TexasCallHandler from "../event-handlers/texas-call-handler";
import TexasConfigsHandler from "../event-handlers/texas-configs-handler";
import TexasDealHandler from "../event-handlers/texas-deal-handler";
import TexasFinishHandler from "../event-handlers/texas-finish-handler";
import TexasOwnBetHandler from "../event-handlers/texas-own-bet-handler";
import TexasRiverHandler from "../event-handlers/texas-river-handler";
import TexasTicketDetailHandler from "../event-handlers/texas-ticket-detail-handler";
import TexasTurnHandler from "../event-handlers/texas-turn-handler";
import TexasAutoSettleModel from "./texas-auto-settle-model";
import TexasCallModel from "./texas-call-model";
import { TexasChoicesConst } from "../texas-contants";
import TexasConfigsModel from "./texas-configs-model";
import TexasDealModel from "./texas-deal-model";
import TexasFinishModel from "./texas-finish-model";
import TexasOwnBetModel from "./texas-own-bet-model";
import TexasPlaceBetModel from "./texas-place-bet-model";
import TexasRiverModel from "./texas-river-model";
import TexasSettlementModel from "./texas-settlement-model";
import TexasStateModel from "./texas-state-model";
import TexasTicketDetailModel from "./texas-ticket-detail-model";
import TexasTurnModel from "./texas-turn-model";
import HoldemPockerMD5Handler from "../../holdem-poker/event-handlers/HoldemPockerMD5Handler";

export default class TexasGameDataModel<Choices> extends HoldemPokerGameData<Choices> {
    readonly configs: TexasConfigsModel;
    readonly placeBetModel: TexasPlaceBetModel;
    readonly stateModel: TexasStateModel;
    readonly dealModel: TexasDealModel;
    readonly ownBets: TexasOwnBetModel;
    readonly finishModel: TexasFinishModel;
    readonly settlement: TexasSettlementModel;
    readonly ticketDetailModel: TexasTicketDetailModel;

    readonly callModel: TexasCallModel;
    readonly turnModel: TexasTurnModel;
    readonly riverModel: TexasRiverModel;
    readonly autoSettleModel: TexasAutoSettleModel;
    readonly md5Model: HoldemPockerMD5Model;

    constructor() {
        super();

        this.configs = new TexasConfigsModel();
        this.placeBetModel = new TexasPlaceBetModel();
        this.stateModel = new TexasStateModel();
        this.settlement = new TexasSettlementModel();
        this.autoSettleModel = new TexasAutoSettleModel();

        this.dealModel = new TexasDealModel();
        this.callModel = new TexasCallModel();
        this.turnModel = new TexasTurnModel();
        this.riverModel = new TexasRiverModel();
        this.ownBets = new TexasOwnBetModel();
        this.finishModel = new TexasFinishModel();
        this.ticketDetailModel = new TexasTicketDetailModel();
        this.md5Model = new HoldemPockerMD5Model();
    }

    // Override isProcessingBet
    set isProcessingBet(value: boolean) {
        this.processingBetFlag = value;
        if (!this.processingBetFlag) {
            this.emit(TexasGameDataModel.Events.HIDE_PROCESSING_BET);
        }
    }

    protected handleHandler() {
        const handlers = [
            TexasConfigsHandler,
            TexasErrorHandler,
            TexasAutoSettleHandler,
            TexasDealHandler,
            TexasCallHandler,
            TexasTurnHandler,
            TexasRiverHandler,
            TexasOwnBetHandler,
            TexasFinishHandler,
            HoldemPockerMD5Handler,
            TexasTicketDetailHandler
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
            this.placeBetModel.updateBetModel(TexasChoicesConst.turnBet, TexasPlaceBetModel.Events.TURN);
            this.stateModel.turning();
        }
        if (!!data.checkTurn) {
            this.stateModel.checkTurn();
        }
        if (!!data.betRiver) {
            this.placeBetModel.updateBetModel(TexasChoicesConst.riverBet, TexasPlaceBetModel.Events.RIVER);
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
