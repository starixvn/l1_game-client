import LogControl from "../../keno-pro/view-models/LogControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundResult extends cc.Component {

    @property(LogControl)
    logControl: LogControl = null;

    @property(cc.Label)
    even: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    red3: cc.Label = null;

    @property(cc.Label)
    red4: cc.Label = null;

    @property(cc.Label)
    white3: cc.Label = null;

    @property(cc.Label)
    white4: cc.Label = null;
}
