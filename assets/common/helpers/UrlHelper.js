import * as configs from "../../configs/Configs";

export function buildUrl(subDomain, hostName, ssl, protocol = "http", path = "/", port = 80) {
    const subDomainText = `${subDomain}.`;
    const portText = `:${port}`;
    return `${protocol}${ssl ? "s" : ""}://${subDomain === "" ? "" : subDomainText}${hostName}${port === "" ? "" : portText}${path}`;
}

export function buildServerUrl(ssl, protocol = "http", path = "/", gameId = 0) {
    const serverHostName = configs.serverDomainMapper[window.location.hostname];
    const serverGameEndPoint = configs.serverGameEndPoints[gameId];
    return buildUrl(serverGameEndPoint.subDomain, serverHostName, ssl, protocol, serverGameEndPoint.path + path, serverGameEndPoint.port);
}
