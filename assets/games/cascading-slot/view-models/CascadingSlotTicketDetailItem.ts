import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTicketDetailItem extends cc.Component {
    @property(cc.Label)
    index: cc.Label = null;

    @property(cc.Node)
    resultBoard: cc.Node = null;

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
                control.setData(+key, count, win);
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

    calculateHeightRow(numberOfIcon: number) {
        const heightTotalRow = numberOfIcon * this.HEIGHT_ROW;
        if (heightTotalRow > this.MIN_HEIGHT_TOTALROW) {
            this.node.height = heightTotalRow;
            this.lines.forEach((line) => {
                line.height = heightTotalRow;
            });
        } else {
            this.node.height = this.MIN_HEIGHT_TOTALROW;
        }
    }
}
