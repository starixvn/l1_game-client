import MiniGameBase from "../../_base_new/view-models/MiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameSingle extends MiniGameBase {
    protected override managedByContainer = false;

    maximizeCallback = (gameId: number) => {
        //callback
    };

    onClickMaximize() {
        this.maximizeCallback(this.gameId);
    }
}
