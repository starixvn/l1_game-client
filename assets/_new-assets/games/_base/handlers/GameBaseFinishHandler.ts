
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameBaseTimeHandler from "./GameBaseTimeHandler";
import * as _ from "lodash";
import GameRoomBase from "../GameRoomBase";

export default class GameBaseFinishHandler implements DataHandler {
    constructor(
        protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.timeHandler.resetTime();
            this.handleFinishData(data.finish);
            this.payChips(data.finish);
        }

        return true;
    }

    handleFinishData(dataFinish) {
    }

    payChips(dataFinish) {
        var gameRoomBase = this.main as GameRoomBase;

        if (!gameRoomBase) {
            return;
        }

        var resultData = dataFinish.result;

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

        var winningPlayers = dataFinish.winningPlayers;
        var winningPlayerIds = Object.keys(winningPlayers);
        _.forEach(winningPlayerIds, playerId => {
            var winningPlayerData = winningPlayers[playerId];
            var playerSlot = gameRoomBase.playerHandler.getPlayerSlot(playerId);

            if (playerSlot) {
                var playerPosition = playerSlot.node.parent.convertToWorldSpaceAR(playerSlot.node.position);
            }

        });
    }
}
