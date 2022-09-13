import lodash = require("lodash");

import ExtendedGameLogControl from "../../games/_base/view-models/ExtendedGameLogControl";
import { RoundHistory } from "../../games/_base_new/models/RoundHistory";
import MiniGameBase from "../../games/_base_new/view-models/MiniGameBase";
import { Durations } from "../../games/_new/_base/game-data-management/models/durations";
import GameUtils from "../GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StatisticBoard extends cc.Component {
    @property({ type: cc.Label })
    percentLabels: cc.Label[] = [];

    @property(ExtendedGameLogControl)
    logControl: ExtendedGameLogControl = null;

    @property
    supportChoices = "big,small";

    roundHistory: RoundHistory;
    duration: Durations;
    originalChoices: string[];

    onLoad() {
        this.onChangedSupportChoices();
    }

    setSupportChoices(choices: string) {
        this.supportChoices = choices;
        this.onChangedSupportChoices();
    }

    onChangedSupportChoices() {
        this.originalChoices = this.supportChoices.split(",");
        this.percentLabels.forEach((label, index) => {
            label.node.name = this.originalChoices[index];
        });
    }

    init(game: MiniGameBase) {
        this.duration = game.gameData.durations;
        this.roundHistory = game.gameData.roundHistory;

        this.roundHistory.on(RoundHistory.Events.CHANGE, this.updateRoundHistory);
        this.duration.on(Durations.Events.LOCKING_BET, this.showNextItem);

        this.updateRoundHistory(this.roundHistory.roundHistory);
    }

    onDestroy() {
        this.roundHistory?.removeListener(RoundHistory.Events.CHANGE, this.updateRoundHistory);
        this.duration?.removeListener(Durations.Events.LOCKING_BET, this.showNextItem);

        this.roundHistory = null;
        this.duration = null;
    }

    showNextItem = () => {
        this.logControl.nextMark && (this.logControl.nextMark.active = true);
    };

    hideNextItem() {
        this.logControl.nextMark && (this.logControl.nextMark.active = false);
    }

    generateExtra(result: any): any {
        return {};
    }

    updateRoundHistory = (roundHistory) => {
        this.hideNextItem();

        const originalChoices = this.originalChoices;
        const percentage = GameUtils.calculateWinPercentage(originalChoices, roundHistory);
        this.percentLabels.forEach((label) => {
            label.string = `${percentage[label.node.name]}%`;
        });

        const data = roundHistory.map((history) => {
            const result = {};
            const winChoice = this.originalChoices.find((choice) => history.settlementResult[choice]);
            result["type"] = originalChoices.findIndex((choice) => choice === winChoice);
            result["choice"] = winChoice;
            result["extra"] = this.generateExtra(history.result);
            return result;
        });
        const reverseData = lodash.cloneDeep(data).reverse();
        this.logControl.setExtendedData(reverseData);
    };
}
