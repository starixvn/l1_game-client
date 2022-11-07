import StandAloneTableGameBase from "../../_base_new/view-models/StandAloneTableGameBase";
import StandAloneTableGameHistory from "../../_base_new/view-models/StandAloneTableGameHistory";
import { FantanConfig, FantanId } from "./FantanConfig";
import FantanBowlAnimation from "./FantanBowlAnimation";
import { handlePlacingBet, handleShakeDish } from "./actions/FantanCustomActions";
import { Durations } from "../../_new/_base/game-data-management/models/durations";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fantan extends StandAloneTableGameBase {
    animation: FantanBowlAnimation = null;
    startRoundDuration = 7;

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
    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(StandAloneTableGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }

    shakeThePlate() {
        this.animation.Restart();
    }

    showSettlementResult(settlement: any) {
        if (!this.animation) {
            this.gameData.settlement.finishShowResult(settlement, true);
            return;
        }

        this.animation.SetNumberOfSeed(settlement.result.totalBeads);
        this.animation.CloseRound();
        this.gameData.settlement.finishShowResult(settlement, true);
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        super.handleAfterSettlementResult(settlement, animated);
        // this.animation && this.animation.showResult(settlement);
    }
}
