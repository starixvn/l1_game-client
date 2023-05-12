import NotificationService from "../../../common/auth/NotificationService";
import JackpotWinnerItem from "./JackpotWinnerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotWinners extends cc.Component {
    @property(cc.Node)
    listUserNode: cc.Node = null;

    @property(cc.Node)
    noUserNode: cc.Node = null;

    @property(cc.Node)
    listUser: cc.Node = null;

    @property(cc.Prefab)
    winnerItem: cc.Prefab = null;

    private readonly dataKey = "jackpotWinners";

    onLoad() {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.onReceivedData.bind(this));
        cc.tween(this)
            .repeatForever(
                cc
                    .tween()
                    .call(() => this.requestData())
                    .delay(60)
            )
            .start();

        this.listUser.active = false;
        this.handleNoUserAd(!this.listUser.active);
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
    }

    requestData() {
        NotificationService.getInstance().emitEvent("getWinners", { limit: 3 });
    }

    handleNoUserAd(status = true) {
        this.noUserNode.active = status;
        this.listUserNode.active = !status;
    }

    onReceivedData(data: any) {
        this.handleNoUserAd(false);
        this.setData(data);
    }

    setData(data: any) {
        this.listUser.destroyAllChildren();
        this.listUser.active = true;
        data.forEach((playerData) => {
            const winnerNode = cc.instantiate(this.winnerItem);
            this.listUser.addChild(winnerNode);
            const player = winnerNode.getComponent(JackpotWinnerItem);
            player.setAvatar(playerData.avatarId);
            player.setName(playerData.winnerName);
            player.setAmount(playerData.amount);
        });
    }
}
