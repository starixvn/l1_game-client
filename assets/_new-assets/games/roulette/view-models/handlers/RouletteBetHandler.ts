import GameBaseBetHandler from "../../../_base/handlers/GameBaseBetHandler";
import Roulette from "../Roulette";
import * as _ from "lodash";

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

        return true;
    }
