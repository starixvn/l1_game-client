import { lodash } from "../ClientModules";
import NotificationService from "../common/auth/NotificationService";

export const JackpotDataKey = {
    JACKPOT_WINNER: "jackpotWinner",
    JACKPOT_WINNERS: "jackpotWinners",
    JACKPOT_POOLS: "jackpotPools"
};

export const JackpotEvents = {
    GET_POOLS: "getPools",
    GET_WINNERS: "getWinners"
};

export default class JackpotManager {
    private static instance: JackpotManager;

    public static getInstance(): JackpotManager {
        if (!this.instance) {
            this.instance = new JackpotManager();
        }

        return this.instance;
    }

    getJackpotDataWithGameId(data, gameId) {
        const formattingData = lodash.groupBy(data, "gameId");
        return formattingData[gameId];
    }

    getJackpotDataWithPools(data) {
        const sortedData = data.sort((a, b) => b.amount - a.amount);
        return lodash.groupBy(sortedData, "pool");
    }

    emitEvent(eventName: string, data: any) {
        NotificationService.getInstance().emitEvent(eventName, data);
    }

    addDataObserver(dataType: string, dataKey: string, callback: (param?) => void) {
        NotificationService.getInstance().addDataObserver(dataType, dataKey, callback);
    }

    removeDataObserver(dataType: string, dataKey: string) {
        NotificationService.getInstance().removeDataObserver(dataType, dataKey);
    }
}

export const jackpotManager = JackpotManager.getInstance();
