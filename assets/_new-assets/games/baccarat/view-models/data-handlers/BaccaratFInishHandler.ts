import Baccarat from "../Baccarat";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import * as _ from "lodash";
import BaccaratLogsHandler from "./BaccaratLogsHandler";
import { getLowercaseObjectKeys } from '../../../../common/helpers/Helper.js';

export default class BaccaratFinishHandler extends GameBaseFinishHandler {
    handleFinishData(dataFinish: any, onFinishHanlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHanlingData);

        var baccaratMain = this.main as Baccarat;

        if (!dataFinish.result) {
            return;
        }

        this.showCards(dataFinish, baccaratMain, onFinishHanlingData);

    }

    private showCards(dataFinish: any, baccaratMain: Baccarat, onFinishHanlingData: () => void) {
        const result = dataFinish.result;
        const settlementResult = dataFinish.settlementResult;
        const playerCards = result.playerCards;
        const bankerCards = result.bankerCards;
        const showResultFunc = () => {
            this.showResult(settlementResult);
            onFinishHanlingData && onFinishHanlingData();
            baccaratMain.currentDataLogs.unshift({ result: dataFinish.settlementResult });
            baccaratMain.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
            (baccaratMain.logsHandler as BaccaratLogsHandler).buildLogs(baccaratMain.currentDataLogs);
        }
        baccaratMain.playerCards.showCards(playerCards, bankerCards.length == 3 ? null : showResultFunc);
        baccaratMain.bankerCards.showCards(bankerCards, bankerCards.length == 3 ? showResultFunc : null);
    }

    private showResult(resultData) {
        const keys = getLowercaseObjectKeys(resultData);

        _.forEach(this.main.betItems, item => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]]));
    }
}
