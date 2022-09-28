import { injectable } from "inversify";

import {
    GameConfiguration,
    getGameConfiguration,
    getGameConfigurationsWithFilter,
    getGameIdsWithFilter,
} from "../../../configs/GameConfigurations";
import { FourGuardiansId } from "../../../games/four-guardians/scripts/FourGuardians";
import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class LobbyMenuConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    smPromotion: boolean;

    get categoryList() {
        return {
            seDieGames: this.getGameIdsByCategory("sedie"),
            casinoGames: this.getGameIdsByCategory("bigsmall"),
            cardGames: this.getGameIdsByCategory("card"),
            slotGames: this.getGameIdsByCategory("slot"),
            lotteryGames: this.getGameIdsByCategory("lottery"),
            othersGames: this.getGameIdsByCategory("other")
        };
    }

    get list() {
        const gameFilter = (configuration: GameConfiguration) => configuration.id > 0 && !!configuration.order;

        return getGameIdsWithFilter(gameFilter);
    }

    get bannerAds() {
        const bannerFilter = (configuration: GameConfiguration) => !!configuration?.banner;
        const games = getGameConfigurationsWithFilter(bannerFilter);
        games.sort((a, b) => a.banner.order - b.banner.order);
        return games.map((configuration) => configuration.id);
    }

    get miniList() {
        const miniPanelFilter = (configuration: GameConfiguration) => configuration?.mini?.miniPanel && !!configuration.order;

        return getGameIdsWithFilter(miniPanelFilter);
    }

    getGameIdsByCategory(category: string) {
        const categoryFilter = (configuration: GameConfiguration) =>
            configuration?.category === category && configuration.id > 0 && !!configuration.order;

        return getGameIdsWithFilter(categoryFilter);
    }

    getBannerInfo(gameId: number) {
        const gameConfiguration = getGameConfiguration(gameId);

        return gameConfiguration?.banner;
    }
    customGameIconBySystem = [FourGuardiansId];

    customizeCredit(): void {
        this.smPromotion = true;
    }

    customizeCash(): void {
        this.smPromotion = false;
    }

    isNewGame(gameId: number): boolean {
        const gameConfiguration = getGameConfiguration(gameId);

        return gameConfiguration?.tag === "new";
    }

    isBigSize(gameId: number): boolean {
        const gameConfiguration = getGameConfiguration(gameId);

        return gameConfiguration?.bigSize;
    }
}
