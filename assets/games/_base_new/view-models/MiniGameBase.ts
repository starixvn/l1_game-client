import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { GameState } from "../../_base/GameState";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { TotalBets } from "../../_new/_base/game-data-management/models/total-bets";
import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { changeBetPercentage, placeBetFailed, placeBetSuccess, placeOwnChip, updateOwnBets, updateTotalBets } from "../actions/BetAction";
import {
    changeGameRound,
    checkToOffUM,
    handleAfterSettlementResult,
    handleFirstLoadRoundHistory,
    handleGameConfigs,
    handleMD5Data,
    handleNotice,
    handleRoundHistory,
    handleShowResult,
    handleShowStatus,
    onUM,
} from "../actions/CommonAction";
import {
    showCurrentRoundId,
    showNextRoundId,
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
import { UMModel } from "../models/UMModel";

const { ccclass, property } = cc._decorator;

interface EmitterStorage {
    emitter: EventEmitterBase;
    eventName: string;
    listener: (param?: any) => void;
}

@ccclass
export default class MiniGameBase extends NewMiniGameBase {
    @property({ type: cc.Label })
    betPercentage: cc.Label[] = [];

    protected managedByContainer = false;
    public gameData: NewGameData;
    emitterStorages: EmitterStorage[] = [];

    override onLoad() {
        super.onLoad();
        this.initGameData();
        this.initGameDataEvents();
    }

    override onEnable() {
        this.grantSocket();
        this.initSocketListenter();
        this.startGame();
        if (!this.managedByContainer) {
            this.registerViewGame();
        }
    }

    override onDestroy() {
        super.onDestroy();

        this.removeGameDataEvents();
        if (!this.managedByContainer) {
            GameDataManager.getInstance().clearGameLoop(this.gameId);
            this.clearGameData();
        }
    }

    cleanGame() {
        GameDataManager.getInstance().clearGameLoop(this.gameId);
        this.socketIOController.closeSocket(this.gameId);
        this.showProcessingWarning(false);
        this.md5Component && this.md5Component.resetMd5();
    }

    override closeGame() {
        this.playClick();
        this.cleanGame();
        this.node.active = false;
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
        //override to prevent delete socket
        this.sendRetryMessage();
        this.showProcessingWarning(false);
        this.md5Component && this.md5Component.resetMd5();
    }

    clearGameData() {
        GameDataManager.getInstance().clearGameData(this.gameId);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.betPercentage.forEach((label) => (label.string = `0%`));
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

    emitterListener(emitter: EventEmitterBase, eventName: string, listener: (param: any) => any) {
        const storage = {
            emitter,
            eventName,
            listener: listener(this)
        };
        emitter.addListener(eventName, storage.listener);
        this.emitterStorages.push(storage);
    }

    initGameDataEvents() {
        this.gameData.durations.initialize({
            wholeRound: this.config.fullTime,
            placingBet: this.config.betTime,
            lockingBet: this.config.stopBetTime
        });

        this.emitterListener(this.gameData.umModel, UMModel.Events.ON_UM, onUM);
        this.emitterListener(this.gameData.umModel, UMModel.Events.CHECK_OFF_UM, checkToOffUM);

        this.emitterListener(this.gameData.durations, Durations.Events.START_GAME_LOOP, startGameLoop);
        this.emitterListener(this.gameData.durations, Durations.Events.STOP_GAME_LOOP, stopGameLoop);
        this.emitterListener(this.gameData.durations, Durations.Events.TIMEOUT, updateTimeOut);
        this.emitterListener(this.gameData.durations, Durations.Events.LOCKING_BET, updateLockBet);
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, updatePlacingBet);
        this.emitterListener(this.gameData.durations, Durations.Events.WAITING, updateWaiting);
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, showCurrentRoundId);
        this.emitterListener(this.gameData.durations, Durations.Events.WAITING, showNextRoundId);

        this.emitterListener(this.gameData.totalBets, TotalBets.Events.CHANGE, updateTotalBets);
        this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_OWN_BET, updateOwnBets);
        this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_OWN_CHIP, placeOwnChip);
        this.emitterListener(this.gameData.betModel, BetModel.Events.PLACE_BET_FAILED, placeBetFailed);
        this.emitterListener(this.gameData.betModel, BetModel.Events.PLACE_BET_SUCCESS, placeBetSuccess);
        this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_BET_PERCENTAGE, changeBetPercentage);

        this.emitterListener(this.gameData.gameConfigs, GameConfigs.Events.CHANGE, handleGameConfigs);
        this.emitterListener(this.gameData.notice, NoticeModel.Events.CHANGE, handleNotice);
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.FIRST_LOAD, handleFirstLoadRoundHistory);
        this.emitterListener(this.gameData.roundHistory, RoundHistory.Events.CHANGE, handleRoundHistory);

        this.emitterListener(this.gameData, NewGameData.Events.CHANGE_ROUND_ID, changeGameRound);
        this.emitterListener(this.gameData.resultHash, ResultHash.Events.CHANGE, handleMD5Data);
        this.emitterListener(this.gameData.settlement, Settlement.Events.SHOW_STATUS, handleShowStatus);
        this.emitterListener(this.gameData.settlement, Settlement.Events.SHOW_RESULT, handleShowResult);
        this.emitterListener(this.gameData.settlement, Settlement.Events.END_SHOW_RESULT, handleAfterSettlementResult);
    }

    checkShowUmMessage(data: any) {
        if (this.currentTimeRemaining === undefined && data.remainingTime === undefined) {
            return true;
        }
        return (
            this.currentTimeRemaining <= this.config.betTime ||
            this.currentTimeRemaining === this.config.fullTime ||
            data.remainingTime === this.config.fullTime
        );
    }

    removeGameDataEvents() {
        this.emitterStorages.forEach((item) => {
            const { emitter, eventName, listener } = item;
            emitter.removeListener(eventName, listener);
        });
        this.emitterStorages = [];
    }

    /**
     * Show settlement result, must call gameData.settlement.finishShowResult at the end
     */
    showSettlementResult(settlement: any) {
        this.gameData.settlement.finishShowResult(settlement, true);
    }

    /**
     * Handling after showing settlement result
     */
    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.gameData.roundHistory.update();
        this.showWaittingTime(true);
        this.gameData.resultHash.updateUI();
        this.gameData.settlement.showStatus();
    }

    /**
     * Handle round history
     */
    handleRoundHistory(roundHistory: any) {
        console.log(`each game must override for handle round history`, roundHistory);
    }

    showStatus(status: any) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }

        const { win, bet } = status;

        if (win) {
            this.showWinningBet(bet);
            this.updateUserBalance();
        }
    }
}
