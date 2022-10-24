const { ccclass, property } = cc._decorator;

enum SymbolAnimationType {
    IDLE = "item_idle",
    PLAY = "item_play"
}

@ccclass
export default class FruitSlotSymbolSpineAnimation extends cc.Component {
    @property(sp.Skeleton)
    animSkeleton: sp.Skeleton[] = [];

    playAnimSymbol(play: boolean) {
        const anim = play ? SymbolAnimationType.PLAY : SymbolAnimationType.IDLE;
        for (let animSymbol of this.animSkeleton) {
            animSymbol.setAnimation(0, anim, true);           
        }
    }
}
