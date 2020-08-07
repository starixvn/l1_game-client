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

    payChipToLoginUser() {
        const data = this.main.statusHandler.currentStatusData;
        if (!data || !data.win) {
            return;
        }

        const playerNode = this.main.userAvatar.node.parent;
        this.main.clearCurrentBetChoices();

        for (let type in data.winningByChoices) {
            for (let key in data.winningByChoices[type]) {
                const startNode = this.main.rouletteMain.board.getBetNodeByKey(type, key);
                this.main.betChips.placeChipBetRoulette(data.winningByChoices[type][key], playerNode, startNode, () => { }, 0, this.payChipFlyTime);
            }
        }

        this.main.showWinningBet(data.bet);
        this.playWinningEffect(this.main, playerNode);

        cc.RedT.send({
            user: {
                updateCoint: true
            }
        });
    }

    payChipsFromBetChoices(winningPlayers: any) {
        for (let playerId in winningPlayers) {
            const data = winningPlayers[playerId];
            const playerSlot = this.main.playerHandler.getPlayerSlot(playerId);
            let destNode: cc.Node;
            if (playerSlot) {
                destNode = playerSlot.avatar.node;

                playerSlot.increaseBalance(data.bet);
                GameUtils.addFlyingText(playerSlot.node, true, data.bet, 3, 0, 10);
                this.playWinningEffect(this.main, playerSlot.node);
            } else {
                destNode = this.main.otherPlayers;
            }

            for (let type in data.winningByChoices) {
                for (let key in data.winningByChoices[type]) {
                    const startNode = this.main.rouletteMain.board.getBetNodeByKey(type, key);
                    this.main.betChips.placeChipBetRoulette(data.winningByChoices[type][key], destNode, startNode, () => {
                        if (playerSlot) {
                            playerSlot.increaseBalance(data.bet);
                            GameUtils.addFlyingText(playerSlot.node, true, data.bet, 3, 0, 10);
                            this.playWinningEffect(this.main, playerSlot.node);
                        }
                    }, 0, this.payChipFlyTime);
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
