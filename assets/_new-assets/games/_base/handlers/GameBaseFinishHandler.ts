import * as _ from "lodash";

import GameUtils from "../../../common/GameUtils";
import { getLowercaseObjectKeys } from "../../../common/helpers/Helper.js";
import BetItem from "../BetItem";
import GameBase from "../GameBase";
import GameRoomBase from "../GameRoomBase";
import RoomPlayer from "../RoomPlayer";
import DataHandler from "./DataHandler";


export default class GameBaseFinishHandler implements DataHandler {
    protected readonly payChipFlyTime = 1.2;

    constructor(
        protected readonly main: GameBase, protected readonly playResultAnimationTime: number = 0) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.finishShowResult = false;
            this.main.node.activeInHierarchy && this.main.gameAudios.playEndGameAudio();
            this.setNewGameRound(data);
            const mainRoomGame = this.main as GameRoomBase;
            if (mainRoomGame && mainRoomGame.playerHandler) {
                this.updateOtherPlayerBalance(data.finish.winningPlayers, mainRoomGame);
            }
            this.handleFinishData(
                data.finish,
                () => {
                    this.payChips(data.finish.settlementResult, data.finish.winningPlayers);
                    this.main.finishShowResult = true;
                })
        }

        return true;
    }

    protected setNewGameRound(data: any) {
        this.main.timeHandler.resetTime();
        this.main.roundId = data.finish.roundId + 1;
    }

    public getResultAnimationTime() {
        return this.playResultAnimationTime;
    }

    handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
    }

    payChips(settlementResult: any, winningPlayers: any) {
        const mainRoomGame = this.main as GameRoomBase;

        if (!mainRoomGame || !settlementResult || !mainRoomGame.enablePlaceChips) {
            return;
        }
        const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
        const lostBetItems = _.filter(this.main.betItems, item => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
        const winBetItems = _.filter(this.main.betItems, item => !!settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);

        this.main.node && this.main.node.runAction(
            cc.sequence(
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => this.dealerGetChips(mainRoomGame, lostBetItems)),
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => this.dealerPayChips(mainRoomGame, winBetItems)),
                cc.delayTime(this.main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => {
                    this.payChipsToLoginPlayer(mainRoomGame, this.main.statusHandler.currentStatusData, winBetItems);
                    this.payChipsToInGamePlayers(winningPlayers, mainRoomGame, winBetItems);
                    this.payChipsToOtherPlayers(mainRoomGame, winBetItems);
                }),
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
                this.main.betChips.moveChipsWithRandomAmount(item.chipNode, mainRoomGame.userAvatar.node, this.payChipFlyTime);
            }
        });

        var playerNode = mainRoomGame.userAvatar.node.parent;
        this.main.showWinningBet(statusData.bet);
        this.playWinningEffect(mainRoomGame, playerNode);

        cc.RedT.send({
            user: {
                updateCoin: true
            }
        });
    }

    updateOtherPlayerBalance(winningPlayers: any, main: GameRoomBase) {
        if (!winningPlayers) {
            return;
        }
        Object.keys(winningPlayers).forEach(playerId => {
            const otherPlayerData = main.playerHandler.otherPlayers[playerId];
            if (otherPlayerData) {
                const winningPlayerData = winningPlayers[playerId];
                otherPlayerData.red += winningPlayerData.bet;
                RoomPlayer.storePlayerToCache(otherPlayerData, main.gameName);
            }
        });
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
                        this.main.betChips.moveChipsWithRandomAmount(item.chipNode, playerSlot.avatar.node, this.payChipFlyTime);
                    }
                });

                playerSlot.increaseBalance(winningPlayerData.bet);
                GameUtils.addFlyingText(playerSlot.node, true, bet, 3, 0, 10);
                this.playWinningEffect(mainRoomGame, playerSlot.node);
            }
        });
    }

    payChipsToOtherPlayers(roomGame: GameRoomBase, winBetItems: BetItem[]) {
        let hasChip = false;

        _.forEach(winBetItems, item => {
            if (!hasChip) {
                hasChip = item.chipNode.children.length > 0;
            }
            this.main.betChips.moveChips(item.chipNode, roomGame.otherPlayers);
        })

        hasChip && this.main.betChips.playMultiChipsSound();
    }

    playWinningEffect(mainRoomGame: GameRoomBase, playerNode: cc.Node) {
        var winningEffect = cc.instantiate(mainRoomGame.winningPlayerEffectPrefab);
        playerNode.addChild(winningEffect);
        var animation = winningEffect.getComponent(cc.Animation);

        // console.log("duration anim ", animation.defaultClip.duration);
        winningEffect.runAction(cc.sequence(
            cc.callFunc(() => { animation.play(); }),
            cc.delayTime(3), // 2 * animation.defaultClip.duration, should be multiple of duration to fix animation disappear suddenly
            cc.callFunc(() => { winningEffect.destroy(); })));
    }
}
