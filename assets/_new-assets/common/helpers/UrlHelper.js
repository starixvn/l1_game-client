import * as configs from '../../Configs';

export function buildUrl(subDomain, hostName, ssl, protocol = "http", path = "/", port = 80) {
    return `${protocol}${ssl ? "s" : ""}://${subDomain == "" ? "" : subDomain + "."}${hostName}${port == "" ? "" : ":" + port}${path}`
}

export function buildServerUrl(ssl, protocol = "http", path = "/", gameId = 0) {
    const serverHostName = configs.serverDomainMapper[window.location.hostname];
    const serverGameEndPoint = configs.serverGameEndPoints[gameId];
    return buildUrl(serverGameEndPoint.subDomain, serverHostName, ssl, protocol, serverGameEndPoint.path + path, serverGameEndPoint.port);
}