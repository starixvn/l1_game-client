import NotificationService from "../../../common/auth/NotificationService";
import { JackpotDataKey, JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";
import JackpotTopWinnersItem from "./JackpotTopWinnersItem";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotTopWinners extends cc.Component {
    @property(cc.Node)
    listUserNode: cc.Node = null;

    @property(cc.Node)
    noUserNode: cc.Node = null;

    @property(cc.Node)
    listUser: cc.Node = null;

    @property(cc.Prefab)
    winnerItem: cc.Prefab = null;

    private readonly dataKey = JackpotDataKey.JACKPOT_WINNERS;

    onLoad() {
        jackpotManager.addDataObserver(this.dataKey, this.dataKey, this.onReceivedData.bind(this));
        this.requestData();
        this.schedule(this.requestData, 60);
        this.listUser.active = false;
        this.handleNoUserAd(!this.listUser.active);
    }

    onEnable() {
        // node is disabled, the schedule does not work
        this.requestData();
    }

    onDestroy() {
        this.unschedule(this.requestData);
        jackpotManager.removeDataObserver(this.dataKey, this.dataKey);
    }

    requestData() {
        jackpotManager.emitEvent(JackpotEvents.GET_WINNERS, { limit: 10 });
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
            const player = winnerNode.getComponent(JackpotTopWinnersItem);
            player.setAvatar(playerData.avatarId);
            player.setName(playerData.winnerName);
            player.setAmount(playerData.amount);
            player.setGameName(GameUtils.getGameNameString(playerData.gameId));
        });
    }
}
