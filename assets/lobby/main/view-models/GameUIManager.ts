import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import Loading from "../../../common/loading/view-models/Loading";

interface EmitterStorageType {
    eventName: string;
    callback: (param?) => void;
}
export default class GameUIManager {
    private static instance: GameUIManager;
    private iconGameLoading = {};
    private currentGameId;
    public emitterStorages: EmitterStorageType[] = [];
    public emitter: EventEmitterBase;
    static Events = {
        LOAD_ALL_BANNERS: "banner: update",
        RELOAD_LOBBY: "lobby: change"
    };

    public static getInstance(): GameUIManager {
        if (!this.instance) {
            this.instance = new GameUIManager();
            this.instance.initEmitter();
        }

        return this.instance;
    }

    initEmitter() {
        this.emitter = new EventEmitterBase();
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

    emitterListener(eventName: string, callback: (param?) => void) {
        const storage = {
            eventName,
            callback
        };
        this.emitter.on(eventName, storage.callback);
        this.emitterStorages.push(storage);
    }
}
