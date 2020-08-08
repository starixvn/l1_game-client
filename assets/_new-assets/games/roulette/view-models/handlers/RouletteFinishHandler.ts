import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Roulette from "../Roulette";
import RouletteUtils from "../RouletteUtils";
import GameUtils from "../../../../common/GameUtils";

export default class RouletteFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: Roulette) {
        super(main, 2);
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.finishShowResult = false;
            this.main.node.activeInHierarchy && this.main.gameAudios.playEndGameAudio();
            this.setNewGameRound(data);

            this.handleFinishData(
                data.finish,
                () => {
                    this.payChipToLoginUser();
                    this.payChipsFromBetChoices(data.finish.winningPlayers);
                    this.main.finishShowResult = true;
                })
        }

        return true;
    }

    moveChip(betNumber: number, startNode: cc.Node, destNode: cc.Node, duration: number) {
        const atlas = this.main.rouletteMain.board.chipAltas;
        const chip = RouletteUtils.createChips(betNumber, atlas);
        startNode.addChild(chip);

        const destWorldPosition = destNode.convertToWorldSpaceAR(cc.v2(0, 0));
        const destLocalPosition = startNode.convertToNodeSpaceAR(destWorldPosition);
        chip.runAction(cc.sequence(
            cc.delayTime(0.2), //stay at startNode for awhile
            cc.moveTo(duration, destLocalPosition),
            cc.removeSelf(true),
        ));
    }

    payChipToLoginUser() {
        const data = this.main.statusHandler.currentStatusData;
        if (!data || !data.win) {
            return;
        }

        const playerNode = this.main.userAvatar.node;
        this.main.clearCurrentBetChoices();

        for (let type in data.winningByChoices) {
            for (let key in data.winningByChoices[type]) {
                const startNode = this.main.rouletteMain.board.getBetNodeByKey(type, key);
                this.moveChip(data.winningByChoices[type][key], startNode, playerNode, this.payChipFlyTime);
            }
        }

        cc.tween(this)
            .delay(this.payChipFlyTime)
            .call(() => {
                this.main.showWinningBet(data.bet);
                this.playWinningEffect(this.main, playerNode);

                cc.RedT.send({
                    user: {
                        updateCoint: true
                    }
                });
            })
            .start();
    }

    payChipsFromBetChoices(winningPlayers: any) {
        for (let playerId in winningPlayers) {
            const data = winningPlayers[playerId];
            const playerSlot = this.main.playerHandler.getPlayerSlot(playerId);
            let destNode: cc.Node;
            if (playerSlot) {
                destNode = playerSlot.avatar.node;
                cc.tween(this)
                    .delay(this.payChipFlyTime)
                    .call(() => {
                        playerSlot.increaseBalance(data.bet);
                        GameUtils.addFlyingText(playerSlot.node, true, data.bet, 3, 0, 10);
                        this.playWinningEffect(this.main, playerSlot.node);
                    })
                    .start();
            } else {
                destNode = this.main.otherPlayers;
            }

            for (let type in data.winningByChoices) {
                for (let key in data.winningByChoices[type]) {
                    const startNode = this.main.rouletteMain.board.getBetNodeByKey(type, key);
                    this.moveChip(data.winningByChoices[type][key], startNode, destNode, this.payChipFlyTime);
                }
            }
        }
    }

    public handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        this.main.showWheelResult(dataFinish.result, () => {
            this.main.currentDataLogs.unshift(dataFinish);
            this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
            this.main.updateMiniRoundResult(true);
            onFinishHanlingData();
        });
    }
}
