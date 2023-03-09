import { BundleManager } from "bundle-management";

import { systemType } from "../../configs/Configs";
import SlotGameSongs from "./SlotGameSongs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameSongs extends SlotGameSongs {
    loadAudioClip(song: string): Promise<cc.AudioClip> {
        const customSystemType = this.isSameBackgroundMusic ? `` : `/${systemType}`;

        return BundleManager.getInstance().loadAsset<cc.AudioClip>({
            bundleId: this.gameId.toString(),
            path: `/preload/audios/background-music${customSystemType}/${song}`,
            type: cc.AudioClip
        });
    }
}
