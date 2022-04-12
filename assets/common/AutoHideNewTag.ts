import { lazyInject } from "../Application";
import LobbyMenuConfig from "../lobby/main/view-models/LobbyMenuConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoHideNewTag extends cc.Component {
    @property
    gameId = "";

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    onLoad() {
        if (this.gameId) {
            this.node.active = this.lobbyMenuConfig.isNewGame(+this.gameId);
        }
    }
}
