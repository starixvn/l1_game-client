import { uiManager } from "../../../managers/GameUIManager";
import { InternalEvents } from "../../../managers/InternalEvents";
import { JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";
import JackpotTopWinnersItem from "./JackpotTopWinnersItem";
import { GameCategory } from "./LobbyMenu";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotTopWinners extends cc.Component {
    @property(cc.Node)
    listUserNode: cc.Node = null;

    @property(cc.Node)
    noUserNode: cc.Node = null;

    @property(cc.Prefab)
    winnerItem: cc.Prefab = null;

    onLoad() {
        this.listUserNode.active = false;
        this.handleNoUserAd(!this.listUserNode.active);
        this.initEvents();
        this.requestData();
        this.schedule(this.requestData, 60);
    }

    onEnable() {
        // node is disabled, the schedule does not work
        this.requestData();
    }

    onDestroy() {
        this.unschedule(this.requestData);
        uiManager.removeListeners(InternalEvents.RECEIVED_JACKPOT_WINNERS, this);
    }

    requestData() {
        jackpotManager.emitEvent(JackpotEvents.GET_WINNERS, { limit: 10 });
    }

    initEvents() {
        uiManager.emitterListener(InternalEvents.RECEIVED_JACKPOT_WINNERS, (data) => this.onData(data), this);
    }

    onData(data: any) {
        this.setData(data);
        this.handleNoUserAd(data.length === 0);
    }

    handleNoUserAd(status = true) {
        if (!this.noUserNode || !this.listUserNode) {
            return;
        }

        this.noUserNode.active = status;
    }

    setData(data: any) {
        if (!this.listUserNode || data.length === 0) {
            return;
        }

        this.listUserNode.destroyAllChildren();
        this.listUserNode.active = true;

        data.forEach((playerData) => {
            const winnerNode = cc.instantiate(this.winnerItem);
            this.listUserNode.addChild(winnerNode);
            const player = winnerNode.getComponent(JackpotTopWinnersItem);
            player.setData(playerData);
        });
    }

    onClickNoUsers(e) {
        uiManager.emitter.emit(InternalEvents.CHANGE_CATEGORY, GameCategory.Slot);
    }
}
