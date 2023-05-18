import { lodash } from "../ClientModules";
import NotificationService from "../common/auth/NotificationService";
import EventEmitterBase from "../common/emitter/EventEmitterBase";
import { uiManager } from "./GameUIManager";
import { InternalEvents } from "./InternalEvents";

export const JackpotDataKey = {
    JACKPOT_WINNER: "jackpotWinner",
    JACKPOT_WINNERS: "jackpotWinners",
    JACKPOT_POOLS: "jackpotPools",
    JACKPOT_POOLS_ON_GAME: "jackpotPoolsOnGame"
};

export const JackpotEvents = {
    GET_POOLS: "getPools",
    GET_WINNERS: "getWinners"
};

export default class JackpotManager {
    private static instance: JackpotManager;
    public emitter: EventEmitterBase;

    public events = {};

    public static getInstance(): JackpotManager {
        if (!this.instance) {
            this.instance = new JackpotManager();
            this.instance.initEmitter();
        }

        return this.instance;
    }

    initEmitter() {
        this.emitter = new EventEmitterBase();
    }

    // getJackpotDataWithGameId(data, gameId) {
    //     const formattingData = lodash.groupBy(data, "gameId");
    //     return formattingData[gameId];
    // }

    getJackpotDataWithPools(data) {}

    emitEvent(eventName: string, data: any) {
        NotificationService.getInstance().emitEvent(eventName, data);
    }

    addDataObserver(dataType: string, dataKey: string) {
        let callback;
        switch (dataType) {
            case JackpotDataKey.JACKPOT_POOLS:
                callback = (data) => this.onReceivedJackpotPoolsData(data);
                break;
            case JackpotDataKey.JACKPOT_POOLS_ON_GAME:
                callback = (data) => this.onReceivedJackpotPoolsOnGameData(data);
                break;
            case JackpotDataKey.JACKPOT_WINNER:
                callback = (data) => this.onReceivedJackpotWinnerData(data);
                break;
            case JackpotDataKey.JACKPOT_WINNERS:
                callback = (data) => this.onReceivedJackpotWinnersData(data);
                break;
        }
        NotificationService.getInstance().addDataObserver(dataType, dataKey, callback);
    }

    onReceivedJackpotPoolsData(data: any) {
        const sortedData = data.sort((a, b) => b.amount - a.amount);
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_POOLS, lodash.groupBy(sortedData, "pool"));
    }

    onReceivedJackpotPoolsOnGameData(data: any) {
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_POOLS_ON_GAME, lodash.groupBy(data, "gameId"));
    }

    onReceivedJackpotWinnerData(data: any) {
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_WINNER, data);
    }

    onReceivedJackpotWinnersData(data: any) {
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_WINNERS, data);
    }

    removeDataObserver(dataType: string, dataKey: string) {
        NotificationService.getInstance().removeDataObserver(dataType, dataKey);
    }
}

export const jackpotManager = JackpotManager.getInstance();
