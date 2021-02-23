import { appContainer } from "../../Application";
import LobbyMenuConfig from "./view-models/LobbyMenuConfig";

export default class MainModule {
    constructor() {
        appContainer.bind<LobbyMenuConfig>(LobbyMenuConfig).toSelf().inSingletonScope();
    }
}

new MainModule();
