import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;
const ROW_MAX = 5;

@ccclass
export default class BeadRoad extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property
    startHorizontalPadding = 0;

    @property
    startVerticalPadding = 0;

    @property
    horizontalSpacing = 0;

    @property
    verticalSpacing = 0;

    private scrollView: cc.ScrollView = null;
    private nextItem: cc.Node = null;
    private itemNodes: cc.Node[] = [];
    private _showNext = false;

    get showNext() {
        return this._showNext;
    }

    set showNext(value: boolean) {
        this._showNext = value;
        this.updateDisplay();
    }

    onLoad() {
        this.initScrollView(this.content.parent);
    }

    initScrollView(node: cc.Node) {
        const scrollView = node.getComponent(cc.ScrollView);
        if (scrollView) {
            this.scrollView = scrollView;
        }
    }

    checkScrollViewActivation() {
        const scrollEnable = this.content.width > this.scrollView.node.width;
        this.scrollView.enabled = scrollEnable;
    }

    createNextItem() {
        return this.addItem(null);
    }

    addItem(data: any) {
        const node = cc.instantiate(this.itemPrefab);
        const historyItem = node.getComponent(MiniRoundHistoryItem);
        historyItem && historyItem.setData(data);
        this.content.addChild(node);

        return node;
    }

    setData(roundHistory: any[]) {
        this.itemNodes.forEach((node) => node.destroy());
        this.itemNodes = [];
        for (const data of roundHistory) {
            const node = this.addItem(data);
            this.itemNodes.push(node);
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const nodes = [...this.itemNodes];
        if (this._showNext) {
            if (!this.nextItem) {
                this.nextItem = this.createNextItem();
            }
            nodes.unshift(this.nextItem);
        }

        this.updatePositions(nodes);
        this.updateContentSize(nodes);
    }

    updatePositions(nodes: cc.Node[]) {
        nodes.forEach((node, index) => {
            const column = Math.floor(index / ROW_MAX);
            let row = index % ROW_MAX;

            if (column % 2 === 1) {
                row = ROW_MAX - row - 1; //reverse
            }
            node.position = this.calculatePosition(row, column);
        });
    }

    calculatePosition(row: number, column: number) {
        const anchorX = this.content.anchorX > 0 ? -1 : 1;
        const anchorY = this.content.anchorY > 0 ? -1 : 1;
        const x = anchorX * (this.startHorizontalPadding + column * this.horizontalSpacing);
        const y = anchorY * (this.startVerticalPadding + row * this.verticalSpacing);

        return cc.v3(x, y);
    }

    updateContentSize(nodes: cc.Node[]) {
        const columnsCount = Math.ceil(nodes.length / ROW_MAX);
        this.content.width = this.startHorizontalPadding + columnsCount * this.horizontalSpacing;
    }
}
