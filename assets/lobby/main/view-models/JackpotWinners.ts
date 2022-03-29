import PlayerInfo from "./PlayerInfo";
import NotificationService from "../../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotWinners extends cc.Component {
    @property({ type: PlayerInfo })
    players: PlayerInfo[] = [];

    @property(cc.Node)
    listUserNode: cc.Node = null;

    @property(cc.Node)
    noUserNode: cc.Node = null;

    private readonly dataKey = "jackpot_winners";
    private readonly dataType = "jackpotWinners";
    notificationService: NotificationService;

    setData(data: any) {
        data.forEach((playerData, index) => {
            const player = this.players[index];
            player.node.active = true;
            player.setAvatar(playerData.avatarId);
            player.setName(playerData.winnerName);
            player.setAmount(playerData.amount);
        });
    }

    onLoad() {
        this.notificationService = NotificationService.getInstance();
        this.notificationService.addDataObserver(this.dataType, this.dataKey, (data) => this.onReceivedData(data));
        cc.tween(this)
            .repeatForever(
                cc
                    .tween()
                    .call(() => this.requestData())
                    .delay(60)
            )
            .start();

        this.handleNoUserAd(true);
        this.players.forEach((player) => (player.node.active = false));
    }

    onDestroy() {
        this.notificationService.removeDataObserver(this.dataType, this.dataKey);
    }

    requestData() {
        this.notificationService.emitEvent("getWinners", { limit: 3 });
    }

    handleNoUserAd(status = true) {
        this.noUserNode.active = status;
        this.listUserNode.active = !status;
    }

    onReceivedData(data: any) {
        this.handleNoUserAd(false);
        this.setData(data);
    }
}
