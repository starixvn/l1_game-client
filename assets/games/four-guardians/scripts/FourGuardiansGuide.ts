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
  example1Value: cc.Label = null;

  @property(cc.Label)
  example1Total: cc.Label = null;

  @property(cc.Label)
  example2Value: cc.Label = null;

  @property(cc.Label)
  example2Total: cc.Label = null;

  @property(cc.Label)
  highestTotal: cc.Label = null;

  protected configs: any;

  onLoad() {
    const commonDialog = this.mainFrame.getComponent('CommonDialog');
    commonDialog.onDidHide = () => {
      this.node.destroy();
    };
  }

  init(configs: any) {
    const odds = configs.odds;

    this.symbolArray.forEach((item) => {
      const symbolName = item.name.replace('symbol', '');

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

    // example for symbol 2
    const symbol2Odds = odds[2][3];
    this.example1Value.string = symbol2Odds.toString();
    this.example1Total.string = (symbol2Odds * 10).toString();

    // example for symbol 2
    const symbol5Odds = odds[5][3];
    this.example2Value.string = symbol5Odds.toString();
    this.example2Total.string = (symbol5Odds * 10).toString();

    this.highestTotal.string = `${symbol5Odds * 10}`;
  }
}
