import StandAloneTableGameBase from "../../_base_new/view-models/StandAloneTableGameBase";
import StandAloneTableGameHistory from "../../_base_new/view-models/StandAloneTableGameHistory";
import { FantanConfig, FantanId } from "./FantanConfig";
import FantanBowlAnimation from "./FantanBowlAnimation";
import { handlePlacingBet, handleShakeDish } from "./actions/FantanCustomActions";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import BetItem from "../../_base/view-models/BetItem";
import FantanBetOptionsUI from "./FantanBetOptionsUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fantan extends StandAloneTableGameBase {
    animation: FantanBowlAnimation = null;
    startRoundDuration = 7;
    showResultDuration = 6;
    betOptionsUI: FantanBetOptionsUI;

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
}
