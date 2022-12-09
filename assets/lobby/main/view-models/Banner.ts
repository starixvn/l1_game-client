import { appContainer, lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import { FourGuardiansId } from "../../../games/four-guardians/scripts/FourGuardians";
import FourGuardiansConfig from "../../../games/four-guardians/scripts/FourGuardiansConfig";
import LobbyMenuConfig from "../../../lobby/main/view-models/LobbyMenuConfig";
import BannerController from "./BannerController";
import DynamicAdsBannerController from "./DynamicAdsBannerController";
import JackpotNavigation from "./JackpotNavigation";

const { ccclass, property } = cc._decorator;

const fourGuardiansConfig = appContainer.get(FourGuardiansConfig);

@ccclass
export default class Banner extends cc.Component {
    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    private adsBannerController: DynamicAdsBannerController = null;

    private jackpotBannerContainer: cc.Node = null;
    private jackpotNavigationContainer: cc.Node = null;
    private adsToggle: cc.Toggle = null;
    private jackpotToggle: cc.Toggle = null;

    showJackpotBanner = false;
    bannerPrefabNode: cc.Node = null;

    private async init() {
        const prefab = await GameUtils.loadResource(`lobby/banner/bannerContainer`);
        const bannerPrefabNode = cc.instantiate(prefab);
        this.bannerPrefabNode = bannerPrefabNode;
        this.node.addChild(bannerPrefabNode);
        const adsBannerContainerNode = bannerPrefabNode.getChildByName("adsBannerController");
        this.adsBannerController = adsBannerContainerNode.getComponent(DynamicAdsBannerController);
        this.showJackpotBanner = cc.RedT.user.offerGames.includes(FourGuardiansId) && fourGuardiansConfig.jackpotEnabled;
        this.adsBannerController.menuLoop = !this.showJackpotBanner;
        this.adsBannerController.onEndingRound = () => {
            if (this.showJackpotBanner && this.adsToggle && this.jackpotToggle) {
                this.adsToggle.isChecked = false;
                this.jackpotToggle.isChecked = true;
                this.switchBanner(true);
            }
        };
        this.showJackpotBanner && (await this.handleJackpotBanner());
    }

    async reloadBanner(needLoadAllBanners: boolean) {
        try {
            if (!this.adsBannerController) {
                await this.init();
            }
            this.adsBannerController.node.destroyAllChildren();
            const filterList: number[] = this.getGameIdOfferBanner(needLoadAllBanners);
            await this.adsBannerController.setGameAds(filterList);
            this.adsBannerController.showFirstPage();
        } catch (e) {
            console.warn("Catch error after await method", e.message);
        }
    }

    private async handleJackpotBanner() {
        const jackpotContainer = this.bannerPrefabNode.getChildByName("jackpotController");
        this.jackpotNavigationContainer = this.bannerPrefabNode.getChildByName("jackpotNavigationController");
        if (jackpotContainer?.childrenCount > 0 || this.jackpotNavigationContainer?.childrenCount > 0) {
            return;
        }
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
        const gameAds = isLoadAllBanners ? this.lobbyMenuConfig.bannerAds : this.lobbyMenuConfig.bannerAds.slice(0, 1);
        const offerGames = cc.RedT.user.offerGames;
        gameAds.forEach((id: number) => {
            if (offerGames.includes(id)) {
                filterList.push(id);
            }
        });

        if (this.lobbyMenuConfig.smPromotion) {
            // Add SM promotion banner at page 2
            filterList.splice(1, 0, 0);
        }

        return filterList;
    }

    switchBanner(showJackpot: boolean, reset = false) {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                this.adsBannerController.node.active = !showJackpot;
                this.jackpotBannerContainer.active = showJackpot;

                const currentContainer = showJackpot ? this.adsBannerController : this.jackpotBannerContainer;
                const newContainer = !showJackpot ? this.adsBannerController : this.jackpotBannerContainer;

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
