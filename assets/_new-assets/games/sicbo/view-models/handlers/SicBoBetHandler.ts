import * as _ from "lodash";
import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import SicBo from "../SicBo";

export default class SicBoBetHandler extends GameBaseBetHandler {

    constructor(protected readonly main: SicBo) {
        super(main);
    }

    handle(data: any): boolean {
        super.handle(data);

        if (data.ownBets) {
            const bets = Object.values(data.ownBets);
            let ownBetTotal = 0;
            bets.forEach(bet => ownBetTotal += +bet);
        }

        if (data.ownChip) {
            this.placeOwnChip(data.ownChip);
        }

        if (data.chips && this.main.currentTimeRemaining < this.main.config.betTime) {
            this.placeTotalChips(data.chips);
        }

        return true;
    }

    placeOwnChip(data) {
        const { betChoice, amount } = data;
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());

        this.main.betChips.placeChipBet(
            amount,
            betItem.chipNode);
    }

    placePlayerChip(data) {
        const { betChoice, amount } = data;
        let startNode: cc.Node;
        const playerSlot = this.main.playerHandler.getPlayerSlot(data.playerId);
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());

        if (playerSlot) {
            this.updatePlayerSlotDataStorage(data, playerSlot);
            startNode = playerSlot.avatar.node;
        }
        else {
            startNode = this.main.otherPlayers;
            this.updateOtherDataStorage(data);
        }
        betItem?.chipNode && this.main.betChips.placeChipBet(amount, betItem.chipNode, startNode);
        this.playerChips.pop();
    }
}