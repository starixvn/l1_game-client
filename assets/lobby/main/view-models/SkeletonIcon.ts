import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import RemoteSpine from "../../../common/RemoteSpine";
import { buildMicrositeGameUrl } from "../../../common/helpers/UrlHelper";
import Loading from "../../../common/loading/view-models/Loading";
import { getGameConfiguration } from "../../../configs/GameConfigurations";
import { uiManager } from "../../../managers/GameUIManager";
import SplashConfig from "../../../splash/view-models/SplashConfig";
import GameNotification from "./GameNotification";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

interface GameNotificationConfig {
    type: string;
    x?: number;
    y?: number;
}
interface RemoteIconConfig {
    gameNotification?: GameNotificationConfig;
    premultipliedAlpha: boolean;
}

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

    private async createIconNode(id: number) {
        let prefab: cc.Prefab;
        if (uiManager.prefabCache.lobbyIcons[id]) {
            prefab = uiManager.prefabCache.lobbyIcons[id];
        } else {
            prefab = await GameUtils.loadGameIcon(id);
            if (!prefab) {
                prefab = await GameUtils.loadGameIcon(id, this.splashConfig.customPath);
            }
        }

        uiManager.prefabCache.lobbyIcons[id] = prefab;
        return cc.instantiate(prefab);
    }

    private async createRemoteIconNode(id: number) {
        const node = new cc.Node();

        try {
            const url = buildMicrositeGameUrl(id);
            const configFile = await GameUtils.loadRemote<cc.JsonAsset>(`${url}/remote/icon/config.json`);
            const iconConfig: RemoteIconConfig = configFile.json;

            node.addComponent(sp.Skeleton);
            const remoteSpine = node.addComponent(RemoteSpine);
            remoteSpine.host = `${url}/remote/icon`;
            remoteSpine.spineName = "icon-game";
            remoteSpine.spine.premultipliedAlpha = iconConfig.premultipliedAlpha;
            if (iconConfig.gameNotification) {
                this.addGameNotificationComponent(node, id, iconConfig.gameNotification);
            }
        } catch (error) {
            cc.log(error);
        }
        return node;
    }

    private async addGameNotificationComponent(node: cc.Node, id: number, gameNotification: GameNotificationConfig) {
        const notification = node.addComponent(GameNotification);
        notification.gameId = id;

        const type = gameNotification.type;
        const labelPrefabName = `label-${type}`;
        const prefab = await GameUtils.loadResource(`lobby/games/remote-icon/${labelPrefabName}`);
        const labelNode = cc.instantiate(prefab);
        node.addChild(labelNode);
        labelNode.position.add(cc.v3(gameNotification.x, gameNotification.y));
        notification.noticeNode = labelNode;
    }

    async loadAnimation(id: number, categoryIndex: number) {
        const gameConfiguration = getGameConfiguration(id);
        const gameNode = gameConfiguration.isMicrosite ? await this.createRemoteIconNode(id) : await this.createIconNode(id);

        this.hideSkeleton();
        this.gameContent?.addChild(gameNode);
        this.newTag && (this.newTag.active = this.lobbyMenuConfig.isNewGame(id, categoryIndex));
    }

    private hideSkeleton() {
        this.lightTop && (this.lightTop.active = false);
        this.skeletonLoading && (this.skeletonLoading.active = false);
    }
}
