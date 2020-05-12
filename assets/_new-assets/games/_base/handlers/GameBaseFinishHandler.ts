
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import * as _ from "lodash";
import GameRoomBase from "../GameRoomBase";
import BetItem from "../BetItem";
import GameUtils from "../../../common/GameUtils";
import RoomPlayer from "../RoomPlayer";

export default class GameBaseFinishHandler implements DataHandler {
    constructor(
        protected readonly main: GameBase, private readonly playResultAnimationTime: number = 0) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.timeHandler.resetTime();
            this.handleFinishData(data.finish);

            setTimeout(() => this.payChips(data.finish.settlementResult, data.finish.winningPlayers), this.playResultAnimationTime * 1000);
        }

        return true;
    }

    handleFinishData(dataFinish) {
    }


    payChips(settlementResult: any, winningPlayers: any) {
        var mainRoomGame = this.main as GameRoomBase;

        if (!mainRoomGame || !settlementResult || !mainRoomGame.enablePlaceChips) {
            return;
        }

        var lostBetItems = _.filter(this.main.betItems, item => !settlementResult[item.node.name.toLowerCase()]);
        var winBetItems = _.filter(this.main.betItems, item => !!settlementResult[item.node.name.toLowerCase()]);

        this.main.node.runAction(
            cc.sequence(
                cc.callFunc(() => this.dealerGetChips(mainRoomGame, lostBetItems)),
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => this.dealerPayChips(mainRoomGame, winBetItems)),
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => this.payChipsToLoginPlayer(mainRoomGame, this.main.statusHandler.currentStatusData, winBetItems)),
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => this.payChipsToInGamePlayers(winningPlayers, mainRoomGame, winBetItems)),
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => this.payChipsToOtherPlayers(mainRoomGame, winBetItems))
            )
        )
    }

    dealerGetChips(mainRoomGame: GameRoomBase, lostBetItems: BetItem[]) {
        _.forEach(lostBetItems, item => {
            this.main.betChips.moveChips(item.chipNode, mainRoomGame.dealerChipBox);
        });
    }

    dealerPayChips(mainRoomGame: GameRoomBase, winBetItems: BetItem[]) {
        _.forEach(winBetItems, item => {
            this.main.betChips.payChipsToWinningBetItem(item.chipNode, mainRoomGame.dealerChipBox);
        });
    }

    payChipsToLoginPlayer(mainRoomGame: GameRoomBase, statusData, winBetItems: BetItem[]) {
        if (!statusData || !statusData.win) {
            return;
        }

        var betItems = statusData.winningByChoices;

        _.forEach(winBetItems, item => {
            if (betItems[item.node.name.toLowerCase()]) {
                this.main.betChips.moveChipsWithRandomAmount(item.chipNode, mainRoomGame.userAvatar.node);
            }
        });

        this.playWinningEffect(mainRoomGame, mainRoomGame.userAvatar.node);
    }

    payChipsToInGamePlayers(winningPlayers: any, mainRoomGame: GameRoomBase, winBetItems: BetItem[]) {
        if (!winningPlayers) {
            return;
        }

        var winningPlayerIds = Object.keys(winningPlayers);

        _.forEach(winningPlayerIds, (playerId) => {
            var winningPlayerData = winningPlayers[playerId];
            var playerSlot = mainRoomGame.playerHandler.getPlayerSlot(playerId);
            var playerBetItems = winningPlayerData.winningByChoices;
            var bet = winningPlayerData.bet;

            if (playerSlot) {
                _.forEach(winBetItems, item => {
                    if (playerBetItems && playerBetItems[item.node.name.toLowerCase()] > 0) {
                        this.main.betChips.moveChipsWithRandomAmount(item.chipNode, playerSlot.avatar.node);
                    }
                });

                playerSlot.increaseBalance(winningPlayerData.bet);
                GameUtils.addFlyingText(playerSlot.node, true, bet, 3, 10);
                this.playWinningEffect(mainRoomGame, playerSlot.node);
            }
        });
    }

    payChipsToOtherPlayers(roomGame: GameRoomBase, winBetItems: BetItem[]) {
        _.forEach(winBetItems, item => {
            this.main.betChips.moveChips(item.chipNode, roomGame.otherPlayers);
        })
    }

    playWinningEffect(mainRoomGame: GameRoomBase, playerNode: cc.Node) {
        var winningEffect = cc.instantiate(mainRoomGame.winningPlayerEffectPrefab);
        playerNode.addChild(winningEffect);
        var animation = winningEffect.getComponent(cc.Animation);

        winningEffect.runAction(cc.sequence(
            cc.callFunc(() => { animation.play(); }),
            cc.delayTime(3),
            cc.callFunc(() => { winningEffect.destroy(); })));
    }
}
