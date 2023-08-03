import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundTimerResultText extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    show(data, betChoices) {
        const { settlement } = data;
        let choiceName = "";
        Object.keys(settlement).forEach((key) => {
            const index = betChoices.findIndex((value) => value === key);
            if (settlement[key] && index !== -1) {
                choiceName += GameUtils.getBetChoiceString(betChoices[index]);
            }
        });

        this.result.string = choiceName;
    }
}
