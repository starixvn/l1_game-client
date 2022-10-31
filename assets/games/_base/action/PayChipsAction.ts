import * as _ from "lodash";

import GameUtils from "../../../common/GameUtils";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import BetItem from "../view-models/BetItem";
import WebSocketTableGameBase from "../WebSocketTableGameBase";

export interface PayChipInfo {
    mainRoomGame: WebSocketTableGameBase;
    winBetItems: BetItem[];
    winningPlayers: any;
    winningDuration: number;
    payChipsDuration: number;
    statusData: any;
}

export const payChips = (
    main: any,
    settlementResult: any,
    winningPlayers: any,
    payChipFlyTime: number,
    winningAnimationDuration: number
) => {
    const mainRoomGame = main as WebSocketTableGameBase;
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
        statusData: mainRoomGame.getCurrentStatusData()
    };
    if (!main.node.activeInHierarchy) {
        dealerGetChips(mainRoomGame, lostBetItems);
        dealerPayChips(mainRoomGame, winBetItems);
        mainRoomGame.payChipToAllPlayers(payChipInfo);
    } else {
        main.node.runAction(
            cc.sequence(
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => dealerGetChips(mainRoomGame, lostBetItems)),
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => dealerPayChips(mainRoomGame, winBetItems)),
                cc.delayTime(main.betChips.chipDelayFlyingTime),
                cc.callFunc(() => {
                    mainRoomGame.payChipToAllPlayers(payChipInfo);
                })
            )
        );
    }
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

export const payChipsToLoginPlayer = (info: PayChipInfo, isOtherPlayers = true) => {
    const { statusData } = info;
    if (!statusData || !statusData.win) {
        return;
    }

    const winningByChoices = statusData.winningByChoices;
    if (isOtherPlayers) {
        moveChipWithRandomAmountToLoginPlayer(info, winningByChoices);
    } else {
        moveChipWithAmountToLoginPlayer(info, winningByChoices);
    }
};

export const showPayoutForLoginPlayer = (info: PayChipInfo) => {
    const { mainRoomGame, statusData, winningDuration } = info;
    if (!statusData || !statusData.win) {
        return;
    }
    mainRoomGame.showWinningBet(statusData.bet);
    const playerNode = mainRoomGame.userProfile?.userAvatar?.node?.parent;
    playerNode && playWinningEffect(mainRoomGame, playerNode, winningDuration);
    mainRoomGame.updateUserBalance();
};

const moveChipWithRandomAmountToLoginPlayer = (info: PayChipInfo, winningByChoices) => {
    const { mainRoomGame, winBetItems, payChipsDuration } = info;
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    _.forEach(winBetItems, (item) => {
        if (winningByChoices[item.node.name.toLowerCase()]) {
            mainRoomGame.betChips.moveChipsWithRandomAmount(item.chipNode, destNode, payChipsDuration);
        }
    });
};

const moveChipWithAmountToLoginPlayer = (info: PayChipInfo, winningByChoices) => {
    const { mainRoomGame, winBetItems } = info;
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    const betItemLowercaseObjectKeys = getLowercaseObjectKeys(winningByChoices);
    _.forEach(winBetItems, (item) => {
        if (winningByChoices[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]) {
            mainRoomGame.betChips.moveChips(item.chipNode, destNode);
        }
    });
};

export const payChipsToOtherPlayers = (info: PayChipInfo) => {
    const { mainRoomGame, winBetItems } = info;
    if (!mainRoomGame.otherPlayers) {
        return;
    }

    _.forEach(winBetItems, (item) => {
        mainRoomGame.betChips.moveChips(item.chipNode, mainRoomGame.otherPlayers);
    });
};

export const payChipsToInGamePlayers = (info: PayChipInfo) => {
    const { winningPlayers, mainRoomGame, winBetItems, payChipsDuration, winningDuration } = info;
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
                    mainRoomGame.betChips.moveChipsWithRandomAmount(item.chipNode, playerSlot.avatar.node, payChipsDuration);
                }
            });

            playerSlot.increaseBalance(winningPlayerData.bet);
            const convertValue = GameUtils.getValueByCurrency(bet, winningPlayerData.rate || 1);
            GameUtils.addFlyingText(playerSlot.node, true, convertValue, winningDuration, 0, 10);
            playWinningEffect(mainRoomGame, playerSlot.node, winningDuration);
        }
    });
};

export const playWinningEffect = (mainRoomGame: any, playerNode: cc.Node, duration: number) => {
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
