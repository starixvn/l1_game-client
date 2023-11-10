import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import BannerController from "./BannerController";
import BannerItem from "./BannerItem";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DynamicAdsBannerController extends BannerController {
    @property(cc.Prefab)
    adsItemPrefab: cc.Prefab = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    private isFirstLoadBanner = false;

    async setGameAds(games: number[]) {
        for (const gameId of games) {
            await GameUtils.asyncExecute(this?.node, this.createAdsItem(gameId));
        }
    }

    private handleShowBanner() {
        if (this.node.childrenCount > 0 && !this.isFirstLoadBanner) {
            this.enableTouch();
            this.showFirstPage();
            this.isFirstLoadBanner = true;
        }
    }

    async createAdsItem(id: number) {
        const bannerSpriteFrame = await GameUtils.asyncExecute(this?.node, GameUtils.getBanner(id));
        try {
            if (bannerSpriteFrame && this.adsItemPrefab) {
                const item = cc.instantiate(this.adsItemPrefab);
                if (item) {
                    this.createBasicItem(id, bannerSpriteFrame, item);

                    const button = item.getComponent(cc.Button);
                    const event = new cc.Component.EventHandler();
                    event.target = this.node;
                    event.component = "BannerController";
                    event.handler = "openGame";
                    event.customEventData = id.toString();
                    button.clickEvents.push(event);
                    this.handleShowBanner();
                }
            }
        } catch (e) {
            console.warn("Catch error after await method", e.message);
        }
    }

    createBasicItem(id: number, spriteFrame: cc.SpriteFrame, item: cc.Node) {
        const sprite = item.getComponent(cc.Sprite);
        this.node?.addChild(item);
        sprite.spriteFrame = spriteFrame;

        const bannerItem = item.getComponent(BannerItem);
        const adsInfo = this.lobbyMenuConfig.getBannerInfo(id);

        if (adsInfo) {
            bannerItem.displayTime = adsInfo.displayTime;
        } else {
            bannerItem.displayTime = 4;
        }
    }

    onLoad() {
        // override to delay enableTouch
    }
}
