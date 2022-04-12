import { lazyInject } from "../Application";
import LobbyMenuConfig from "../lobby/main/view-models/LobbyMenuConfig";
import configs = require("../configs/Configs");

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoHideNewTag extends cc.Component {
    @property
    gameId = "";

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    onLoad() {
        if (this.gameId) {
            this.node.active = this.lobbyMenuConfig.newGames[configs.systemType].includes(+this.gameId);
        }
    }
}
