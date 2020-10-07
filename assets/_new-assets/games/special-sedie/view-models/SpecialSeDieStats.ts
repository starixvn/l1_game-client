import { Sprite } from '../../../../../creator';
const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieStats extends cc.Component {
    @property(cc.Label)
    evenTotal: cc.Label = null;

    @property(cc.Label)
    oddTotal: cc.Label = null;

    @property(cc.Node)
    resultNode: cc.Node = null;

    @property(cc.SpriteFrame)
    redIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    whiteIcon: cc.SpriteFrame = null;

    private dataLogs = [];
    private evenTotalStats: number = 0;
    private oddTotalStats: number = 0;

    init(dataLogs) {
        this.dataLogs = dataLogs;
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
        this.calcEvenOddTotal();
        this.showDotsStatistic();
    }

    calcEvenOddTotal() {
        this.dataLogs.forEach((log, index) => {
            if (index >= 89) {
                return;
            }
            if (log.settlementResult.even) {
                this.evenTotalStats += 1;
            }

            if (log.settlementResult.odd) {
                this.oddTotalStats += 1;
            }
        })

        this.evenTotal.string = this.evenTotalStats.toString();
        this.oddTotal.string = this.oddTotalStats.toString();
    }

    showDotsStatistic() {
        this.resultNode.children.forEach((result, index) => {
            let component = result.getComponent(cc.Sprite);
            component.spriteFrame = this.dataLogs[index].settlementResult.even ? this.whiteIcon : this.redIcon
        })
    }

    onDisable() {
        this.node.destroy();
    }
} 
