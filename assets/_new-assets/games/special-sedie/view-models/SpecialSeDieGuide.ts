import { numberWithCommas } from "../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieGuide extends cc.Component {
    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    protected configs: any;

    init(configs) {
        this.configs = configs;
        const replaceData = this.createReplaceData();

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    createReplaceData() {
        const odds = this.configs.odds;
        const replaceData = {
            "_oddsMain": odds.even,
            "_maxBetRound": numberWithCommas(this.configs.maxbet)
        }

        return replaceData;
    }
}