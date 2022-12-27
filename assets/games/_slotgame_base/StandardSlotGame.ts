import { BundleManager } from "bundle-management";

import AudioManager from "../../common/audio/AudioManager";
import GameUIManager from "../../lobby/main/view-models/GameUIManager";
import SlotGameBase, { SlotGameSound } from "./SlotGameBase";
import { StandardSlotGameConfigs } from "./StandardSlotGameConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGame extends SlotGameBase {
    @property({ type: cc.AudioSource, visible: false, override: true })
    soundSources: cc.AudioSource[] = [];

    @property
    protected _gameId = 0;
    @property
    public get gameId(): number {
        return this._gameId;
    }
    public set gameId(value) {
        this._gameId = value;
    }

    protected audioClips = {};
    onLoad() {
        this.loadAudio();
        super.onLoad();
    }

    loadAudio() {
        const dict = {
            [SlotGameSound.SPIN]: "spin-button",
            [SlotGameSound.WIN]: "win",
            [SlotGameSound.BIG_WIN]: "big-win",
            [SlotGameSound.JACKPOT]: "jackpot",
            [SlotGameSound.FREESPIN]: "freespin",
            [SlotGameSound.BONUS]: "bonus",
            [SlotGameSound.SPINNING_NORMAL]: "spinning-normal",
            [SlotGameSound.SPINNING_TURBO]: "spinning-turbo"
        };

        for (const key of Object.keys(dict)) {
            const path = `preload/audio/${dict[key]}`;
            const devPath = `../games/*/${path}`;
            BundleManager.getInstance()
                .loadAsset<cc.AudioClip>({
                    bundleId: this.gameId.toString(),
                    path: path,
                    pathForDevMode: devPath,
                    type: cc.AudioClip
                })
                .then((clip) => {
                    if (clip) {
                        this.audioClips[key] = clip;
                    }
                })
                .catch(() => {
                    console.warn("missing audio for", path);
                });
        }
    }

    override playSound(type: SlotGameSound) {
        const key = type.toString();
        if (this.audioClips[key]) {
            AudioManager.getInstance().playSFX(this.audioClips[key]);
        }
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new StandardSlotGameConfigs();
    }

    initSlotBoard() {
        this.loadSlotSymbols().then(() => {
            super.initSlotBoard();
        });
    }

    async loadSlotSymbols() {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        for (let index = 0; index < 11; index++) {
            if (prefabCache[index]) {
                continue;
            }
            const path = `preload/symbols/${index}`;
            const devPath = `../games/*/${path}`;
            const prefab = await BundleManager.getInstance().loadAsset<cc.Prefab>({
                bundleId: this.gameId.toString(),
                path: path,
                pathForDevMode: devPath,
                type: cc.Prefab
            });

            prefabCache[index] = prefab;
        }

        GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] = prefabCache;
    }
}
