import { numberWithCommas } from "../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieGuide extends cc.Component {
    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    @property(cc.Node)
    mainFrame: cc.Node = null;

    protected configs: any;

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    init(configs) {
        this.configs = configs;
        const replaceData = this.createReplaceData();

        this.replaceNodes.forEach((label) => {
            Object.keys(replaceData).forEach((key) => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    createReplaceData() {
        const odds = this.configs.odds;
        return {
            _oddsMain: odds.even,
            _maxBetRound: numberWithCommas(this.configs.maxbet)
        };
    }
}
