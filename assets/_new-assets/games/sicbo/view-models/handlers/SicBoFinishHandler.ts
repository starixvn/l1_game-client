import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import SicBo from "../SicBo";
import GameRoomBase from '../../../_base/GameRoomBase';
import BetItem from '../../../_base/BetItem';
import * as _ from "lodash";

export default class SicBoFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: SicBo) {
        super(main, 3);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();

        this.main.setResult();

        if (cc.RedT.GAME_IS_SHOWED) {
            cc.tween(this.main.node)
                .call(() => {
                    this.main.shakeAnimation.node.active = false;
                    this.main.openDiskAnimation.node.active = true;
                    this.main.openDiskAnimation.play();
                })
                .delay(this.playResultAnimationTime)
                .call(() => {
                    onFinishHandlingData();
                    this.main.highlightWinningBetItems();
                    this.main.updateStatistic(this.main.currentDataLogs);
                    this.main.updateRoundHistory(this.main.currentDataLogs);
                })
                .start();
        }
    }

    payChipsToOtherPlayers(roomGame: GameRoomBase, winBetItems: BetItem[]) {
        if (!roomGame.otherPlayers) {
            return;
        }
        super.payChipsToOtherPlayers(roomGame, winBetItems);
    }


    payChipsToLoginPlayer(mainRoomGame: GameRoomBase, statusData, winBetItems: BetItem[]) {
        if (!statusData || !statusData.win) {
            return;
        }

        var betItems = statusData.winningByChoices;

        _.forEach(winBetItems, item => {
            if (betItems[item.node.name.toLowerCase()]) {
                this.main.betChips.moveChips(item.chipNode, mainRoomGame.userAvatar.node);
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
}
