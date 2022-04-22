import PrefabLoaderV2 from "./PrefabLoaderV2";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PortraitPrefabLoader extends PrefabLoaderV2 {
    @property(cc.Prefab)
    portraitPrefab: cc.Prefab = null;
    onLoad() {
        this.instance = cc.instantiate(this.portraitPrefab);
    }
}
