import GameUtils from "../../common/GameUtils";
import NoticeUtil from "../../common/utils/NoticeUtil";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
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
    content: cc.Node = null;

    public miniPanel: MiniPanel;

    public setData(data: any) {
        this.title.string = NoticeUtil.getMessageByLocale(data.title);
        this.title.node.getComponent(cc.LabelShadow).enabled = true;
        this.message.string = NoticeUtil.getMessageByLocale(data.messages);
        this.joinButton.interactable = data.isActive;
        this.joinButton.node.opacity = data.isActive ? 255 : 150;
        this.joinButton.node.on("click", this.onClickJoinGame.bind(this, data.gameId));
    }

    onClickJoinGame(gameId) {
        GameUtils.openGame(gameId, this.miniPanel);
        this.node.emit(PromotionAnnouncementItemEvent.CLOSE_PROMOTIONS);
    }
}
