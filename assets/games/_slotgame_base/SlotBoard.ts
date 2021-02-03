import { SlotGameBaseConfigs } from './SlotGameBaseConfigs';
import SlotReel from './SlotReel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotBoard extends cc.Component {
    @property(cc.Node)
    winningOverlayNode: cc.Node = null;

    @property(cc.Node)
    winningSymbolsNode: cc.Node = null;

    private readonly reels: SlotReel[] = [];

    public get reelCount() {
        return this.reels.length;
    }

    public get itemTypeCount() {
        return this.reels[0].itemTypeCount || 0;
    }

    protected data: number[] = [];
    public slotGameConfig: SlotGameBaseConfigs;

    onLoad() {
        this.winningOverlayNode.active = false;

        this.node.children.forEach((child) => {
            const reel = child.getComponent(SlotReel);
            if (reel) {
                this.reels.push(reel);
                reel.slotGameConfig = this.slotGameConfig;
            }
            reel.winningContainer = this.winningSymbolsNode;
        });
    }

    setConfig(config: SlotGameBaseConfigs) {
        this.slotGameConfig = config;
        this.reels.forEach((reel) => (reel.slotGameConfig = this.slotGameConfig));
    }

    setBoardData(data: number[]) {
        this.data = data;
    }

    getLocation(index: number): { col: number; row: number } {
        const RowCount = 3;
        const col = Math.floor(index / RowCount);
        const row = index % RowCount;
        return { col, row };
    }

    applyData(data: number[]) {
        const columns = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        for (let i = 0; i < data.length; i++) {
            const { col, row } = this.getLocation(i);
            columns[col][row] = data[i];
        }

        this.reels.forEach((reel, index) => reel.setReelData(columns[index]));
    }

    spin(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const actions = [];
            this.reels.forEach((reel) => {
                actions.push(() => {
                    reel.spin();
                });
            });
            let count = 0;
            cc.tween(this.node)
                .repeat(
                    actions.length,
                    cc
                        .tween()
                        .call(() => {
                            actions[count]();
                            count++;
                        })
                        .delay(0.1)
                )
                .delay(0.2)
                .call(() => this.applyData(this.data))
                .delay(0.8)
                .call(resolve)
                .start();
        });
    }

    showWinningEffect(positions: number[], symbol: number) {
        positions.forEach((position) => {
            const { col, row } = this.getLocation(position);
            this.reels[col].showWinningEffect(row, symbol);
        });
        this.winningOverlayNode.active = true;
    }

    showHighlightSpecialSymbols(symbol: number) {
        this.reels.forEach((reel) => reel.showHighlightSpecialSymbols(symbol));
    }

    hideWinningEffect() {
        this.reels.forEach((reel) => reel.hideWinningEffect());
        this.winningOverlayNode.active = false;
    }
}
