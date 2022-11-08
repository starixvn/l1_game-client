import ExtraDataHistoryItem from "../../_base/view-models/ExtraDataHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanExtraHistoryItem extends ExtraDataHistoryItem {
    choiceSpriteName = {
        0: "scoreboard_chamdo",
        1: "scoreboard_chamvang",
        2: "scoreboard_chamxanhla",
        3: "scoreboard_chamxanhduong"
    };

    public setData(data: any) {
        super.setData(data);
        const { type, extra } = data;
        this.icon.spriteFrame = this.atlas.getSpriteFrame(this.choiceSpriteName[type - 1]);
    }
}
