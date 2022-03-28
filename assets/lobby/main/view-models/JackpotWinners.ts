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
        cc.RedT.addDataObserver("jackpot_winners", (data) => this.onReceivedData(data));
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
        cc.RedT.removeDataObserver(`jackpot_winners`);
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
}
