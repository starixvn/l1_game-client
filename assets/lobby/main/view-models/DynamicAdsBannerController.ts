import { lazyInject } from "../../../Application";
import configs = require("../../../configs/Configs");
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

    async setGameAds(games: number[], initJackpot: () => void, callback: () => void) {
        for (const gameId of games) {
            await this.createAdsItem(gameId, callback);
        }
        initJackpot();
    }

    private handleShowBanner(callback: () => void) {
        callback();
        if (this.node.childrenCount > 0 && !this.isFirstLoadBanner) {
            this.enableTouch();
            this.showFirstPage();
            this.isFirstLoadBanner = true;
        }
    }

    async createAdsItem(id: number, callback: () => void) {
        const bannerSpriteFrame = await this.getBannerSpriteFrame(id);
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
            this.handleShowBanner(callback);
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

    async getBannerSpriteFrame(id: number) {
        const newSuffix = this.lobbyMenuConfig.isNewGame(id) ? "_new" : "";
        const currentLang = window.i18n.curLang;
        const languageAndNew = window.i18n.curLang !== "vi" ? `_${currentLang}${newSuffix}` : newSuffix;
        const languageAndNewSpriteFrame = await this.getSpriteFrame(id.toString(), `${id.toString()}${languageAndNew}`);

        let bannerSpriteFrame: cc.SpriteFrame;
        if (languageAndNewSpriteFrame) {
            bannerSpriteFrame = languageAndNewSpriteFrame;
        } else {
            const gameIdAndNewSpriteFrame = await this.getSpriteFrame(id.toString(), `${id.toString()}${newSuffix}`);
            if (gameIdAndNewSpriteFrame) {
                bannerSpriteFrame = gameIdAndNewSpriteFrame;
            } else {
                const gameIdAndLanguageSpriteFrame = currentLang !== "vi" ? `${id.toString()}_${currentLang}` : id.toString();
                bannerSpriteFrame = await this.getSpriteFrame(id.toString(), gameIdAndLanguageSpriteFrame);
            }
        }

        return bannerSpriteFrame;
    }

    private getSpriteFrame(gameId: string, imageName: string): Promise<cc.SpriteFrame> {
        return new Promise<cc.SpriteFrame>((resolve) => {
            cc.resources.load<cc.SpriteFrame>(`lobby/banner/textures/${gameId}/${imageName}`, cc.SpriteFrame, (err, spriteFrame) => {
                resolve(spriteFrame);
            });
        });
    }
}
