import _ = require("lodash");

import { CascadingSlotFinishData, WinIconDetail } from "../models/CascadingSlotFinishModel";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { convertBoardValue, convertStringToArray } from "../view-models/CascadingSlotUtils";
import MultiplierItem from "../view-models/MultiplierItem";

export const handleSettle = (mainGame: CascadingSlotBase) => async (data: CascadingSlotFinishData) => {
    const { bigWin, roundId, totalOfFreeSpins, freeSpins, isFreeSpin, totalMultiplier } = data;
    mainGame.setGameRound(roundId);

    const convertData = (value: string) => {
        return convertBoardValue(convertStringToArray(value));
    };

    const result = convertData(data.result);
    const multiplier = _.cloneDeep(data.m);
    await mainGame.board.spinResult(result, multiplier);

    let i = 0;
    const tumbles = data.tumbles;
    while (i < tumbles.length) {
        const tumble = tumbles[i];
        const settlement = tumble.settlement;
        const explode = convertData(settlement.explode);
        const newItems = convertData(settlement.new);

        if (tumble.win > 0) {
            Object.keys(tumble.icons).forEach((iconKey) => {
                const winIconDetail: WinIconDetail = tumble.icons[iconKey];
                const node = mainGame.board.getRandomWinItem(explode, +iconKey);
                const position = mainGame.effectContainer.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v3(0, 0)));
                mainGame.createFlyWinLabel(mainGame.effectContainer, position, winIconDetail.win);
            });
            mainGame.gameData.uiModel.increaseTumbleWin(tumble.win);
            mainGame.gameData.uiModel.increaseTotalWin(tumble.win);
        }

        await mainGame.board.removeItems(explode);
        mainGame.board.addItems(newItems, multiplier);
        await mainGame.board.fallIn();

        i++;
    }

    if (isFreeSpin) {
        const currentTotalMultiplier = mainGame.gameData.uiModel.totalMultiplier;
        if (currentTotalMultiplier > 0) {
            await movingMultiplier(
                mainGame.totalMultiplierView.total.node,
                mainGame.effectContainer,
                mainGame.tumbleWinView.multiplier.node
            );
            mainGame.gameData.uiModel.increaseMultiplier(currentTotalMultiplier);
        }
    }

    if (data.m.length > 0) {
        const items = mainGame.board.getItems();
        const multiplierItems = items.flatMap((item) => {
            const comp = item.content.children[0].getComponent(MultiplierItem);
            return comp ? [comp] : [];
        });
        for (const mItem of multiplierItems) {
            mItem.hideMultiplier();
            await movingMultiplier(mItem.value.node, mainGame.effectContainer, mainGame.tumbleWinView.multiplier.node);
            mainGame.gameData.uiModel.increaseMultiplier(mItem.multiplier);
        }

        if (isFreeSpin) {
            mainGame.gameData.uiModel.changeTotalMultiplier(totalMultiplier);
        }
    }

    if (bigWin) {
        await mainGame.showEffectBigWin(data.win);
    }

    if (freeSpins > 0) {
        await mainGame.showEffectFreeSpins(freeSpins);
    }

    if (!mainGame.showNoticeForCacheApiError()) {
        if ((mainGame.isAutoSpinMode() && mainGame.stillAutoSpin()) || mainGame.isFreeSpin()) {
            mainGame.spin();
        }
    }
};

const movingMultiplier = (multiplierNode: cc.Node, container: cc.Node, destNode: cc.Node) => {
    return new Promise<void>((resolve) => {
        const node = cc.instantiate(multiplierNode);
        node.active = true;
        const startPos = container.convertToNodeSpaceAR(multiplierNode.convertToWorldSpaceAR(cc.v3(0)));
        const destPos = container.convertToNodeSpaceAR(destNode.convertToWorldSpaceAR(cc.v3(0)));
        container.addChild(node);
        node.position = startPos;

        const distance = startPos.sub(destPos).mag();
        const pixelPerSecond = 500;
        const duration = distance / pixelPerSecond;
        cc.tween(node)
            .to(duration, { position: destPos }, { easing: "sineOut" })
            .call(() => {
                resolve();
                node.destroy();
            })
            .start();
        cc.tween(node)
            .to(duration * 0.5, { scale: 1.1 })
            .to(duration * 0.5, { scale: 1 })
            .start();
    });
};
