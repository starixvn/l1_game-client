import { GameState } from "../../_base/GameState";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { TotalBets } from "../../_new/_base/game-data-management/models/total-bets";
import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { placeBetFailed, placeBetSuccess, placeOwnChip, updateOwnBets, updateTotalBets } from "../actions/BetAction";
import {
    changeGameRound,
    handleAfterSettlementResult,
    handleGameConfigs,
    handleMD5Data,
    handleNotice,
    handleRoundHistory,
    handleShowResult,
} from "../actions/CommonAction";
import {
    changeRoundId_BEGIN_PLACING_BET,
    changeRoundId_BEGIN_WAITING,
    startGameLoop,
    stopGameLoop,
    updateLockBet,
    updatePlacingBet,
    updateTimeOut,
    updateWaiting,
} from "../actions/TimeAction";
import { BetModel } from "../models/BetModel";
import { GameConfigs } from "../models/GameConfigs";
import GameDataManager from "../models/GameDataManager";
import NewGameData from "../models/NewGameData";
import { NoticeModel } from "../models/NoticeModel";
import { ResultHash } from "../models/ResultHash";
import { RoundHistory } from "../models/RoundHistory";
import { Settlement } from "../models/Settlement";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameBase extends NewMiniGameBase {
    protected joinGameOnEnable = true;
    protected clearGameDataOnDestroy = true;
    public gameData: NewGameData;

    onLoad() {
        super.onLoad();
        this.initGameData();
        this.initGameDataEvents();
    }

    override onEnable() {
        if (this.joinGameOnEnable) {
            this.joinGame();
        }
    }

    override onDestroy() {
        super.onDestroy();
        this.removeGameDataEvents();
        if (this.clearGameDataOnDestroy) {
            this.clearGameData();
        }
    }

    override onData(data: unknown) {
        if (this.gameState === GameState.Inactived) {
            return;
        }
        super.onData(data);
    }

    onGameHide() {
        super.onGameHide();
        this.gameState = GameState.Inactived;
        this.gameData.durations.stop();
        this.socket.disconnect();
    }

    onGameShow() {
        super.onGameShow();
        this.gameState = GameState.Actived;
        this.socket.connect();
        this.joinGame();
    }

    onDisconnected() {
        //override to prevent delele socket
        this.sendRetryMessage();
        this.showProcessingWarning(false);
        this.md5Component && this.md5Component.resetMd5();
    }

    clearGameData() {
        GameDataManager.getInstance().clearGameData(this.gameId);
    }

    joinGame() {
        this.startGame();
        this.registerViewGame();
    }

    override initHandlers() {
        this.umHandler = null;
        this.noticeHandler = null;
        this.statusHandler = null;
        this.betHandler = null;
        this.timeHandler = null;
        this.errorHandler = null;
        this.logsHandler = null;
        this.finishHandler = null;
        this.configsHandler = null;
        this.md5Handler = null;
    }

    createGameData(): GameData {
        return new NewGameData();
    }

    initGameData() {
        const dataManager = GameDataManager.getInstance();
        let gameData = dataManager.getGameData(this.gameId);
        if (!gameData) {
            gameData = this.createGameData();
            dataManager.setGameData(this.gameId, gameData);
        }

        this.gameData = gameData;
    }

    initGameDataEvents() {
        this.gameData.durations.initialize({
            wholeRound: this.config.fullTime,
            placingBet: this.config.betTime,
            lockingBet: this.config.stopBetTime
        });

        this.gameData.durations.on(Durations.Events.START_GAME_LOOP, startGameLoop(this));
        this.gameData.durations.on(Durations.Events.STOP_GAME_LOOP, stopGameLoop(this));
        this.gameData.durations.on(Durations.Events.TIMEOUT, updateTimeOut(this));
        this.gameData.durations.on(Durations.Events.LOCKING_BET, updateLockBet(this));
        this.gameData.durations.on(Durations.Events.PLACING_BET, updatePlacingBet(this));
        this.gameData.durations.on(Durations.Events.WAITING, updateWaiting(this));
        this.gameData.durations.on(Durations.Events.BEGIN_PLACING_BET, changeRoundId_BEGIN_PLACING_BET(this));
        this.gameData.durations.on(Durations.Events.BEGIN_WAITING, changeRoundId_BEGIN_WAITING(this));

        this.gameData.totalBets.on(TotalBets.Events.CHANGE, updateTotalBets(this));
        this.gameData.betModel.on(BetModel.Events.CHANGE_OWN_BET, updateOwnBets(this));
        this.gameData.betModel.on(BetModel.Events.CHANGE_OWN_CHIP, placeOwnChip(this));
        this.gameData.betModel.on(BetModel.Events.PLACE_BET_FAILED, placeBetFailed(this));
        this.gameData.betModel.on(BetModel.Events.PLACE_BET_SUCCESS, placeBetSuccess(this));

        this.gameData.gameConfigs.on(GameConfigs.Events.CHANGE, handleGameConfigs(this));
        this.gameData.notice.on(NoticeModel.Events.CHANGE, handleNotice(this));
        this.gameData.roundHistory.on(RoundHistory.Events.CHANGE, handleRoundHistory(this));
        this.gameData.on(NewGameData.Events.CHANGE_ROUND_ID, changeGameRound(this));
        this.gameData.resultHash.on(ResultHash.Events.CHANGE, handleMD5Data(this));
        this.gameData.settlement.on(Settlement.Events.SHOW_RESULT, handleShowResult(this));
        this.gameData.settlement.on(Settlement.Events.END_SHOW_RESULT, handleAfterSettlementResult(this));
    }

    removeGameDataEvents() {
        this.gameData.durations.off(Durations.Events.START_GAME_LOOP, startGameLoop(this));
        this.gameData.durations.off(Durations.Events.TIMEOUT, updateTimeOut(this));
        this.gameData.durations.off(Durations.Events.LOCKING_BET, updateLockBet(this));
        this.gameData.durations.off(Durations.Events.PLACING_BET, updatePlacingBet(this));
        this.gameData.durations.off(Durations.Events.WAITING, updateWaiting(this));
        this.gameData.durations.off(Durations.Events.BEGIN_PLACING_BET, changeRoundId_BEGIN_PLACING_BET(this));
        this.gameData.durations.off(Durations.Events.BEGIN_WAITING, changeRoundId_BEGIN_WAITING(this));

        this.gameData.totalBets.off(TotalBets.Events.CHANGE, updateTotalBets(this));
        this.gameData.betModel.off(BetModel.Events.CHANGE_OWN_BET, updateOwnBets(this));
        this.gameData.betModel.off(BetModel.Events.CHANGE_OWN_CHIP, placeOwnChip(this));
        this.gameData.betModel.off(BetModel.Events.PLACE_BET_FAILED, placeBetFailed(this));
        this.gameData.betModel.off(BetModel.Events.PLACE_BET_SUCCESS, placeBetSuccess(this));

        this.gameData.gameConfigs.off(GameConfigs.Events.CHANGE, handleGameConfigs(this));
        this.gameData.notice.off(NoticeModel.Events.CHANGE, handleNotice(this));
        this.gameData.roundHistory.off(RoundHistory.Events.CHANGE, handleRoundHistory(this));
        this.gameData.off(NewGameData.Events.CHANGE_ROUND_ID, changeGameRound(this));
        this.gameData.resultHash.off(ResultHash.Events.CHANGE, handleMD5Data(this));
        this.gameData.settlement.off(Settlement.Events.SHOW_RESULT, handleShowResult(this));
        this.gameData.settlement.off(Settlement.Events.END_SHOW_RESULT, handleAfterSettlementResult(this));
    }

    /**
     * Show settlement result, must call gameData.settlement.finishShowResult at the end
     */
    showSettlementResult(settlement: any) {
        this.gameData.settlement.finishShowResult();
    }

    /**
     * Handling after showing settlement result
     */
    handleAfterSettlementResult(settlement: any) {
        this.gameData.roundHistory.add(settlement);
        this.showWaittingTime(true);
    }

    /**
     * Handle round history
     */
    handleRoundHistory(roundHistory: any) {
        console.log(`each game must override for handle round history`, roundHistory);
    }
}
