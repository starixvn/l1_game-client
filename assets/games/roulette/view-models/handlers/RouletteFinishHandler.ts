import GameUtils from "../../../../common/GameUtils";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Roulette from "../Roulette";
import RouletteUtils from "../RouletteUtils";

export default class RouletteFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: Roulette) {
        super(main, 2);
    }

    handle(data: any): boolean {
        if (data.finish) {
            if (!cc.RedT.GAME_IS_SHOWED) {
                return false;
            }
            this.main.finishShowResult = false;
            this.main.node.activeInHierarchy && this.main.gameAudios.playEndGameAudio();
            this.setNewGameRound(data);
            this.updateOtherPlayerBalance(data.finish.winningPlayers, this.main);
            this.handleFinishData(data.finish, () => {
                this.payChipToLoginUser();
                this.payChipsFromBetChoices(data.finish.winningPlayers);
                this.main.finishShowResult = true;
            });
        }

        return true;
    }

    moveChip(betNumber: number, startNode: cc.Node, destNode: cc.Node, duration: number) {
        const atlas = this.main.rouletteMain.board.chipAltas;
        const chip = RouletteUtils.createChips(betNumber, this.main.chipOption, atlas, this.main.betChips.chipConfig);
        startNode.addChild(chip);

        const destWorldPosition = destNode.convertToWorldSpaceAR(cc.v2(0, 0));
        const destLocalPosition = startNode.convertToNodeSpaceAR(destWorldPosition);
        chip.runAction(
            cc.sequence(
                cc.delayTime(0.2), //stay at startNode for awhile
                cc.moveTo(duration, destLocalPosition),
                cc.removeSelf(true)
            )
        );
    }

    payChipToLoginUser() {
        const data = this.main.statusHandler.currentStatusData;
        if (!data || !data.win) {
            return;
        }

        const playerNode = this.main.userAvatar.node.parent;
        this.main.showWinningBet(data.bet);
        this.playWinningEffect(this.main, playerNode);
        this.main.updateUserBalance();
    }

    payChipsFromBetChoices(winningPlayers: any) {
        const duration = 0.7;

        for (const playerId in winningPlayers) {
            const data = winningPlayers[playerId];
            const playerSlot = this.main.playerHandler.getPlayerSlot(playerId);
            if (playerSlot) {
                cc.tween(this.main).delay(duration).call(this.showWinningEffect.bind(this, playerSlot, data)).start();
            }
        }
    }

    showWinningEffect(playerSlot, data) {
        playerSlot.increaseBalance(data.bet);
        GameUtils.addFlyingText(playerSlot.node, true, data.bet, 3, 0, 10);
        this.playWinningEffect(this.main, playerSlot.node);
    }

    public handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        this.main.showWheelResult(dataFinish.result, () => {
            this.main.currentDataLogs.unshift(dataFinish);
            this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
            this.main.updateMiniRoundResult(true);
            this.main.rouletteMain.board.clearOtherBetChoices();
            onFinishHanlingData();
        });
    }
}
