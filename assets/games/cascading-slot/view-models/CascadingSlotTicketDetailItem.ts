import CascadeSlotBoard from "./CascadeSlotBoard";
import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";
import { convertData } from "./CascadingSlotUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTicketDetailItem extends cc.Component {
    @property(cc.Label)
    index: cc.Label = null;

    @property(CascadeSlotBoard)
    resultBoard: CascadeSlotBoard = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Prefab)
    tumbleWinDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    noTumbleWinDetailPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property({ type: cc.Node })
    lines: cc.Node[] = [];

    private MIN_HEIGHT_TOTALROW = 178;
    private HEIGHT_ROW = 89;

    setData(tumble: any, index: number) {
        let numberOfIcon = 0;
        let tumbleNode: cc.Node;
        if (tumble.win > 0) {
            Object.entries(tumble.icons).forEach(([key, value]) => {
                tumbleNode = cc.instantiate(this.tumbleWinDetailItemPrefab);
                const control = tumbleNode.getComponent(CascadingSlotTumbleItem);
                let { count, win } = value as any;
                control.setData(+key + 1, count, win);
                numberOfIcon++;
                this.content.addChild(tumbleNode);
            });
            this.calculateHeightRow(numberOfIcon);
        } else {
            tumbleNode = cc.instantiate(this.noTumbleWinDetailPrefab);
            this.content.addChild(tumbleNode);
        }

        this.win.string = tumble.win;
        this.index.string = index.toString();
    }

    setDataHaveFreeSpin(count: number, odd: number, index: number, win: number, extraFreeSpin: boolean) {
        const tumbleNode = cc.instantiate(this.tumbleWinDetailItemPrefab);
        const control = tumbleNode.getComponent(CascadingSlotTumbleItem);
        control.setDataForFreeSpinTumble(count, odd, extraFreeSpin);
        this.content.addChild(tumbleNode);
        this.win.string = win.toString();
        this.index.string = index.toString();
        this.calculateHeightRow(1);
    }

    setDataResultBoard(symbols: string, multiplier: number[]) {
        const board = convertData(symbols);
        this.resultBoard.setData(board, multiplier);
    }

    calculateHeightRow(numberOfIcon: number) {
        const heightTotalRow = numberOfIcon * this.HEIGHT_ROW;
        if (heightTotalRow > this.MIN_HEIGHT_TOTALROW) {
            this.node.height = heightTotalRow;
            this.lines.forEach((line) => {
                line.height = heightTotalRow;
            });
        } else if (heightTotalRow === this.MIN_HEIGHT_TOTALROW) {
            this.node.height = this.MIN_HEIGHT_TOTALROW;
        } else {
            const symbolChilds = this.content.children;
            const detail = symbolChilds[0].children;
            symbolChilds[0].height = detail[0].getChildByName("line").height = this.MIN_HEIGHT_TOTALROW;
        }
    }
}
