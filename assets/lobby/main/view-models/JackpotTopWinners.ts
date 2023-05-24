import { uiManager } from "../../../managers/GameUIManager";
import { InternalEvents } from "../../../managers/InternalEvents";
import { JackpotDataKey, JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";
import JackpotTopWinnersItem from "./JackpotTopWinnersItem";

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
        this.initEvents();
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
        uiManager.removeListeners(this.dataKey, this.dataKey);
    }

    requestData() {
        jackpotManager.emitEvent(JackpotEvents.GET_WINNERS, { limit: 10 });
    }

    initEvents() {
        jackpotManager.addDataObserver(this.dataKey, this.dataKey);
        uiManager.emitterListener(InternalEvents.RECEIVED_JACKPOT_WINNERS, (data) => this.onData(data), this);
    }

    onData(data: any) {
        this.handleNoUserAd(false);
        this.setData(data);
    }

    handleNoUserAd(status = true) {
        if (!this.noUserNode || !this.listUserNode) {
            return;
        }

        this.noUserNode.active = status;
        this.listUserNode.active = !status;
    }

    setData(data: any) {
        if (!this.listUser) {
            return;
        }

        this.listUser.destroyAllChildren();
        this.listUser.active = true;

        data.forEach((playerData) => {
            const winnerNode = cc.instantiate(this.winnerItem);
            this.listUser.addChild(winnerNode);
            const player = winnerNode.getComponent(JackpotTopWinnersItem);
            player.setData(playerData);
        });
    }
}
