import GameUtils from './GameUtils';
import PrefabLoaderV2 from './PrefabLoaderV2';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabLoaderV3 extends PrefabLoaderV2 {
    @property(cc.Prefab)
    orientationPrefab: cc.Prefab = null;
    onLoad() {
        if (GameUtils.isPhone()) {
            this.instance = cc.instantiate(this.orientationPrefab);
        } else {
            this.instance = cc.instantiate(this.prefab);
        }
    }
}
