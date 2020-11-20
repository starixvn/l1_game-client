import * as _ from "lodash";

import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import Roulette from "../Roulette";
import RouletteUtils from "../RouletteUtils";

export default class RouletteBetHandler extends GameBaseBetHandler {
    constructor(protected readonly main: Roulette) {
        super(main);
    }

    clearTempBetChoices() {
        this.main.clearTempBetChoices();
    }

    handle(data: any): boolean {
        if (this.main.isStopGame || this.main.isDisableGame) {
            return true;
        }

        if (data.ownBets) {
            this.main.currentTimeRemaining = data.remainingTime || this.main.currentTimeRemaining;
            this.main.currentBetChoices = _.cloneDeep(data.ownBets);
            this.main.previousRoundBetChoices = _.cloneDeep(this.main.currentBetChoices);
            this.clearTempBetChoices();
        }

        if (data.endBet) {
            data.endBet != -1 && this.main.showAcceptedBet(data.endBet); //endCuoc -1 is error
            this.main.showProcessingWarning(false);
            this.clearTempBetChoices();
        }

        if (data.othersBetChoices) {
            const other = data.othersBetChoices;
            const playerSlot = this.main.playerHandler.getPlayerSlot(other.playerId);
            let startNode: cc.Node;
            if (playerSlot) {
                startNode = playerSlot.avatar.node;
                this.updatePlayerSlotDataStorage(other, playerSlot);
            } else {
                startNode = this.main.otherPlayers;
                this.updateOtherDataStorage(other);
            }

            const duration = 0.8;
            const remainingTimeToStopBet = this.main.currentTimeRemaining - this.main.config.stopBetTime;
            for (let type in other.betChoices) {
                for (let key in other.betChoices[type]) {
                    const destNode = this.main.rouletteMain.board.getBetNodeByKey(type, key, true);
                    const bet = other.betChoices[type][key];
                    // const chipNode = RouletteUtils.createChips(bet, this.main.betChips.chipAltas);
                    // this.main.betChips.moveChipWithCallback(chipNode, bet, destNode, startNode, () => {
                    //     // this.main.rouletteMain.board.addBetChoiceByKey(type, key, bet, true);
                    // }, 4, 0.8);
                    const values = RouletteUtils.getChipValues(bet);

                    let count = 0;
                    Object.keys(values).forEach(chip => {
                        if (values[chip] > 0) {
                            for (let i = 0; i < values[chip]; i++) {
                                const delayTime = count * 0.5;
                                if (remainingTimeToStopBet > duration + delayTime) {
                                    cc.tween(this.main)
                                        .delay(delayTime)
                                        .call(() => {
                                            const chipNode = RouletteUtils.createChip(+chip, this.main.betChips.chipAltas);
                                            this.main.betChips.moveChipWithCallback(chipNode, bet, destNode, startNode, () => { }, 4, duration);
                                        })
                                        .start();
                                }
                                count++;
                            }
                        }
                    });
                }
            }
        }

        return true;
    }
}
