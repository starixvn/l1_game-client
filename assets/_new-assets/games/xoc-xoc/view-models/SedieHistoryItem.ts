const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistoryItem extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    phien: cc.Label = null;

    @property(cc.Sprite)
    kqSprite: cc.Sprite = null;

    @property(cc.Label)
    kqLabel: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    even: cc.Label = null;

    @property(cc.Label)
    red3: cc.Label = null;

    @property(cc.Label)
    red4: cc.Label = null;

    @property(cc.Label)
    white3: cc.Label = null;

    @property(cc.Label)
    white4: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    linkIcon: cc.Node = null;

    @property(cc.Node)
    scoinIcon: cc.Node = null;

    @property(cc.Label)
    red2: cc.Label = null;
}
