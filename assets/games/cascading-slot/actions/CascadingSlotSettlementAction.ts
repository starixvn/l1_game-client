import { CascadingSlotFinishData } from "../models/CascadingSlotFinishModel";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { ConfigDurationEnum } from "../view-models/CascadingSlotBaseConfig";
import { convertBoardValue, convertStringToArray } from "../view-models/CascadingSlotUtils";

export const handleSettle = (mainGame: CascadingSlotBase) => async (data: CascadingSlotFinishData) => {
    const convertData = (value: string) => {
        return convertBoardValue(convertStringToArray(value));
    };

    const result = convertData(data.result);
    await mainGame.board.spinResult(result);

    let i = 0;
    const tumbles = data.tumbles;
    const highlightWinItemsDuration = mainGame.getCustomDuration(ConfigDurationEnum.highlightWinItemsDuration);
    while (i < tumbles.length) {
        const settlement = tumbles[i].settlement;
        const explode = convertData(settlement.explode);
        const newItems = convertData(settlement.new);

        // await GameUtils.delayTime(highlightWinItemsDuration);
        await mainGame.board.removeItems(explode);
        mainGame.board.addItems(newItems);
        await mainGame.board.fallIn();

        i++;
    }

    // handle big win

    //handle freeSpins here

    //handle auto spin next
};
