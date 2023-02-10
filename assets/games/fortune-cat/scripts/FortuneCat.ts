import { SystemType } from "../../../ISystem";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import { FortuneCatSlotConfigs } from "./FortuneCatSlotConfigs";

const { ccclass, property } = cc._decorator;

export const FortuneCatsId = 62;

@ccclass
export default class FortuneCat extends SlotGameBase {
    @property({ type: cc.AudioSource, override: true, visible: false })
    musicBg: cc.AudioSource = null;

    public delayShowBigWinValue = 0.8;

    onLoad() {
        super.onLoad();
        this.gameSongList &&
            this.gameSongList.setListSongs({
                [SystemType.SC1]: ["song1", "song2", "song3"],
                [SystemType.SC2]: ["song1", "song2", "song3"]
            });
    }

    constructor() {
        super();
        this.gameId = FortuneCatsId;
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FortuneCatSlotConfigs();
    }
}
