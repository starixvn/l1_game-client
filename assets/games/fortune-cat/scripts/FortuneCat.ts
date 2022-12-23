import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import { FortuneCatSlotConfigs } from "./FortuneCatSlotConfigs";
import SlotGameSongs from "./SlotGameSongs";

const { ccclass, property } = cc._decorator;

export const FortuneCatsId = 62;

@ccclass
export default class FortuneCat extends SlotGameBase {
    @property(SlotGameSongs)
    gameSongList: SlotGameSongs = null;

    public delayShowBigWinValue = 0.8;

    constructor() {
        super();
        this.gameId = FortuneCatsId;
    }

    onLoad() {
        this.gameSongList && (this.gameSongList.gameId = this.gameId);
        super.onLoad();
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FortuneCatSlotConfigs();
    }

    get isOwnGameMusicBackground(): boolean {
        return !!this.gameSongList;
    }

    async playInvidiualMusic() {
        await this.gameSongList?.play();
    }

    stopInvidiualMusic() {
        this.gameSongList?.stop();
    }
}
