"use strict";

const games = [
    {
        gameId: 47,
        bundleName: "treasure-island",
        dependencies: []
    },
    {
        gameId: 48,
        bundleName: "blockchain-baccarat",
        dependencies: []
    }
];

const developmentMode = games.reduce((result, configs) => {
    result[configs.gameId] = {
        url: "assets",
        name: configs.bundleName,
        useMd5Cache: location.href.includes("/build/"),
        dependencies: configs.dependencies
    };

    return result;
}, {});

const withProductionMode = (url) =>
    games.reduce((result, configs) => {
        const proxyPath = `game-client-${configs.gameId}`;

        result[configs.gameId] = {
            url: `https://${url}/${proxyPath}`,
            name: configs.bundleName,
            useMd5Cache: true,
            dependencies: configs.dependencies
        };

        return result;
    }, {});

const environmentConfigs = [
    {
        proxy: `l1-proxy.`,
        game: `games.`,
        domain: "lumigame.com",
        path: ""
    },
    ...[
        ["l1", ""],
        ["l1", 1],
        ["l1", 2],
        ["l1", 3],
        ["l2", ""],
        ["l2", 1],
        ["l2", 2]
    ].map(([site, id]) => ({
        proxy: `${site}-proxy${id}.`,
        game: `${site}-games${id}.`,
        domain: "lumigame.com",
        path: ""
    })),
    ...[
        ["l1", "sit"],
        ["l1", "uat"],
        ["l2", "sit"],
        ["l2", "uat"]
    ].map(([site, env]) => ({
        proxy: `${site}uatproxy.`,
        game: `${site}${env}.`,
        domain: "sgamesuat.com",
        path: `/${env}`
    })),
    {
        proxy: "proxy.",
        game: "",
        domain: "sabagame.com",
        path: ""
    },
    {
        proxy: "proxy.",
        game: "",
        domain: "v-gaming.net",
        path: ""
    }
];

const environments = {
    localhost: developmentMode,
    ...environmentConfigs.reduce((result, configs) => {
        const key = `${configs.game}${configs.domain}`;
        const url = `${configs.proxy}${configs.domain}${configs.path}`;

        result[key] = withProductionMode(url);

        return result;
    }, {})
};

window.bundleInfos = environments[window.location.hostname] || developmentMode;
