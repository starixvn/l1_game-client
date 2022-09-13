import * as _ from "lodash";

import GameUtils from "../../../common/GameUtils";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import BetItem from "../view-models/BetItem";
import WebSocketTableGameBase from "../WebSocketTableGameBase";

let duraionPayChips = 0;
let duraionWinning = 0;
export const payChips = (
    main: any,
    settlementResult: any,
    winningPlayers: any,
    payChipFlyTime: number,
    winningAnimationDuration: number
) => {
    const mainRoomGame = main as WebSocketTableGameBase;
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

export const payChipToAllPlayers = (mainRoomGame: WebSocketTableGameBase, winBetItems: BetItem[], winningPlayers): void => {
    payChipsToLoginPlayer(mainRoomGame, mainRoomGame.statusHandler.currentStatusData, winBetItems, mainRoomGame.otherPlayers !== null);
    if (mainRoomGame.otherPlayers) {
        payChipsToOtherPlayers(mainRoomGame, winBetItems);
    }

    payChipsToInGamePlayers(winningPlayers, mainRoomGame, winBetItems);
};

export const dealerGetChips = (mainRoomGame: any, lostBetItems: BetItem[]) => {
    _.forEach(lostBetItems, (item) => {
        mainRoomGame.betChips.moveChips(item.chipNode, mainRoomGame.dealerChipBox);
    });
};

export const dealerPayChips = (mainRoomGame: any, winBetItems: BetItem[]) => {
    _.forEach(winBetItems, (item) => {
        mainRoomGame.betChips.payChipsToWinningBetItem(item.chipNode, mainRoomGame.dealerChipBox);
    });
};

const payChipsToLoginPlayer = (mainRoomGame: WebSocketTableGameBase, statusData, winBetItems: BetItem[], isOtherPlayers = true) => {
    if (!statusData || !statusData.win) {
        return;
    }

    moveChipPlayers(mainRoomGame, statusData, winBetItems, isOtherPlayers);

    mainRoomGame.showWinningBet(statusData.bet);
    const playerNode = mainRoomGame.userProfile?.userAvatar?.node?.parent;
    playerNode && playWinningEffect(mainRoomGame, playerNode);
    mainRoomGame.updateUserBalance();
};

export const moveChipPlayers = (mainRoomGame: any, statusData, winBetItems: BetItem[], isOtherPlayers = true) => {
    const betItems = statusData.winningByChoices;
    if (isOtherPlayers) {
        moveChipWithRandomAmountToLoginPlayer(winBetItems, betItems, mainRoomGame);
    } else {
        moveChipWithAmountToLoginPlayer(winBetItems, betItems, mainRoomGame);
    }
};

const moveChipWithRandomAmountToLoginPlayer = (winBetItems: BetItem[], betItems, mainRoomGame: any) => {
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    _.forEach(winBetItems, (item) => {
        if (betItems[item.node.name.toLowerCase()]) {
            mainRoomGame.betChips.moveChipsWithRandomAmount(item.chipNode, destNode, duraionPayChips);
        }
    });
};

const moveChipWithAmountToLoginPlayer = (winBetItems: BetItem[], betItems, mainRoomGame: any) => {
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    const betItemLowercaseObjectKeys = getLowercaseObjectKeys(betItems);
    _.forEach(winBetItems, (item) => {
        if (betItems[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]) {
            mainRoomGame.betChips.moveChips(item.chipNode, destNode);
        }
    });
};

export const payChipsToOtherPlayers = (roomGame: any, winBetItems: BetItem[]) => {
    if (!roomGame.otherPlayers) {
        return;
    }

    _.forEach(winBetItems, (item) => {
        roomGame.betChips.moveChips(item.chipNode, roomGame.otherPlayers);
    });
};

const payChipsToInGamePlayers = (winningPlayers: any, mainRoomGame: any, winBetItems: BetItem[]) => {
    if (!winningPlayers) {
        return;
    }

    const winningPlayerIds = Object.keys(winningPlayers);

    _.forEach(winningPlayerIds, (playerId) => {
        const winningPlayerData = winningPlayers[playerId];
        const playerSlot = mainRoomGame.playerHandler.getPlayerSlot(playerId);
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
            playWinningEffect(mainRoomGame, playerSlot.node);
        }
    });
};

export const playWinningEffect = (mainRoomGame: any, playerNode: cc.Node, duration = duraionWinning) => {
    const winningEffect = cc.instantiate(mainRoomGame.winningPlayerEffectPrefab);
    winningEffect.name = "winningEffect";
    playerNode.addChild(winningEffect);
    const animation = winningEffect.getComponent(cc.Animation);

    winningEffect.runAction(
        cc.sequence(
            cc.callFunc(() => {
                animation.play();
            }),
            cc.delayTime(duration), // 2 * animation.defaultClip.duration, should be multiple of duration to fix animation disappear suddenly
            cc.callFunc(() => {
                winningEffect.destroy();
            })
        )
    );
};

export const dealerGetChipsMiniGame = (main: any, settlementResult: any, statusData: any, ownBets: any) => {
    if (!cc.RedT.GAME_IS_SHOWED) {
        return;
    }
    const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
    const lostBetItems = _.filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    const status = { ...statusData };
    cc.tween(main.node)
        .delay(main.betChips.chipDelayFlyingTime)
        .call(() => {
            main.gameData.settlement.showStatus();
            dealerGetChips(main, lostBetItems);
        })
        .delay(main.betChips.chipDelayFlyingTime)
        .call(() => {
            payChipToLoginPlayerMiniGame(main, status, ownBets);
        })
        .start();
};

const payChipToLoginPlayerMiniGame = (main: any, statusData: any, ownBets: any) => {
    if (!statusData || !statusData.win) {
        return;
    }
    const betItems = statusData.winningByChoices;
    const betItemLowercaseObjectKeys = getLowercaseObjectKeys(betItems);
    const filteredItems = main.betItems.filter((item) => betItems[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]);

    filteredItems.forEach((item) => {
        const winBet = betItems[item.node.name] - ownBets[item.node.name];
        main.betChips.payChipsToWinningBetItemWithAmount(item.chipNode, main.dealerChipBox, winBet);
    });
};

export const collectChipsLost = (main: any, settlementResult: any) => {
    const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
    const lostBetItems = _.filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);

    lostBetItems.forEach((item) => {
        item.clearChips();
    });
};
