
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameBaseTimeHandler from "./GameBaseTimeHandler";
import * as _ from "lodash";

export default class GameBaseFinishHandler implements DataHandler {
    constructor(
        protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.timeHandler.resetTime();
            this.handleFinishData(data.finish);
        }

        return true;
    }

    handleFinishData(dataFinish) {
    }

    payChips(resultData) {
        var lostBetItems = _.filter(this.main.betItems, item => !resultData[item.node.name.toLowerCase()]);
        var winBetItems = _.filter(this.main.betItems, item => !!resultData[item.node.name.toLowerCase()]);

        _.forEach(lostBetItems, item => {
            this.main.betChips.moveChipsToDealer(item.chipNode, this.main.dealerChipBox);
        });

        setTimeout(() => {
            _.forEach(winBetItems, item => {
                this.main.betChips.payoutChips(item.chipNode, this.main.dealerChipBox, item.chipRange);
            })
        }, 800);
    }
}
