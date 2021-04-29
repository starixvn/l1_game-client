import * as _ from "lodash";

import { getLowercaseObjectKeys } from "../../../../common/helpers/ObjectHelper";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Baccarat from "../Baccarat";
import BaccaratLogsHandler from "./BaccaratLogsHandler";

export default class BaccaratFinishHandler extends GameBaseFinishHandler {
    handleFinishData(dataFinish: any, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);

        const baccaratMain = this.getOwnMain();
        if (!dataFinish.result) {
            return;
        }

        this.showCards(dataFinish, baccaratMain, onFinishHandlingData);
    }

    protected getOwnMain(): any {
        return this.main as Baccarat;
    }

    protected showCards(dataFinish: any, baccaratMain: any, onFinishHandlingData: () => void) {
        baccaratMain.showScoreBoardNextDot = true;
        const result = dataFinish.result;
        const settlementResult = dataFinish.settlementResult;
        const playerCards = this.getDataFollowTypePlayer(result, false);
        const bankerCards = this.getDataFollowTypePlayer(result, true);
        const showResultFunc = () => {
            baccaratMain.showScoreBoardNextDot = false;
            this.showResult(settlementResult);
            this.showWinNotice(settlementResult);
            onFinishHandlingData && onFinishHandlingData();
            this.insertCurrentDataLogs(baccaratMain, dataFinish);
            baccaratMain.currentDataLogs.length > 102 && this.main.currentDataLogs.pop();
            (baccaratMain.logsHandler as BaccaratLogsHandler).buildLogs(baccaratMain.currentDataLogs);
            this.handleBuildMiniLogs(baccaratMain);
        };

        baccaratMain.playerCards.showCards(playerCards, bankerCards.length === 3 ? null : showResultFunc);
        baccaratMain.bankerCards.showCards(bankerCards, bankerCards.length === 3 ? showResultFunc : null, playerCards.length === 3);
    }

    protected getDataFollowTypePlayer(data: any, isBanker: boolean) {
        if (isBanker) {
            return Object.values(data.banker).filter((value) => value != null);
        }
        return Object.values(data.player).filter((value) => value != null);
    }

    protected insertCurrentDataLogs(baccaratMain: any, dataFinish: any) {
        if (dataFinish.winningPlayers) {
            delete dataFinish.winningPlayers;
        }

        baccaratMain.currentDataLogs.unshift(dataFinish);
    }

    protected handleBuildMiniLogs(baccaratMain: any) {}

    public showResult(resultData, isAnimated = true): void {
        const keys = getLowercaseObjectKeys(resultData);

        _.forEach(this.main.betItems, (item) => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]], isAnimated));
    }

    public showWinNotice(result) {
        const baccaratMain = this.getOwnMain();
        const winNoticeNode = baccaratMain.winNoticeLabel.node.parent;
        let noticeText: string;

        if (result.banker) {
            noticeText = "NHÀ CÁI THẮNG!";
            baccaratMain.bankerCards.showHighlightCards();
        } else if (result.player) {
            noticeText = "NHÀ CON THẮNG!";
            baccaratMain.playerCards.showHighlightCards();
        } else {
            noticeText = "HÒA!";
        }

        baccaratMain.winNoticeLabel.string = noticeText;
        winNoticeNode.active = true;
    }
}
