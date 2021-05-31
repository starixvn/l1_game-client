import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseNoticeHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any): boolean {
        if (!data.notice) {
            return false;
        }

        const notice = data.notice;
        const errorCode = data.notice.errorCode;
        const gameName = GameUtils.getGameNameString(notice.gameTypeId);
        const { minBet, maxBet, gameRoundId } = notice;
        const opt = { gameName, gameRoundId, minBet: numberWithCommas(minBet), maxBet: numberWithCommas(maxBet) };
        const text = NoticeUtil.getLocalizedErrorMessage(errorCode, opt);
        if (text) {
            this.main.showMiniWarning(text);
        }
        return true;
    }
}
