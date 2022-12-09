import { appContainer } from "../Application";
import LobbyMenuConfig from "../lobby/main/view-models/LobbyMenuConfig";
import SplashConfig from "./view-models/SplashConfig";

export default class SplashModule {
    constructor() {
        appContainer.bind<SplashConfig>(SplashConfig).toSelf().inSingletonScope();
        appContainer.bind<LobbyMenuConfig>(LobbyMenuConfig).toSelf().inSingletonScope();
    }
}

new SplashModule();
