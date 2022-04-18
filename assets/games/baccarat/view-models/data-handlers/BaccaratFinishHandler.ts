import * as i18n from "i18n/runtime-scripts/LanguageData";
import * as _ from "lodash";

import { getLowercaseObjectKeys } from "../../../../common/helpers/ObjectHelper";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Baccarat from "../Baccarat";
import BaccaratLogsHandler from "./BaccaratLogsHandler";
import WebSocketTableGameBase from "../../../_base/WebSocketTableGameBase";

export default class BaccaratFinishHandler extends GameBaseFinishHandler {
    handle(data: any): boolean {
        if (data.finish) {
            this.main.finishShowResult = false;
            this.main.node.activeInHierarchy && this.main.gameAudios.playEndGameAudio();
            this.setNewGameRound(data);
            const mainRoomGame = this.main as WebSocketTableGameBase;
            if (mainRoomGame && mainRoomGame.playerHandler) {
                this.updateOtherPlayerBalance(data.finish.winningPlayers, mainRoomGame);
            }
            this.handleFinishData(data.finish, data.resultHash, () => {
                this.payChips(data.finish.settlementResult, data.finish.winningPlayers);
                this.main.finishShowResult = true;
            });
        }

        return true;
    }

    handleFinishData(dataFinish: any, dataResultHash: any, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);

        const baccaratMain = this.getOwnMain();
        if (!dataFinish.result) {
            return;
        }

        this.showCards(dataFinish, dataResultHash, baccaratMain, onFinishHandlingData);
    }

    protected getOwnMain(): any {
        return this.main as Baccarat;
    }

    protected showCards(dataFinish: any, dataResultHash: any, baccaratMain: any, onFinishHandlingData: () => void) {
        baccaratMain.showScoreBoardNextDot = true;
        const result = dataFinish.result;
        const settlementResult = dataFinish.settlementResult;
        const playerCards = this.getDataFollowTypePlayer(result, false);
        const bankerCards = this.getDataFollowTypePlayer(result, true);
        const showResultFunc = () => {
            baccaratMain.showScoreBoardNextDot = false;
            this.main.md5Component && this.main.md5Component.updateMD5String(dataResultHash);
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

    protected handleBuildMiniLogs(baccaratMain: any) {
        // nothing
    }

    public showResult(resultData, isAnimated = true): void {
        const keys = getLowercaseObjectKeys(resultData);

        _.forEach(this.main.betItems, (item) => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]], isAnimated));
    }

    public showWinNotice(result) {
        const baccaratMain = this.getOwnMain();
        const winNoticeNode = baccaratMain.winNoticeLabel.node.parent;
        let key = "";

        if (result.banker) {
            key = "banker_win";
            baccaratMain.bankerCards.showHighlightCards();
        } else if (result.player) {
            key = "player_win";
            baccaratMain.playerCards.showHighlightCards();
        } else {
            key = "tie_win";
        }

        baccaratMain.winNoticeLabel.string = i18n.t(`ui.${key}`).toUpperCase();
        winNoticeNode.active = true;
    }
}
