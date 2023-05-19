import { lazyInject } from "../../Application";
import * as sessionManager from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import NoticeUtil from "../../common/utils/NoticeUtil";
import { getGameConfiguration } from "../../configs/GameConfigurations";
import { appManager } from "../../managers/AppManager";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import SocketIOController from "../../SocketIOController";
import PromotionNotificationsHandler from "./PromotionNotificationsHandler";

const { ccclass, property } = cc._decorator;

export const PromotionAnnouncementItemEvent = {
    CLOSE_PROMOTIONS: "CLOSE_PROMOTIONS"
};

@ccclass
export default class PromotionAnnouncementItem extends cc.Component {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    message: cc.Label = null;

    @property(cc.Button)
    joinButton: cc.Button = null;

    @property(cc.Node)
    bgDisable: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    public miniPanel: MiniPanel;

    @lazyInject(SocketIOController)
    private readonly socketIOControler: SocketIOController;

    public setData(data: any) {
        this.title.string = NoticeUtil.getMessageByLocale(data.title);
        this.title.node.getComponent(cc.LabelShadow).enabled = true;
        this.message.string = NoticeUtil.getMessageByLocale(data.messages);
        this.joinButton.interactable = data.isActive;
        this.bgDisable.active = data.isActive ? false : true;
        const text = this.joinButton.node.getChildByName("text");
        text.color = data.isActive ? cc.color(209, 42, 33) : cc.color(83, 78, 78);
        this.joinButton.node.on("click", this.onClickJoinGame.bind(this, data.gameId));
    }

    async onClickJoinGame(gameId: number) {
        const currentGameId = sessionManager?.getInRoomGameId();
        this.node.emit(PromotionAnnouncementItemEvent.CLOSE_PROMOTIONS);
        if (gameId.toString() === currentGameId) {
            return;
        }
        if (!GameUtils.isMiniGame(gameId.toString())) {
            PromotionNotificationsHandler.getInstance().setJoinGameId(gameId);
            try {
                const gameConfiguration = getGameConfiguration(gameId);
                if (gameConfiguration?.isMicrosite) {
                    GameUtils.openGameMicrosite(gameId);
                    return;
                }
                await GameUtils.tryOpenGameDirect(gameId, this.socketIOControler);
                if (appManager.currentScene?.onCloseGame) {
                    appManager.currentScene.openOtherScene = true;
                    appManager.currentScene.onCloseGame();
                }
                await GameUtils.loadSceneGame(gameId, this.socketIOControler);
            } catch (error) {}
        } else {
            GameUtils.openGame(this.getGameId(gameId), this.miniPanel);
        }
    }

    getGameId(gameId: number) {
        const miniSedieIds = [9, 56, 57, 58];
        return miniSedieIds.includes(gameId) ? miniSedieIds[0] : gameId;
    }
}
