import * as _ from "lodash";

import { getLowercaseObjectKeys } from "../../../../common/helpers/ObjectHelper";
import BetItem from "../../../_base/BetItem";
import GameRoomBase from "../../../_base/GameRoomBase";
import SedieFinishHandler from "../../../xoc-xoc/view-models/handlers/SedieFinishHandler";
import VipSedieWar from "../VipSedieWar";

export default class VipSedieWarFinishHandler extends SedieFinishHandler {
    constructor(protected readonly main: VipSedieWar) {
        super(main);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.setDotsResult();
        cc.tween(this.main)
            .call(() => this.main.openPlate(true))
            .delay(1.5)
            .call(() => {
                this.main.showResultOnTable();
                onFinishHandlingData();
            })
            .start();
    }

    payChipsToLoginPlayer(mainRoomGame: GameRoomBase, statusData, winBetItems: BetItem[]) {
        if (!statusData || !statusData.win) {
            return;
        }

        var betItems = statusData.winningByChoices;
        const betItemLowercaseObjectKeys = getLowercaseObjectKeys(betItems);

        _.forEach(winBetItems, (item) => {
            if (betItems[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]) {
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

    payChipsToOtherPlayers(roomGame: GameRoomBase, winBetItems: BetItem[]) {
        if (!roomGame.otherPlayers) {
            return;
        }
        super.payChipsToOtherPlayers(roomGame, winBetItems);
    }
}
