import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import MiniGameBase from "../view-models/MiniGameBase";

export const handleNotice = (gameBase: MiniGameBase) => (notice) => {
    const { errorCode, hedgeBetGroup, minBet, maxBet, gameRoundId, gameTypeId } = notice;
    const gameName = GameUtils.getGameNameString(gameTypeId);

    if (!gameRoundId || gameRoundId === gameBase.roundId) {
        const opt = { gameName, gameRoundId, errorCode, minBet: numberWithCommas(minBet), maxBet: numberWithCommas(maxBet) };

        if (hedgeBetGroup && hedgeBetGroup.length > 0) {
            hedgeBetGroup.forEach((choice, index) => {
                opt[`betChoice${index + 1}`] = gameBase.getBetChoiceString(choice);
            });
        }

        const text = NoticeUtil.getLocalizedErrorMessage(errorCode, opt);
        if (text) {
            gameBase.showMiniWarning(text);
        }
    }
};
