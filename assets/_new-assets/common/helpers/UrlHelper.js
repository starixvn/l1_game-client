import * as configs from '../../Configs';

export function buildUrl(hostName, ssl, protocol = "http", path = "/") {
    return `${protocol}${ssl ? "s" : ""}://${hostName}${path}`
}

export function buildServerUrl(ssl, protocol = "http", path = "/") {
    var serverHostName = configs.serverEndpoints[window.location.hostname];
    return buildUrl(serverHostName, ssl, protocol, path);
}