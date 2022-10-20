import * as _ from "lodash";

import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import {
    dealerGetChips,
    dealerPayChips,
    PayChipInfo,
    payChipsToInGamePlayers,
    payChipsToLoginPlayer,
    payChipsToOtherPlayers,
} from "../../_base/action/PayChipsAction";
import GameBase from "../../_base/GameBase";

export const clearChipsForLostChoices = (main: any, settlementResult: any) => {
    const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
    const lostBetItems = _.filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    lostBetItems.forEach((item) => item.chipNode.destroyAllChildren());
};

export const resetUIAndClearChips = (game: GameBase) => () => {
    game.resetDataAndUI();
    game.betItems.forEach((item) => item.chipNode.destroyAllChildren());
};

export const payChips = (
    main: any,
    settlementResult: any,
    winningPlayers: any,
    payChipFlyTime: number,
    winningAnimationDuration: number
) => {
    const mainRoomGame = main;
    const payChipsDuration = payChipFlyTime;
    const winningDuration = winningAnimationDuration;
    if (!mainRoomGame || !settlementResult || !mainRoomGame.enablePlaceChips || !main.node) {
        return;
    }
    const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
    const lostBetItems = _.filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    const winBetItems = _.filter(main.betItems, (item) => !!settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);

    const payChipInfo: PayChipInfo = {
        mainRoomGame,
        winBetItems,
        winningPlayers,
        payChipsDuration,
        winningDuration,
        statusData: mainRoomGame.gameData.settlement.status //override
    };
    if (!main.node.activeInHierarchy) {
        dealerGetChips(mainRoomGame, lostBetItems);
        dealerPayChips(mainRoomGame, winBetItems);
        payChipToAllPlayers(payChipInfo);
    } else {
        main.node.runAction(
            cc.sequence(
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => dealerGetChips(mainRoomGame, lostBetItems)),
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => dealerPayChips(mainRoomGame, winBetItems)),
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => {
                    payChipToAllPlayers(payChipInfo);
                })
            )
        );
    }
};

// override
const payChipToAllPlayers = (info: PayChipInfo): void => {
    const { mainRoomGame } = info;
    payChipsToLoginPlayer(info, mainRoomGame.otherPlayers !== null);
    mainRoomGame.gameData.settlement.showStatus();
    if (mainRoomGame.otherPlayers) {
        payChipsToOtherPlayers(info);
    }

    payChipsToInGamePlayers(info);
};
