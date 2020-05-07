
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import * as _ from "lodash";

export default class GameBaseBetHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.totalBets || data.ownBet) {
            this.main.showProcessingWarning(false);
            this.main.betItems.forEach(item => item.setData(data));
        }

        if (data.endBet) {
            data.endCuoc != -1 && this.main.showAcceptedBet(data.endBet); //endCuoc -1 is error
            this.main.showProcessingWarning(false);
        }

        if (data.ownChip && this.main.enableChips) {
            this.throwOwnChip(data.ownChip);
        }

        if (data.chips && this.main.enableChips) {
            this.throwChips(data.chips);
        }

        return true;
    }


    throwOwnChip(data) {
        console.log(data);
        var betOption = data.box;
        var bet = data.bet;
        var betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betOption);

        this.main.betChips.throwChip(
            bet,
            betItem.chipNode,
            betItem.chipRange);
    }

    throwChips(data) {

    }
}
