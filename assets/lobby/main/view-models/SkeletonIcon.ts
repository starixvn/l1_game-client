import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import Loading from "../../../common/loading/view-models/Loading";
import { uiManager } from "../../../managers/GameUIManager";
import SplashConfig from "../../../splash/view-models/SplashConfig";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkeletonIcon extends cc.Component {
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

    @lazyInject(SplashConfig)
    protected readonly splashConfig: SplashConfig;

    setGameName(text: string) {
        this.gameName.string = text;
    }
    static listGameWithoutHide = [];

    private readonly timeGap = 0.125;

    async setGameContent(id: number, batchIndex: number, categoryIndex: number, addListIconObscure: (icon: SkeletonIcon) => void) {
        if (!uiManager.prefabCache.lobbyIcons[id] && batchIndex !== 0) {
            addListIconObscure(this);
            this.scheduleOnce(async () => {
                await this.loadAnimation(id, categoryIndex);
            }, batchIndex * this.timeGap);
        } else {
            this.loadAnimation(id, categoryIndex);
        }
    }

    async loadAnimation(id: number, categoryIndex: number) {
        let prefab: cc.Prefab;
        if (uiManager.prefabCache.lobbyIcons[id]) {
            prefab = uiManager.prefabCache.lobbyIcons[id];
        } else {
            prefab = await GameUtils.loadGameIcon(id);
            if (!prefab) {
                prefab = await GameUtils.loadGameIcon(id, this.splashConfig.customPath);
            }
        }
        this.hideSkeleton();

        const gameNode = cc.instantiate(prefab);
        this.gameContent?.addChild(gameNode);
        this.newTag && (this.newTag.active = this.lobbyMenuConfig.isNewGame(id, categoryIndex));

        uiManager.prefabCache.lobbyIcons[id] = prefab;
    }

    private hideSkeleton() {
        this.lightTop && (this.lightTop.active = false);
        this.skeletonLoading && (this.skeletonLoading.active = false);
    }
}
