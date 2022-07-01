import * as _ from "lodash";

import BlinkNode from "../../common/BlinkNode";
import MiniRoundHistoryItem from "./MiniRoundHistoryItem";
import MiniRoundHistoryTip from "./MiniRoundHistoryTip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniRoundHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(MiniRoundHistoryTip)
    tip: MiniRoundHistoryTip = null;

    @property(cc.Node)
    nodeNext: cc.Node = null;

    protected items: MiniRoundHistoryItem[] = [];
    protected selectedNode: cc.Node = null;
    private listener = {
        onEnter: (node: cc.Node) => {
            this.selectedNode = node;
            this.tip.node.position = cc.v3(node.x, this.tip.node.y, 0);
            const data = node.getComponent(MiniRoundHistoryItem).data;
            this.tip.setData(data);
            this.tip.show();
        },
        onLeave: (node: cc.Node) => {
            this.selectedNode = null;
            this.tip.show(false);
        }
    };

    protected checkShowNext = () => false;
    protected dataLogs: any[] = [];
    protected isHideNextDot = false;

    onLoad() {
        this.items = this.content.children.map((child) => child.getComponent(MiniRoundHistoryItem));
        this.items.forEach((item) => {
            item.node.active = false;
            item.listener = this.listener;
        });

        this.initNextDot();
        this.schedule(this.updateDisplayItems, 1);
    }

    onDestroy() {
        this.unschedule(this.updateDisplayItems);
    }

    init(condition: () => boolean) {
        this.checkShowNext = condition;
    }

    protected onUpdate(node: cc.Node) {
        const data = node.getComponent(MiniRoundHistoryItem).data;
        this.tip.node.active && this.tip.setData(data);
    }

    public setData(data: any[]) {
        this.dataLogs = _.cloneDeep(data);

        this.updateDisplayItems();
    }

    protected hideAllDots() {
        this.items.forEach((item) => {
            item.node.active = false;
        });
    }

    protected updateDataForItems(data: any[], showNext: boolean) {
        this.hideAllDots();
        const startIndex = showNext ? 1 : 0;
        data.forEach((log, index) => {
            const calculatedIndex = startIndex + index;
            if (calculatedIndex >= this.items.length) {
                return;
            }
            const item = this.items[calculatedIndex];
            item.setData(log);
            item.node.active = true;
        });
        this.selectedNode && this.onUpdate(this.selectedNode);
    }

    protected initNextDot() {
        if (this.nodeNext) {
            this.nodeNext.addComponent(BlinkNode).interval = 0.5;
            this.nodeNext.active = false;
        }
    }

    updateDisplayItems() {
        if (this.dataLogs.length === 0 || this.items.length === 0) {
            return;
        }

        if (this.nodeNext) {
            this.nodeNext.active = this.checkShowNext();
            this.items[0].node.active = !this.nodeNext.active;
            this.updateDataForItems(this.dataLogs, this.nodeNext.active);
            if (this.nodeNext.active) {
                this.hideTooltip();
            }
        } else {
            this.updateDataForItems(this.dataLogs, false);
            this.items[0].node.active = true;
        }
    }

    hideTooltip() {
        this.tip.show(false);
    }
}
