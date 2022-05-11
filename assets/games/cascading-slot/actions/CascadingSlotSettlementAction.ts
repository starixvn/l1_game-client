import { CascadingSlotFinishData, WinIconDetail } from "../models/CascadingSlotFinishModel";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { convertBoardValue, convertStringToArray } from "../view-models/CascadingSlotUtils";

export const handleSettle = (mainGame: CascadingSlotBase) => async (data: CascadingSlotFinishData) => {
    const convertData = (value: string) => {
        return convertBoardValue(convertStringToArray(value));
    };

    const result = convertData(data.result);
    await mainGame.board.spinResult(result);

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
        mainGame.board.addItems(newItems);
        await mainGame.board.fallIn();

        i++;
    }

    // if isFreeSpin add total multiplier
    // increase Multiplier

    // show effect big win

    // show effect freeSpins here

    // handle auto spin next
};
