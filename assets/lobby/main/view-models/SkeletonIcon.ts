import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import Loading from "../../../common/loading/view-models/Loading";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkeletonIcon extends cc.Component {
    static iconAnimationCache = {};

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Node)
    gameContent: cc.Node = null;

    @property(cc.Node)
    lightTop: cc.Node = null;

    @property(cc.Node)
    skeletonLoading: cc.Node = null;

    @property(cc.Node)
    newTag: cc.Node = null;

    @property(Loading)
    gameLoading: Loading = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    setGameName(text: string) {
        this.gameName.string = text;
    }

    private readonly timeGap = 0.125;

    async setGameContent(id: number, gameList: number[]) {
        const batchIndex = Math.abs(Math.floor(gameList.findIndex((gameId) => gameId === id) / 10));
        if (!SkeletonIcon.iconAnimationCache[id] && batchIndex !== 0) {
            this.scheduleOnce(async () => {
                await this.loadAnimation(id);
                SkeletonIcon.iconAnimationCache[id] = true;
            }, batchIndex * this.timeGap);
        } else {
            this.loadAnimation(id);
        }
    }

    private async loadAnimation(id: number, isLoaded = false) {
        if (isLoaded) {
            this.hideSkeleton();
        }

        const gamePath = `lobby/games/${id}`;
        const prefab = await GameUtils.loadResource(gamePath);
        const gameNode = cc.instantiate(prefab);
        this.gameContent?.addChild(gameNode);
        this.newTag && (this.newTag.active = this.lobbyMenuConfig.isNewGame(id));

        if (!isLoaded) {
            this.hideSkeleton();
        }
    }

    private hideSkeleton() {
        this.lightTop && (this.lightTop.active = false);
        this.skeletonLoading && (this.skeletonLoading.active = false);
    }
}
