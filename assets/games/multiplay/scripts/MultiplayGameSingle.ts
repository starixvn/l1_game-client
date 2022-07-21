import MiniGameBase from "../../_base_new/view-models/MiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameSingle extends MiniGameBase {
    protected override joinGameOnEnable = false;
    protected override clearGameDataOnDestroy = false;

    maximizeCallback = (gameId: number) => {
        //callback
    };

    onClickMaximize() {
        this.maximizeCallback(this.gameId);
    }

    onLoad() {
        super.onLoad();
        if (!this.socket) {
            this.schedule(this.scheduleCheckSocket, 0.3, cc.macro.REPEAT_FOREVER);
        }
    }

    scheduleCheckSocket() {
        this.grantSocket();
        this.initSocketListenter();
        this.initConnection();
        this.registerViewGame();

        if (this.socket) {
            this.socket.off("signedIn").on("signedIn", () => {
                this.registerViewGame();
            });
            this.unschedule(this.scheduleCheckSocket);
        }
    }
}
