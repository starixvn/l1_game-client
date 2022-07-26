import Loading from "../../../common/loading/view-models/Loading";

export default class GameUIManager {
    private static instance: GameUIManager;
    private iconGameLoading = {};
    private currentGameId;

    public static getInstance(): GameUIManager {
        if (!this.instance) {
            this.instance = new GameUIManager();
        }

        return this.instance;
    }

    getLoadingWithGameID(gameId: number): Loading {
        return this.iconGameLoading[gameId];
    }

    cacheIconLoading(gameId: number, loadingComp: Loading) {
        this.iconGameLoading[gameId] = loadingComp;
    }

    unCacheIconLoading(gameId: number) {
        delete this.iconGameLoading[gameId];
    }

    setCurrentGameId(gameId: number) {
        this.currentGameId = gameId;
    }

    getCurrentGameId(): number {
        return this.currentGameId;
    }
}
