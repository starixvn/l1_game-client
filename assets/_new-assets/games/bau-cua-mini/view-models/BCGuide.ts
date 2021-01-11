import GameMiniBaseGuide from "../../../games/_base/view-models/GameMiniBaseGuide";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BCGuide extends GameMiniBaseGuide {
    getOdds() {
        cc.RedT.send({
            g: {
                baucua: {
                    get_odd: true
                }
            }
        });
    }

    onData(data) {
        if (void 0 !== data.odds) {
            var odds = data.odds;
            if (odds.length < 3) {
                this.clearAllOddLabels();
                return;
            } else {
                this.updateOddLabels(odds);
            }
        }
    }
}
