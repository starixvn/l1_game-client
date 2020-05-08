
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameBaseTimeHandler from "./GameBaseTimeHandler";
import * as _ from "lodash";
import GameRoomBase from "../GameRoomBase";
import BetItem from "../BetItem";

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

        this.main.node.runAction(
            cc.sequence(
                cc.callFunc(() => this.dealerGetChips(resultData, lostBetItems)),
                cc.delayTime(0.8),
                cc.callFunc(() => this.dealerPayChips(resultData, winBetItems)),
                cc.delayTime(0.8),
                cc.callFunc(() => this.payCurrentUserChips(this.main.statusHandler.statusData, winBetItems)),
                // cc.callFunc(() => this.payOtherPlayers(dataFinish, gameRoomBase, winBetItems))
            )
        )
    }

    private payOtherPlayers(dataFinish: any, roomGame: GameRoomBase, winBetItems: BetItem[]) {
        // var winningPlayers = dataFinish.winningPlayers;
        // var winningPlayerIds = Object.keys(winningPlayers);
        // _.forEach(winningPlayerIds, playerId => {
        //     var winningPlayerData = winningPlayers[playerId];
        //     var playerSlot = gameRoomBase.playerHandler.getPlayerSlot(playerId);
        //     if (playerSlot) {
        //         var playerPosition = playerSlot.node.parent.convertToWorldSpaceAR(playerSlot.node.position);
        //     }
        // });

        _.forEach(winBetItems, item => {
            this.main.betChips.moveChips(item.chipNode, roomGame.otherPlayers);
        })
    }

    dealerGetChips(resultData: any, lostBetItems: BetItem[]) {
        _.forEach(lostBetItems, item => {
            this.main.betChips.moveChips(item.chipNode, this.main.dealerChipBox);
        });
    }

    dealerPayChips(resultData: any, winBetItems: BetItem[]) {
        _.forEach(winBetItems, item => {
            this.main.betChips.payoutChips(item.chipNode, this.main.dealerChipBox, item.chipRange);
        });
    }

    payCurrentUserChips(statusData, winBetItems: BetItem[]) {
        var roomGame = this.main as GameRoomBase;
        console.log(statusData)
        if (!statusData || !statusData.win) {
            return;
        }

        var userBetData = statusData.boxes;

        _.forEach(winBetItems, item => {
            if (userBetData[item.node.name.toLowerCase()]) {
                this.main.betChips.moveChipsWithRandomAmount(item.chipNode, roomGame.userAvatar.node);
            }
        })
    }
}
