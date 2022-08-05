import DynamicAdsBannerController from "./DynamicAdsBannerController";
import * as SabaConfigs from "../../../configs/SabaConfigs";
import { appContainer } from "../../../Application";
import FourGuardiansConfig from "../../../games/four-guardians/scripts/FourGuardiansConfig";
import GameUtils from "../../../common/GameUtils";
import BannerController from "./BannerController";
import JackpotNavigation from "./JackpotNavigation";
import LobbyMenuConfig from "../../../lobby/main/view-models/LobbyMenuConfig";
import configs = require("../../../configs/Configs");

const { ccclass, property } = cc._decorator;

const fourGuardiansConfig = appContainer.get(FourGuardiansConfig);
const lobbyMenuConfig = appContainer.get(LobbyMenuConfig);

@ccclass
export default class Banner extends cc.Component {
    private adsBannerContainer: cc.Node = null;
    private jackpotBannerContainer: cc.Node = null;
    private jackpotNavigationContainer: cc.Node = null;
    private adsToggle: cc.Toggle = null;
    private jackpotToggle: cc.Toggle = null;

    async handleBanner(prefab: cc.Prefab, isLoadAllBanners: boolean) {
        if (this.adsBannerContainer && this.adsBannerContainer.childrenCount > 0) {
            this.adsBannerContainer.destroyAllChildren();
        }

        const bannerPrefabNode = cc.instantiate(prefab);
        this.node.addChild(bannerPrefabNode);
        this.adsBannerContainer = bannerPrefabNode.getChildByName("adsBannerController");
        const adsBannerController = this.adsBannerContainer.getComponent(DynamicAdsBannerController);
        const showJackpotBanner =
            isLoadAllBanners && cc.RedT.user.offerGames.includes(SabaConfigs.GameIds.FourGuardians) && fourGuardiansConfig.jackpotEnabled;

        adsBannerController.menuLoop = !showJackpotBanner;
        const filterList: number[] = this.getGameIdOfferBanner(isLoadAllBanners);
        adsBannerController.setGameAds(filterList, async () => {
            showJackpotBanner && (await this.handleJackpotBanner(bannerPrefabNode));
        });

        adsBannerController.onEndingRound = () => {
            if (showJackpotBanner && this.adsToggle && this.jackpotToggle) {
                this.adsToggle.isChecked = false;
                this.jackpotToggle.isChecked = true;
                this.switchBanner(true);
            }
        };
        adsBannerController.showFirstPage();
    }

    private async handleJackpotBanner(bannerPrefabNode: cc.Node) {
        const jackpotContainer = bannerPrefabNode.getChildByName("jackpotController");
        this.jackpotNavigationContainer = bannerPrefabNode.getChildByName("jackpotNavigationController");
        await this.setJackpotContainer(jackpotContainer);
        await this.setJackpotNavigation();
    }

    private async setJackpotContainer(container: cc.Node) {
        const pathPrefab = `lobby/banner/jackpotController`;
        const prefab = await GameUtils.loadResource(pathPrefab);
        const gameNode = cc.instantiate(prefab);
        container.addChild(gameNode);
        const bannerNode = container?.children[0];
        this.jackpotBannerContainer = bannerNode;

        bannerNode.getComponent(BannerController).onEndingRound = () => {
            this.jackpotToggle.isChecked = false;
            this.adsToggle.isChecked = true;

            this.switchBanner(false);
        };
    }

    private async setJackpotNavigation() {
        const pathPrefab = `lobby/banner/jackpotNavigation`;
        const prefab = await GameUtils.loadResource(pathPrefab);
        const gameNode = cc.instantiate(prefab);
        this.jackpotNavigationContainer.addChild(gameNode);

        const navigationComponent = this.jackpotNavigationContainer?.children[0]?.getComponent(JackpotNavigation);
        navigationComponent.onInit(this);
        this.jackpotToggle = navigationComponent.jackpotToggle;
        this.adsToggle = navigationComponent.adsToggle;
        navigationComponent.node.active = true;
    }

    private getGameIdOfferBanner(isLoadAllBanners: boolean) {
        const filterList: number[] = [];
        const gameAds = isLoadAllBanners
            ? lobbyMenuConfig.bannerAds[configs.systemType]
            : [lobbyMenuConfig.bannerAds[configs.systemType][0]];
        const offerGames = cc.RedT.user.offerGames;
        gameAds.forEach((id: number) => {
            if (offerGames.includes(id)) {
                filterList.push(id);
            }
        });

        if (lobbyMenuConfig.smPromotion) {
            // Add SM promotion banner at page 2
            filterList.splice(1, 0, 0);
        }

        return filterList;
    }

    switchBanner(showJackpot: boolean, reset = false) {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                this.adsBannerContainer.active = !showJackpot;
                this.jackpotBannerContainer.active = showJackpot;

                const currentContainer = showJackpot ? this.adsBannerContainer : this.jackpotBannerContainer;
                const newContainer = !showJackpot ? this.adsBannerContainer : this.jackpotBannerContainer;

                const currentController = currentContainer.getComponent(BannerController);
                const newController = newContainer.getComponent(BannerController);

                if (currentController.currentIndex > 0 || reset) {
                    newController.showFirstPage();
                } else {
                    newController.showLastPage();
                }
            })
            .start();
    }
}
