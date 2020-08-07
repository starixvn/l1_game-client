import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import Roulette from "../Roulette";
import * as _ from "lodash";
import RouletteUtils from "../RouletteUtils";

export default class RouletteBetHandler extends GameBaseBetHandler {
    constructor(protected readonly main: Roulette) {
        super(main);
    }

    handle(data: any): boolean {
        if (this.main.isStopGame || this.main.isDisableGame) {
            return true;
        }

        if (data.ownBets) {
            this.main.currentBetChoices = _.cloneDeep(data.ownBets);
            this.main.tempBetChoices = {};
            this.main.rouletteMain.board.showBetChoices(this.main.currentBetChoices);
        }

        if (data.endBet) {
            data.endBet != -1 && this.main.showAcceptedBet(data.endBet); //endCuoc -1 is error
            this.main.showProcessingWarning(false);
        }

        if (data.othersBetChoices) {
            const other = data.othersBetChoices;
            var playerSlot = this.main.playerHandler.getPlayerSlot(other.playerId);
            let startNode: cc.Node;
            if (playerSlot) {
                startNode = playerSlot.avatar.node;
            } else {
                startNode = this.main.otherPlayers;
            }

            for (let type in other.betChoices) {
                for (let key in other.betChoices[type]) {
                    const destNode = this.main.rouletteMain.board.getBetNodeByKey(type, key);
                    this.main.betChips.placeChipBetRoulette(other.betChoices[type][key], destNode, startNode, () => { }, 1);
                }
            }
        }

        return true;
    }
