import MiniGameBase from "../../_base_new/view-models/MiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameSingle extends MiniGameBase {
    protected override sendIngameOnEnable = false;
    protected override clearGameDataOnDestroy = false;

    maximizeCallback = (gameId: number) => {
        //callback
    };

    onClickMaximize() {
        this.maximizeCallback(this.gameId);
    }

    grantSocket() {
        super.grantSocket();
        if (this.socket) {
            this.socket.off("signedIn").on("signedIn", () => {
                this.registerViewGame();
            });
        }
    }
}
