import { lazyInject } from "../../../Application";
import configs = require("../../../configs/Configs");
import BannerController from "./BannerController";
import BannerItem from "./BannerItem";
import LobbyMenuConfig from "./LobbyMenuConfig";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DynamicAdsBannerController extends BannerController {
    @property(cc.Prefab)
    adsItemPrefab: cc.Prefab = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    private isFirstLoadBanner = false;

    async setGameAds(games: number[], initJackpot: () => void) {
        for (const gameId of games) {
            await this.createAdsItem(gameId);
        }
        initJackpot();
    }

    private handleShowBanner() {
        if (this.node.childrenCount > 0 && !this.isFirstLoadBanner) {
            this.enableTouch();
            this.showFirstPage();
            this.isFirstLoadBanner = true;
        }
    }

    async createAdsItem(id: number) {
        const bannerSpriteFrame = await GameUtils.getBanner(this.lobbyMenuConfig, id);
        if (bannerSpriteFrame) {
            const item = cc.instantiate(this.adsItemPrefab);
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

    createBasicItem(id: number, spriteFrame: cc.SpriteFrame, item: cc.Node) {
        const sprite = item.getComponent(cc.Sprite);
        this.node.addChild(item);
        sprite.spriteFrame = spriteFrame;

        const bannerItem = item.getComponent(BannerItem);
        const adsInfo = this.lobbyMenuConfig.bannerAdsInfo[configs.systemType][id];
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
