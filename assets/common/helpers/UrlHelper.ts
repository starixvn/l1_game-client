import * as configs from "../../configs/Configs";
import { getGameConfiguration } from "../../configs/GameConfigurations";

export function buildUrl(protocol = "http", path = "/") {
    const ssl = configs.ssl;
    const hostName = configs.serverDomainMapper[window.location.hostname];
    const subDomain = configs.subDomain;
    const subDomainText = `${subDomain}.`;
    return `${protocol}${ssl ? "s" : ""}://${subDomain === "" ? "" : subDomainText}${hostName}${path}`;
}

export function buildUrlWithPath(path) {
    return buildUrl("http", path);
}

export function buildServerUrl(protocol = "http", path = "/", gameId = 0) {
    const gamePath = getPath(gameId);
    return buildUrl(protocol, gamePath + path);
}

export function buildProxyUrl(path) {
    const envPath = configs.env === "" ? "" : `/${configs.env}`;
    const fullPath = `${envPath}${path}`;

    return buildUrl("http", fullPath);
}

export function getTrialSocket(gameId) {
    const gameConfiguration = getGameConfiguration(gameId);
    const path = gameConfiguration?.key.toLowerCase();
    const pathStr = `/trial/${path}`;
    return buildUrl("http", `${pathStr}`);
}

export function getPath(gameId) {
    const gameConfiguration = getGameConfiguration(gameId);
    const path = gameConfiguration?.key.toLowerCase();
    let pathStr = "";
    if (gameId === 0) {
        pathStr = `/${getEnvironment()}${path}`;
    } else {
        pathStr = `/user/${path}`;
    }

    return pathStr;
}

export function getProxyRoute(gameId) {
    const gameConfiguration = getGameConfiguration(gameId);
    const route = gameConfiguration?.route || gameConfiguration?.key.toLowerCase();

    return `/${getEnvironment()}${route}/socket.io`;
}

export function getEnvironment() {
    const env = configs.env;
    let envStr = "";
    if (env.length > 0) {
        envStr = `${env}/`;
    }

    return envStr;
}
