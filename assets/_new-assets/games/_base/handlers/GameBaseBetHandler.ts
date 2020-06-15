import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import * as _ from "lodash";
import GameRoomBase from "../GameRoomBase";
import { getLowercaseObjectKeys } from '../../../common/helpers/Helper.js';
import RoomPlayer from "../RoomPlayer";

export default class GameBaseBetHandler implements DataHandler {
    private playerChips = [];
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (this.main.isStopGame) {
            return true;
        }

        if (data.totalBets || data.ownBets) {
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
                this.playerChips.push(data.playerChip);

                let delayTime = 0;

                if (this.main.currentTimeRemaining >= this.main.config.stopBetTime + 2) {
                    delayTime = this.playerChips.length * 0.07;
                }
                else {
                    delayTime = this.playerChips.length * 0.01;
                }

                this.main.node.runAction(cc.sequence(
                    cc.delayTime(delayTime > 1 ? delayTime / 2 : delayTime),
                    cc.callFunc(() => this.placePlayerChip(data.playerChip))
                ));
            }

            if (data.chips && data.remainingTime < mainRoomGame.config.betTime) {
                this.placeTotalChips(data.chips);
            }
        }

        return true;
    }


    placeOwnChip(data) {
        const betOption = data.box.toLowerCase();
        const bet = data.bet;
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betOption);

        this.main.betChips.placeChipBet(
            bet,
            betItem.chipNode);
    }

    placePlayerChip(data) {
        var gameRoomMain = this.main as GameRoomBase;

        if (gameRoomMain) {
            var betOption = data.box.toLowerCase();
            var bet = data.bet;
            var startNode: cc.Node;
            var playerSlot = gameRoomMain.playerHandler.getPlayerSlot(data.playerId);
            var betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betOption);

            if (playerSlot) {
                playerSlot.setBalance(data.red);
                playerSlot.data.idleCount = 0;
                RoomPlayer.storePlayerToCache(playerSlot.data, this.main.gameName);
                startNode = playerSlot.avatar.node;
            }
            else {
                startNode = gameRoomMain.otherPlayers;
                var player = gameRoomMain.playerHandler.otherPlayers[data.playerId];

                if (player) {
                    player.idleCount = 0;
                    player.red = data.red;
                    RoomPlayer.storePlayerToCache(player, this.main.gameName);
                }
            }
            this.main.betChips.placeChipBet(bet, betItem.chipNode, startNode);
            this.playerChips.pop();
        }
    }

    placeTotalChips(chips) {
        if (!chips) {
            return;
        }

        const chipsKeys = getLowercaseObjectKeys(chips);

        _.forEach(this.main.betItems, item => {
            const betItemData = chips[chipsKeys[item.node.name.toLowerCase()]];
            this.main.betChips.initChips(betItemData, item.chipNode);
        });
    }
}
