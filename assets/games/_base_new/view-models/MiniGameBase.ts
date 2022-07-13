import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { TotalBets } from "../../_new/_base/game-data-management/models/total-bets";
import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";
import { placeBetFailed, placeBetSuccess, placeOwnChip, updateOwnBets, updateTotalBets } from "../actions/BetAction";
import { handleNotice } from "../actions/NoticeAction";
import { startGameLoop, updateLockBet, updatePlacingBet, updateTimeOut, updateWaiting } from "../actions/TimeAction";
import { BetModel } from "../models/BetModel";
import { GameConfigs } from "../models/GameConfigs";
import GameDataManager from "../models/GameDataManager";
import NewGameData from "../models/NewGameData";
import { NoticeModel } from "../models/NoticeModel";
import { RoundHistory } from "../models/RoundHistory";
import { Settlement } from "../models/Settlement";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameBase extends NewMiniGameBase {
    readonly joinGameOnEnable = true;
    public gameData: NewGameData;

    onLoad() {
        super.onLoad();
        this.initGameData();
        this.initGameDataEvents();
    }

    override onEnable() {
        if (this.joinGameOnEnable) {
            this.startGame();
            this.registerViewGame();
        }
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
        // this.gameData.durations.on(Durations.Events.CHANGE_REMAINING_TIME, updateClockTime(this));

        this.gameData.durations.on(Durations.Events.TIMEOUT, updateTimeOut(this));
        this.gameData.durations.on(Durations.Events.LOCKING_BET, updateLockBet(this));
        this.gameData.durations.on(Durations.Events.PLACING_BET, updatePlacingBet(this));
        this.gameData.durations.on(Durations.Events.WAITING, updateWaiting(this));

        this.gameData.totalBets.on(TotalBets.Events.CHANGE, updateTotalBets(this));
        this.gameData.betModel.on(BetModel.Events.CHANGE_OWN_BET, updateOwnBets(this));
        this.gameData.betModel.on(BetModel.Events.CHANGE_OWN_CHIP, placeOwnChip(this));
        this.gameData.betModel.on(BetModel.Events.PLACE_BET_FAILED, placeBetFailed(this));
        this.gameData.betModel.on(BetModel.Events.PLACE_BET_SUCCESS, placeBetSuccess(this));

        this.gameData.gameConfigs.on(GameConfigs.Events.CHANGE, (gameConfigs) => this.setGameConfigs(gameConfigs));
        this.gameData.notice.on(NoticeModel.Events.CHANGE, handleNotice(this));
        this.gameData.roundHistory.on(RoundHistory.Events.CHANGE, (roundHistory) => {
            this.currentDataLogs = roundHistory;
            this.handleRoundHistory(roundHistory);
        });

        this.gameData.on(NewGameData.Events.CHANGE_ROUND_ID, (roundId) => this.setGameRound(roundId));
        this.gameData.durations.on(Durations.Events.BEGIN_PLACING_BET, () => {
            this.gameData.changeRoundId(this.gameData.roundHistory.lastRoundId + 1);
        });
        this.gameData.durations.on(Durations.Events.BEGIN_WAITING, () => {
            this.gameData.changeRoundId(this.gameData.roundHistory.lastRoundId);
        });

        this.gameData.settlement.on(Settlement.Events.SHOW_RESULT, (settlement) => this.showSettlementResult(settlement));
        this.gameData.settlement.on(Settlement.Events.END_SHOW_RESULT, (settlement) => this.handleAfterSettlementResult(settlement));
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
