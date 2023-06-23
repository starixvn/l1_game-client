import axios from "axios";

import { buildProxyUrl } from "../common/helpers/UrlHelper";
import { uiManager } from "../managers/GameUIManager";
import { InternalEvents } from "../managers/InternalEvents";

export interface GameConfiguration {
    id: number;
    currencyGroupId?: string;
    name: string;
    key: string;
    route?: string;
    tag?: string;
    order?: number;
    bigSize?: boolean;
    mini?: {
        miniPanel: boolean;
        multi?: string;
    };
    remoteBundle?: {
        dependsOn: string[];
    };
    banner?: {
        displayTime: number;
        order: number;
    };
    category?: string;
    isMicrosite?: boolean;
}

declare global {
    interface Window {
        gameConfigurations: GameConfiguration[];
    }
}

function delayTime(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export async function initialize() {
    const url = buildProxyUrl("/game/configurations/");
    let configurations;
    let retryCount = 0;

    while (retryCount < 3) {
        cc.log("try load configuration ", retryCount);
        configurations = await axios
            .get(url)
            .then((response) => response.data)
            .catch(() => []);

        if (configurations.length > 0) {
            break;
        }
        retryCount++;
        await delayTime(3);
    }

    if (configurations.length === 0) {
        uiManager.emitter.emit(InternalEvents.SSO_FAILED);
        throw new Error(`Can not load client bundle configuration`);
    }

    // hardcode for testing sedie microsite
    const index = configurations.findIndex((configuration) => configuration.id === 2);
    index >= 0 && (configurations[index].isMicrosite = true);

    window.gameConfigurations = configurations;

    initializeBundleInfos();
}

function initializeBundleInfos() {
    const isDevelopmentMode = window.location.hostname === "localhost";
    const games = getAllGameConfigurations()
        .filter((configuration) => !!configuration.remoteBundle)
        .map((configuration) => ({ gameId: configuration.id, ...configuration.remoteBundle }));

    const developmentMode = games.reduce((result, configs) => {
        result[configs.gameId] = {
            url: "assets",
            name: configs.gameId,
            useMd5Cache: location.href.includes("/build/"),
            dependencies: configs.dependsOn
        };

        return result;
    }, {});

    const productionMode = games.reduce((result, configs) => {
        result[configs.gameId] = {
            url: buildProxyUrl(`/game-client-${configs.gameId}`),
            name: configs.gameId,
            useMd5Cache: true,
            dependencies: configs.dependsOn
        };

        return result;
    }, {});

    if (!window.bundleManagement) {
        window.bundleManagement = {};
    }

    window.bundleManagement.bundles = isDevelopmentMode ? developmentMode : productionMode;
}

export function getGameName(gameId: number) {
    const gameConfiguration = getGameConfiguration(gameId);

    return gameConfiguration?.key;
}

export function getGameId(key: string) {
    const gameConfiguration = getAllGameConfigurations().find((configuration) => configuration.key === key);

    return gameConfiguration?.id;
}

export function isMiniGame(key: string) {
    const gameConfiguration = getAllGameConfigurations().find((configuration) => configuration.key === key);

    return gameConfiguration?.mini != null;
}

export function getGameConfiguration(gameId: number | string) {
    return getAllGameConfigurations().find((configuration) => configuration.id === Number(gameId));
}

export function getAllGameConfigurations() {
    if (CC_EDITOR) {
        return [];
    }

    return window.gameConfigurations;
}

export function getGameConfigurationsWithFilter(filter: (configuration: GameConfiguration) => unknown) {
    const configurations = getAllGameConfigurations();

    return configurations.filter(filter).sort((a, b) => a.order - b.order);
}

export function getGameIdsWithFilter(filter: (configuration: GameConfiguration) => unknown) {
    return getGameConfigurationsWithFilter(filter).map((configuration) => configuration.id);
}

export function isUsingRemoteBundle(gameId: number) {
    const configuration = getGameConfiguration(gameId);

    return configuration && !!configuration.remoteBundle;
}
