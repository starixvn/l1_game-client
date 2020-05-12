
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import * as _ from "lodash";
import GameRoomBase from "../GameRoomBase";

export default class GameBaseBetHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.totalBets || data.ownBets) {
            this.main.showProcessingWarning(false);
            this.main.betItems.forEach(item => item.setData(data));
        }

        if (data.endBet) {
            data.endBet != -1 && this.main.showAcceptedBet(data.endBet); //endCuoc -1 is error
            this.main.showProcessingWarning(false);
        }

        var mainRoomGame = this.main as GameRoomBase;

        if (mainRoomGame && mainRoomGame.enablePlaceChips) {
            if (data.ownChip) {
                this.placeOwnChip(data.ownChip);
            }

            if (data.playerChip) {
                this.placePlayerChip(data.playerChip);
            }

            if (data.chips && data.remainingTime < mainRoomGame.config.betTime) {
                this.placeTotalChips(data.chips);
            }
        }

        return true;
    }


    placeOwnChip(data) {
        var betOption = data.box;
        var bet = data.bet;
        var betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betOption);

        this.main.betChips.placeChipBet(
            bet,
            betItem.chipNode);
    }

    placePlayerChip(data) {
        var gameRoomMain = this.main as GameRoomBase;

        if (gameRoomMain) {
            var betOption = data.box;
            var bet = data.bet;
            var startNode: cc.Node;
            var playerSlot = gameRoomMain.playerHandler.getPlayerSlot(data.playerId);
            var betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betOption);

            if (playerSlot) {
                playerSlot.setBalance(data.red);
                startNode = playerSlot.avatar.node;
            }
            else {
                startNode = gameRoomMain.otherPlayers;
                var player = gameRoomMain.playerHandler.otherPlayers[data.playerId];

                if (player) {
                    player.red = data.red;
                }
            }

            this.main.betChips.placeChipBet(bet, betItem.chipNode, startNode);
        }
    }

    placeTotalChips(chips) {
        if (!chips) {
            return;
        }

        _.forEach(this.main.betItems, item => {
            var betItemData = chips[item.node.name.toLowerCase()];
            this.main.betChips.initChips(betItemData, item.chipNode);
        });
    }
}
