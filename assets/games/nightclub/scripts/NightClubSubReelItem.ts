const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClubSubReelItem extends cc.Component {
    @property(sp.Skeleton)
    particle08: sp.Skeleton = null;

    @property(sp.Skeleton)
    particle04: sp.Skeleton = null;

    @property(sp.Skeleton)
    halo: sp.Skeleton = null;

    setHighlight(status: boolean) {
        const animName = status ? "anim_highlight" : "anim_idle";
        this.particle08.setAnimation(0, animName, true);
        this.particle04.setAnimation(0, animName, true);
        this.halo && this.halo.setAnimation(0, animName, true);
    }
}
