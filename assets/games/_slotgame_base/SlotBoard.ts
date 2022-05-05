import AudioManager from '../../common/audio/AudioManager';
import GameUtils from '../../common/GameUtils';
import { SlotGameBaseConfigs } from './SlotGameBaseConfigs';
import SlotReel from './SlotReel';

enum SlotGameSound {
    ROLLING_NORMAL = 0,
    ROLLING_TURBO = 1
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotBoard extends cc.Component {
    @property(cc.Node)
    winningOverlayNode: cc.Node = null;

    @property(cc.Node)
    winningSymbolsNode: cc.Node = null;

    @property(cc.Node)
    itemLocationMap: cc.Node = null;

    @property({ type: cc.AudioSource })
    soundSources: cc.AudioSource[] = [];

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

    getItemPositions(index: number): cc.Vec2[] {
        const paylines = [
            [1, 4, 7, 10, 13],
            [0, 3, 6, 9, 12],
            [2, 5, 8, 11, 14],
            [2, 4, 6, 10, 14],
            [0, 4, 8, 10, 12],

            [1, 3, 6, 9, 13],
            [1, 5, 8, 11, 13],
            [0, 3, 7, 11, 14],
            [2, 5, 7, 9, 12],
            [1, 5, 7, 9, 13],

            [1, 3, 7, 11, 13],
            [0, 4, 7, 10, 12],
            [2, 4, 7, 10, 14],
            [0, 4, 6, 10, 12],
            [2, 4, 8, 10, 14],

            [1, 4, 6, 10, 13],
            [1, 4, 8, 10, 13],
            [0, 3, 8, 9, 12],
            [2, 5, 6, 11, 14],
            [0, 5, 8, 11, 12],

            [2, 3, 6, 9, 14],
            [1, 3, 8, 9, 13],
            [1, 5, 6, 11, 13],
            [0, 5, 6, 11, 12],
            [2, 3, 8, 9, 14]
        ];

        const payline = paylines[index];
        const pos = [];
        payline.forEach((position) => {
            const item = this.itemLocationMap.children[position];
            const worldPos = item.convertToWorldSpaceAR(cc.v2(0, 0));
            pos.push(worldPos);
        });

        return pos;
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

    convertDataToColumns(data: number[]) {
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

        return columns;
    }

    applyData(data: number[]) {
        const columns = this.convertDataToColumns(data);
        this.reels.forEach((reel, index) => reel.setReelData(columns[index]));
    }

    async spin(duration: number, turbo: boolean) {
        if (this.soundSources.length > 0) {
            const sound = turbo ? SlotGameSound.ROLLING_TURBO : SlotGameSound.ROLLING_NORMAL;
            AudioManager.getInstance().playSFX(this.soundSources[sound].clip);
        }
        const columns = this.convertDataToColumns(this.data);
        const timeGap = 0.1 * duration;
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];

            if (i > 0 && !turbo) {
                await GameUtils.delayTime(timeGap);
            }

            if (i < this.reels.length - 1) {
                reel.spinWithData(duration, columns[i]);
            } else {
                await reel.spinWithData(duration, columns[i]);
            }
        }
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
