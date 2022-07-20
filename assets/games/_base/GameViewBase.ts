import BaseComponent from "../../common/BaseComponent";
import { GameInfos } from "../../configs/SabaConfigs";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameViewBase extends BaseComponent {
    public currentMiniPanel: MiniPanel;
    protected _gameId: number;
    public gameName: string;
    public set gameId(value: number) {
        this._gameId = value;
        this.gameName = GameInfos[value].key;
    }

    public get gameId(): number {
        return this._gameId;
    }

    initMiniPanel(miniPanel: MiniPanel) {
        this.currentMiniPanel = miniPanel;
    }

    openGame() {
        this.node.active = true;
    }

    onSignIn() {}
}
