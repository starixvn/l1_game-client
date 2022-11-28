import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import Loading from "../../../common/loading/view-models/Loading";
import GameUIManager from "./GameUIManager";
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

    setGameName(text: string) {
        this.gameName.string = text;
    }
    static listGameWithoutHide = [];

    private readonly timeGap = 0.125;

    async setGameContent(id: number, batchIndex: number, addListIconObscure: (icon: SkeletonIcon) => void) {
        const uiManager = GameUIManager.getInstance();
        if (!uiManager.prefabCache.lobbyIcons[id] && batchIndex !== 0) {
            addListIconObscure(this);
            this.scheduleOnce(async () => {
                await this.loadAnimation(id);
            }, batchIndex * this.timeGap);
        } else {
            this.loadAnimation(id);
        }
    }

    async loadAnimation(id: number) {
        const uiManager = GameUIManager.getInstance();
        let prefab: cc.Prefab;
        if (uiManager.prefabCache.lobbyIcons[id]) {
            prefab = uiManager.prefabCache.lobbyIcons[id];
        } else {
            prefab = await GameUtils.loadGameIcon(id);
        }
        this.hideSkeleton();

        const gameNode = cc.instantiate(prefab);
        this.gameContent?.addChild(gameNode);
        this.newTag && (this.newTag.active = this.lobbyMenuConfig.isNewGame(id));

        uiManager.prefabCache.lobbyIcons[id] = prefab;
    }

    private hideSkeleton() {
        this.lightTop && (this.lightTop.active = false);
        this.skeletonLoading && (this.skeletonLoading.active = false);
    }
}
