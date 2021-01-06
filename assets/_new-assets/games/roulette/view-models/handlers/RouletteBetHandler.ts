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

        if (!this.main.isStopGame && !this.main.isDisableGame) {
            if (data.ownBets) {
                this.main.currentTimeRemaining = data.remainingTime || this.main.currentTimeRemaining;
                this.main.currentBetChoices = _.cloneDeep(data.ownBets);
                this.main.previousRoundBetChoices = _.cloneDeep(this.main.currentBetChoices);
                this.clearTempBetChoices();
            }

            if (data.endBet) {
                data.endBet !== -1 && this.main.showAcceptedBet(data.endBet);
                this.main.showProcessingWarning(false);
                this.clearTempBetChoices();
            }

            if (data.othersBetChoices) {
                this.handleDataOnOthersBetChoices(data);
            }

            return true;
        }

        return false;
    }

    handleDataOnOthersBetChoices(data: any) {
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

        this.handleTypeBetChoices(data, startNode);
    }

    handleTypeBetChoices(data: any, startNode: any) {
        const other = data.othersBetChoices;
        for (const type in other.betChoices) {
            for (const key in other.betChoices[type]) {
                this.handleAnimatedChip(data, type, key, startNode);
            }
        }
    }

    handleAnimatedChip(data: any, type: any, key: any, startNode: any) {
        const other = data.othersBetChoices;
        const duration = 0.8;
        const remainingTimeToStopBet = this.main.currentTimeRemaining - this.main.config.stopBetTime;
        const destNode = this.main.rouletteMain.board.getBetNodeByKey(type, key, true);
        const bet = other.betChoices[type][key];
        const values = RouletteUtils.getChipValues(bet);

        let count = 0;
        Object.keys(values).forEach((chip) => {
            if (values[chip] > 0) {
                for (let i = 0; i < values[chip]; i++) {
                    const delayTime = count * 0.5;
                    if (remainingTimeToStopBet > duration + delayTime) {
                        cc.tween(this.main)
                            .delay(delayTime)
                            .call(() => {
                                const chipNode = RouletteUtils.createChip(+chip, this.main.betChips.chipAltas);
                                this.main.betChips.moveChipWithCallback(chipNode, bet, destNode, startNode, () => {}, 4, duration);
                            })
                            .start();
                    }
                    count++;
                }
            }
        });
    }
}
