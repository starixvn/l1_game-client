import BannerController from "./BannerController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DynamicAdsBannerController extends BannerController {
    @property(cc.Prefab)
    adsItemPrefab: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    bannerAtlas: cc.SpriteAtlas = null;

    setGameAds(games: number[]) {
        this.node.destroyAllChildren();
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
        }
    }

    onLoad() {
        // override to delay enableTouch
    }
}
