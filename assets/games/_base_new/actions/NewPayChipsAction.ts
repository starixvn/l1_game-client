import * as _ from "lodash";

import GameUtils from "../../../common/GameUtils";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import {
    dealerGetChips,
    dealerPayChips,
    moveChipPlayers,
    payChipsToOtherPlayers,
    playWinningEffect,
} from "../../_base/action/PayChipsAction";
import GameBase from "../../_base/GameBase";
import BetItem from "../../_base/view-models/BetItem";
import TableGameBase from "../view-models/TableGameBase";

let duraionPayChips = 0;
let duraionWinning = 0;

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
    duraionPayChips = payChipFlyTime;
    duraionWinning = winningAnimationDuration;
    if (!mainRoomGame || !settlementResult || !mainRoomGame.enablePlaceChips || !main.node) {
        return;
    }
    const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
    const lostBetItems = _.filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    const winBetItems = _.filter(main.betItems, (item) => !!settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);

    if (!main.node.activeInHierarchy) {
        dealerGetChips(mainRoomGame, lostBetItems);
        dealerPayChips(mainRoomGame, winBetItems);
        payChipToAllPlayers(mainRoomGame, winBetItems, winningPlayers);
    } else {
        main.node.runAction(
            cc.sequence(
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => dealerGetChips(mainRoomGame, lostBetItems)),
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => dealerPayChips(mainRoomGame, winBetItems)),
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => {
                    payChipToAllPlayers(mainRoomGame, winBetItems, winningPlayers);
                })
            )
        );
    }
};

const payChipToAllPlayers = (mainRoomGame: TableGameBase, winBetItems: BetItem[], winningPlayers): void => {
    payChipsToLoginPlayer(mainRoomGame, mainRoomGame.gameData.settlement.status, winBetItems, mainRoomGame.otherPlayers !== null);
    if (mainRoomGame.otherPlayers) {
        payChipsToOtherPlayers(mainRoomGame, winBetItems);
    }

    payChipsToInGamePlayers(winningPlayers, mainRoomGame, winBetItems);
};

const payChipsToLoginPlayer = (mainRoomGame: TableGameBase, statusData, winBetItems: BetItem[], isOtherPlayers = true) => {
    if (!statusData || !statusData.win) {
        return;
    }

    moveChipPlayers(mainRoomGame, statusData, winBetItems, isOtherPlayers);
    mainRoomGame.gameData.settlement.showStatus();
};

const payChipsToInGamePlayers = (winningPlayers: any, mainRoomGame: TableGameBase, winBetItems: BetItem[]) => {
    if (!winningPlayers) {
        return;
    }

    const winningPlayerIds = Object.keys(winningPlayers);

    _.forEach(winningPlayerIds, (playerId) => {
        const winningPlayerData = winningPlayers[playerId];
        const playerSlot = mainRoomGame.getPlayerSlot(playerId);
        const playerBetItems = winningPlayerData.winningByChoices;
        const bet = winningPlayerData.bet;

        if (playerSlot) {
            _.forEach(winBetItems, (item) => {
                if (playerBetItems && playerBetItems[item.node.name.toLowerCase()] > 0) {
                    mainRoomGame.betChips.moveChipsWithRandomAmount(item.chipNode, playerSlot.avatar.node, duraionPayChips);
                }
            });

            playerSlot.increaseBalance(winningPlayerData.bet);
            const convertValue = GameUtils.getValueByCurrency(bet, winningPlayerData.rate || 1);
            GameUtils.addFlyingText(playerSlot.node, true, convertValue, duraionWinning, 0, 10);
            playWinningEffect(mainRoomGame, playerSlot.node, duraionWinning);
        }
    });
};
