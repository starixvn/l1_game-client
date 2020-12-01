import * as _ from "lodash";

import { getLowercaseObjectKeys } from "../../../../common/helpers/Helper.js";
import BetItem from "../../../_base/BetItem";
import GameRoomBase from "../../../_base/GameRoomBase";
import SedieFinishHandler from "../../../xoc-xoc/view-models/handlers/SedieFinishHandler";
import VipSedieWar from "../VipSedieWar";

export default class VipSedieWarFinishHandler extends SedieFinishHandler {
    constructor(protected readonly main: VipSedieWar) {
        super(main);
    }

    payChipsToLoginPlayer(mainRoomGame: GameRoomBase, statusData, winBetItems: BetItem[]) {
        if (!statusData || !statusData.win) {
            return;
        }

        var betItems = statusData.winningByChoices;
        const betItemLowercaseObjectKeys = getLowercaseObjectKeys(betItems);

        _.forEach(winBetItems, item => {
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