import NoticeUtil from "../../common/utils/NoticeUtil";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionAnnouncementItem extends cc.Component {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Node)
    joinButton: cc.Node = null;

    public setData(data: any) {
        this.title.string = NoticeUtil.getMessageByLocale(data.title);
        this.content.string = NoticeUtil.getMessageByLocale(data.messages);
    }
}
