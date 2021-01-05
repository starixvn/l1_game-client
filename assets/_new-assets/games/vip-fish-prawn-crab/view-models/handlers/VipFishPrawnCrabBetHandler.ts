import * as _ from "lodash";

import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import VipFishPrawnCrab from "../VipFishPrawnCrab";

export default class VipFishPrawnCrabBetHandler extends GameBaseBetHandler {
    constructor(protected readonly main: VipFishPrawnCrab) {
        super(main);
    }

    placeOwnChip(data) {
        const { betChoice, amount } = data;
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());

        this.main.betChips.placeChipBet(amount, betItem.chipNode);
    }

    placePlayerChip(data) {
        const { betChoice, amount } = data;
        let startNode: cc.Node;
        const playerSlot = this.main.playerHandler.getPlayerSlot(data.playerId);
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());

        if (playerSlot) {
            this.updatePlayerSlotDataStorage(data, playerSlot);
            startNode = playerSlot.avatar.node;
        } else {
            startNode = this.main.otherPlayers;
            this.updateOtherDataStorage(data);
        }
        betItem?.chipNode && this.main.betChips.placeChipBet(amount, betItem.chipNode, startNode);
        this.playerChips.pop();
    }
}
