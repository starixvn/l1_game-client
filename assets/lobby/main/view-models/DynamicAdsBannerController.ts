import { lazyInject } from "../../../Application";
import BannerController from "./BannerController";
import BannerItem from "./BannerItem";
import LobbyMenuConfig from "./LobbyMenuConfig";
import configs = require("../../../configs/Configs");
import { reject } from "lodash";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DynamicAdsBannerController extends BannerController {
    @property(cc.Prefab)
    adsItemPrefab: cc.Prefab = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    async setGameAds(games: number[]) {
        for (const game of games) {
            await this.createAdsItem(game);
        }

        if (this.node && this.node.childrenCount > 0) {
            this.enableTouch();
            this.showFirstPage();
        }
    }

    async createAdsItem(id: number) {
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
        }
    }

    createBasicItem(id: number, spriteFrame: cc.SpriteFrame, item: cc.Node) {
        const sprite = item.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        this.node.addChild(item);

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
        const languageAndNewSpriteFrame = await this.getSpriteFrame(`${id.toString()}${languageAndNew}`);

        let bannerSpriteFrame: cc.SpriteFrame;
        if (languageAndNewSpriteFrame) {
            bannerSpriteFrame = languageAndNewSpriteFrame;
        } else {
            const gameIdAndNewSpriteFrame = await this.getSpriteFrame(`${id.toString()}${newSuffix}`);
            if (gameIdAndNewSpriteFrame) {
                bannerSpriteFrame = gameIdAndNewSpriteFrame;
            } else {
                const gameIdAndLanguageSpriteFrame = currentLang !== "vi" ? `${id.toString()}_${currentLang}` : id.toString();
                bannerSpriteFrame = await this.getSpriteFrame(gameIdAndLanguageSpriteFrame);
            }
        }

        return bannerSpriteFrame;
    }

    private getSpriteFrame(name: string) {
        return new Promise<cc.SpriteFrame>((resolve, reject) => {
            cc.resources.load<cc.SpriteFrame>(`image/banners/${name}`, cc.SpriteFrame, (err, spriteFrame) => {
                if (!this.node || !this.node.isValid) {
                    resolve(null);
                    return;
                }
                resolve(spriteFrame);
            });
        });
    }
}
