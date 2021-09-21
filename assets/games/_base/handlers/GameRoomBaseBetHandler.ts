import * as _ from "lodash";

import WebSocketTableGameBase from "../WebSocketTableGameBase";
import GameBaseBetHandler from "./GameBaseBetHandler";

export default class GameRoomBaseBetHandler extends GameBaseBetHandler {
    constructor(protected readonly main: WebSocketTableGameBase) {
        super(main);
    }

    placeOwnChip(data) {
        const { betChoice, amount } = data;
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());

        this.main.betChips.placeChipToChipBox(amount, betItem.chipNode, null, null);
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
        this.main.betChips.placeChipToChipBox(amount, betItem.chipNode, startNode, null);
        this.playerChips.pop();
    }
}
