import { appContainer } from "../../Application";
import LobbyMenuConfig from "./view-models/LobbyMenuConfig";

export default class LobbyComponent {
    constructor() {
        appContainer.bind<LobbyMenuConfig>(LobbyMenuConfig).toSelf().inSingletonScope();
    }
}

new LobbyComponent();
