import * as _ from "lodash";

import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";

export default class SedieBetHandler extends GameBaseBetHandler {

    placeOwnChip(data) {
        const { betChoice, amount } = data;
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());

        this.main.betChips.placeChipBet(
            amount,
            betItem.chipNode);
    }
}