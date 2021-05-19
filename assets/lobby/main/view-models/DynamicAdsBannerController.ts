import { lazyInject } from "../../../Application";
import BannerController from "./BannerController";
import BannerItem from "./BannerItem";
import LobbyMenuConfig from "./LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DynamicAdsBannerController extends BannerController {
    @property(cc.Prefab)
    adsItemPrefab: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    bannerAtlas: cc.SpriteAtlas = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    setGameAds(games: number[]) {
        games.forEach((id) => this.createAdsItem(id));
        if (this.node.childrenCount > 0) {
            this.enableTouch();
            this.showFirstPage();
        }
    }

    createAdsItem(id: number) {
        const spriteFrame = this.bannerAtlas.getSpriteFrame(id.toString());
        if (spriteFrame) {
            const item = cc.instantiate(this.adsItemPrefab);
            const sprite = item.getComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            this.node.addChild(item);

            const button = item.getComponent(cc.Button);
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = "BannerController";
            event.handler = "openGame";
            event.customEventData = id.toString();
            button.clickEvents.push(event);

            const bannerItem = item.getComponent(BannerItem);
            const adsInfo = this.lobbyMenuConfig.bannerAdsInfo[id];
            if (adsInfo) {
                bannerItem.displayTime = adsInfo.displayTime;
            } else {
                bannerItem.displayTime = 4;
            }
        }
    }

    onLoad() {
        // override to delay enableTouch
    }
}
