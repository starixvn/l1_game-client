import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { HiLoChoices } from "../events-models/HiLoChoices";
import HiLoGameData from "../events-models/HiLoGameData";
import { HiLoRoundCounter } from "../events-models/HiLoRoundCounter";
import { updateRoundId } from "../actions/HiLoRoundCounterAction";
import HiLoOwnBetModel from "../events-models/HiLoOwnBetModel";
import { HiLoResultModel } from "../events-models/HiLoResultModel";
import { updateHigherLowerStakes, updateAllStakes } from "../actions/HiLoDealAction";
import HiLoStakes from "./HiLoStakes";
import HiLoBettingArea from "./HiLoBettingArea";
import { BettingAreaEvents } from "./HiLoBettingArea";

const { ccclass, property } = cc._decorator;

export const HiLoEvents = {
    bet: "bet",
    collect: "collect",
    deal: "deal"
};
@ccclass
export default class HiLo extends NewMiniGameBase {
    @property(HiLoBettingArea)
    bettingAreas: HiLoBettingArea[] = [];

    @property(cc.Node)
    betBoardContainer: cc.Node = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    guideNode: cc.Node = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Node)
    resultAnimation: cc.Node = null;

    @property(cc.Node)
    cardContainer: cc.Node = null;

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    collectButton: cc.Button = null;

    @property(HiLoStakes)
    stakesComp: HiLoStakes = null;

    private gameData: HiLoGameData<HiLoChoices> = null;
    private betAmount: number = 0;

    onLoad() {
        this.gameData = new HiLoGameData<HiLoChoices>();
        super.onLoad();
        this.showHideTopArea();
        this.initBetBoard();
        this.registerOwnBetEvents();
        this.registerResultEvents();
        this.registerRoundCounterEvents();
        this.registerBettingAreaEvents();
    }

    private registerBettingAreaEvents() {
        this.bettingAreas.forEach((area) => {
            area.node.on(BettingAreaEvents.PLACING_BET, this.onPlacingBet, this);
        });
    }

    private registerOwnBetEvents() {
        this.gameData.ownBetModel.on(HiLoOwnBetModel.Events.CHANGE, (betModel: HiLoOwnBetModel) => {
            updateHigherLowerStakes(this.stakesComp);
        });
        this.gameData.ownBetModel.on(HiLoOwnBetModel.Events.CHANGE, () => {
            this.gameData.roundCounter.change(this.gameData.ownBetModel.roundId);
        });
    }

    private registerResultEvents() {
        this.gameData.resultModel.on(HiLoResultModel.Events.CHANGE, () => {
            updateAllStakes(this.stakesComp);
        });
    }

    private registerRoundCounterEvents() {
        this.gameData.roundCounter.on(HiLoRoundCounter.Events.CHANGE, updateRoundId(this.gameRound));
    }

    onPlacingBet(betChoice: string) {
        if (!this.connection) {
            return;
        }
        this.gameData.isProcessingBet = true;
        this.connection.emit(HiLoEvents.deal, { choice: betChoice });
    }

    openHistory() {
        this.playClick();
    }

    showHideTopArea() {
        this.topNode.active = !this.topNode.active;
    }

    initBetBoard() {
        const betBoard = cc.instantiate(this.betBoardPrefab);
        this.betBoardContainer.addChild(betBoard);
    }

    showHidePlayGameButton(status: boolean) {
        this.playButton.node.active = status;
    }

    onPlayClick() {
        this.playClick();
        if (!this.connection) {
            return;
        }
        this.gameData.isProcessingBet = true;
        this.connection.emit(HiLoEvents.bet, { amount: this.betAmount });
    }

    onCollectClick() {
        this.playClick();
        if (!this.connection) {
            return;
        }
        this.gameData.isProcessingBet = true;
        this.connection.emit(HiLoEvents.collect, {});
    }

    disableAllBetOption() {}
}
