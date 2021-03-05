import { lazyInject } from '../../../Application';
import FourGuardiansConfig from './FourGuardiansConfig';
import FourGuardiansGuideItem from './FourGuardiansGuideItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FourGuardiansGuide extends cc.Component {
    @property(cc.Node)
    symbolArray: cc.Node[] = [];

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Label)
    jackPotWinningRatio: cc.Label = null;

    @property(cc.Label)
    exampleBonus: cc.Label = null;

    @property(cc.Label)
    example1Total: cc.Label = null;

    @property(cc.Label)
    example2Total: cc.Label = null;

    @property(cc.Label)
    highestTotal: cc.Label = null;

    @lazyInject(FourGuardiansConfig)
    private readonly fourGuardiansConfig: FourGuardiansConfig;

    protected configs: any;

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    init(configs: any) {
        const odds = configs.odds;

        this.symbolArray.forEach((item) => {
            const symbolName = item.name.replace("symbol", "");

            const orderSymbols = Object.keys(odds[symbolName]).sort((c, b) => {
                return odds[symbolName][b] - odds[symbolName][c];
            });

            const symbolItem = item.getComponent(FourGuardiansGuideItem);

            orderSymbols.forEach((times, index) => {
                if (odds[symbolName][times] > 0) {
                    symbolItem.times[index].string = times;
                    symbolItem.value[index].string = odds[symbolName][times].toString();
                } else {
                    symbolItem.times[index].node.parent.active = false;
                }
            });
        });

        // JackPot Winning Ratio
        this.exampleBonus.string = `${configs.jackpot.winningRatio * 100}%`;

        // example for Bonus
        this.exampleBonus.string = odds[7][3].toString();

        const currencyExample = this.fourGuardiansConfig.jackpotEnabled ? 10 : 1;

        // example for symbol 2
        const symbol2Odds = odds[2][3];
        this.example1Total.string = `${currencyExample} * ${symbol2Odds} = ${symbol2Odds * currencyExample} `;

        // example for symbol 2
        const symbol5Odds = odds[5][3];
        this.example2Total.string = `${currencyExample} * ${symbol5Odds} = ${symbol5Odds * currencyExample} `;

        this.highestTotal.string = `${symbol5Odds * currencyExample}`;
    }
}
