import GameUtils from "../../common/GameUtils";
import NoticeUtil from "../../common/utils/NoticeUtil";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import * as sessionManager from "../../common/auth/SessionManager";
const { ccclass, property } = cc._decorator;

export const PromotionAnnouncementItemEvent = {
    CLOSE_PROMOTIONS: "CLOSE_PROMOTIONS"
};
export const JoinGameByGameId = "JOIN_GAME_BY_GAME_ID";

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

    onClickJoinGame(gameId: number) {
        const currentGameId = sessionManager?.getInRoomGameId();
        this.node.emit(PromotionAnnouncementItemEvent.CLOSE_PROMOTIONS);
        if (gameId.toString() === currentGameId) {
            return;
        }
        !GameUtils.isMiniGame(gameId.toString()) && cc.sys.localStorage.setItem(JoinGameByGameId, gameId);
        GameUtils.openGame(gameId, this.miniPanel);
    }
}
