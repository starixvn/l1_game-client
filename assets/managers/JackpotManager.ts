import { lodash } from "../ClientModules";
import NotificationService from "../common/auth/NotificationService";
import { userManager } from "../common/user/UserManager";
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

export enum JackpotPoolType {
    MINOR = 0,
    MAJOR,
    GRAND
}

export default class JackpotManager {
    private static instance: JackpotManager;
    public events = {};
    private readonly jackpotDataKey = [
        JackpotDataKey.JACKPOT_POOLS,
        JackpotDataKey.JACKPOT_POOLS_ON_GAME,
        JackpotDataKey.JACKPOT_WINNER,
        JackpotDataKey.JACKPOT_WINNERS
    ];

    public static getInstance(): JackpotManager {
        if (!this.instance) {
            this.instance = new JackpotManager();
        }

        return this.instance;
    }

    emitEvent(eventName: string, data: any) {
        NotificationService.getInstance().emitEvent(eventName, data);
    }

    initEvents() {
        this.jackpotDataKey.forEach((key) => {
            this.addDataObserver(key, key);
        });
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
        let pools = lodash.groupBy(data, "gameId");
        pools = this.filterOfferGames(pools);
        pools = this.sortPoolsASC(pools);
        const poolsGroup = this.groupJackpotPoolsWithType(pools);
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_POOLS, poolsGroup);
        uiManager.emitter.emit(InternalEvents.RECEIVED_RAW_JACKPOT_POOLS, data);
    }

    filterOfferGames(pools) {
        Object.keys(pools).forEach((gameId) => {
            if (!userManager.offerGames.includes(+gameId)) {
                delete pools[gameId];
            }
        });

        return pools;
    }

    sortPoolsASC(pools) {
        Object.values(pools).forEach((pool: any) => {
            pool.sort((a, b) => a.amount - b.amount);
        });

        return pools;
    }

    groupJackpotPoolsWithType(pools) {
        const poolsGroup = {
            [JackpotPoolType.MINOR]: [],
            [JackpotPoolType.MAJOR]: [],
            [JackpotPoolType.GRAND]: []
        };

        Object.values(pools).forEach((gamePool: any) => {
            gamePool.forEach((poolItem, index) => {
                poolsGroup[index].push(poolItem);
            });
        });

        Object.values(poolsGroup).forEach((pool) => {
            pool.sort((a, b) => b.amount - a.amount);
        });

        return poolsGroup;
    }

    onReceivedJackpotPoolsOnGameData(data: any) {
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_POOLS_ON_GAME, lodash.groupBy(data, "gameId"));
    }

    onReceivedJackpotWinnerData(data: any) {
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_WINNER, data);
    }

    onReceivedJackpotWinnersData(data: any) {
        const filteredData = data.filter((value) => userManager.offerGames.includes(+value.gameId));
        uiManager.emitter.emit(InternalEvents.RECEIVED_JACKPOT_WINNERS, filteredData);
    }

    removeDataObserver(dataType: string, dataKey: string) {
        NotificationService.getInstance().removeDataObserver(dataType, dataKey);
    }
}

export const jackpotManager = JackpotManager.getInstance();
