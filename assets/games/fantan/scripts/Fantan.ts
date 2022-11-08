import { lodash } from "../../../ClientModules";
import BeadRoad from "../../_base/view-models/BeadRoad";
import ExtendedGameLogControl from "../../_base/view-models/ExtendedGameLogControl";
import { RoundHistory } from "../../_base_new/models/RoundHistory";
import StandAloneTableGameBase from "../../_base_new/view-models/StandAloneTableGameBase";
import StandAloneTableGameHistory from "../../_base_new/view-models/StandAloneTableGameHistory";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { handlePlacingBet, handleShakeDish, updateScoreBoard } from "./actions/FantanCustomActions";
import FantanBetOptionsUI from "./FantanBetOptionsUI";
import FantanBowlAnimation from "./FantanBowlAnimation";
import { FantanConfig, FantanId } from "./FantanConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fantan extends StandAloneTableGameBase {
    beadRoad: BeadRoad = null;
    bigRoad: ExtendedGameLogControl = null;
    animation: FantanBowlAnimation = null;
    startRoundDuration = 7;
    showResultDuration = 6;
    betOptionsUI: FantanBetOptionsUI;
    choices = ["even", "odd"];

    constructor() {
        super();
        this.gameId = FantanId;
        this.setConfig(FantanConfig);
    }

    onLoad() {
        super.onLoad();
        this.animatedTime.setAnimatedY(30, -5);
    }

    initGameDataEvents() {
        super.initGameDataEvents();
        this.emitterListener(this.gameData.durations, Durations.Events.BEGIN_STARTING_ROUND, handleShakeDish);
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, handlePlacingBet);
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.CHANGE, updateScoreBoard);
    }

    initBowlAnimation(node) {
        const animation = node.getComponent(FantanBowlAnimation);
        if (animation) {
            this.animation = animation;
        }
    }

    initBetItems(node: cc.Node) {
        this.betOptionsUI = node.getComponent(FantanBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);
    }

    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(StandAloneTableGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }

    shakeThePlate() {
        this.animation.restart();
    }

    async showSettlementResult(settlement: any) {
        this.animation.setNumberOfSeed(settlement.result.totalBeads);
        console.log("showSettlementResult before", new Date());
        await this.animation.closeRound();
        console.log("showSettlementResult after", new Date());
        this.gameData.settlement.finishShowResult(settlement, true);
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        super.handleAfterSettlementResult(settlement, animated);
    }

    initBeadRoad(node: cc.Node) {
        this.beadRoad = node.getComponent(BeadRoad);
    }

    initBigRoad(node: cc.Node) {
        this.bigRoad = node.getComponent(ExtendedGameLogControl);
    }

    updateScoreBoard(roundHistory) {
        const count = roundHistory.reduce((count: any, history) => {
            this.choices.forEach((choice) => {
                if (history.settlementResult[choice]) {
                    count[choice] = (count[choice] ?? 0) + 1;
                }
            });
            return count;
        }, {});
        const choices = [...this.choices].sort((a, b) => count[a] - count[b]);

        const data = roundHistory.map((history) => {
            const result = {};
            //const winChoice = Object.keys(history.settlementResult).find((choice) => history.settlementResult[choice]);
            result["type"] = history.result.finalBeads;
            // const sum = this.generalExtraInfo(history);
            // result["extra"] = { sum };
            return result;
        });
        console.log(data);
        this.beadRoad.setData(data);
        const reverseData = lodash.cloneDeep(data).reverse();
        this.bigRoad.setExtendedData(reverseData);
    }

    generalExtraInfo(history) {}
}
