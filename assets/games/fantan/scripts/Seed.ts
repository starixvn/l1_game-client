const { ccclass, property } = cc._decorator;

@ccclass
export default class Seed extends cc.Component {
    Velocity = cc.Vec3.ZERO;
    IsPhysicsEnabled = true;

    static BigBowlSeedPool: Seed[] = [];
    static SmallBowlSeedPool: Seed[] = [];
    static BigBowlSeedSwapIdx = [];
    Radius = 5.8;

    get RadiusSQ() {
        return this.Radius * this.Radius;
    }

    static UpdateAllSeeds() {
        for (let e = 0; e < Seed.BigBowlSeedPool.length; e++) {
            if (Seed.BigBowlSeedPool[e].node.active) {
                Seed.BigBowlSeedPool[e].PhysicsUpdate();
            }
        }
        for (let e = 0; e < Seed.SmallBowlSeedPool.length; e++) {
            if (Seed.SmallBowlSeedPool[e].node.active) {
                Seed.SmallBowlSeedPool[e].PhysicsUpdate();
            }
        }
    }

    static HideSmallBowlSeed() {
        for (let e = 0; e < Seed.SmallBowlSeedPool.length; e++) {
            const t = Seed.SmallBowlSeedPool[e];
            t.node.active && (t.node.active = !1);
        }
    }

    static SwapSeeds(position) {
        if (0 != Seed.BigBowlSeedSwapIdx.length) {
            const t = Seed.BigBowlSeedSwapIdx.pop(),
                n = Seed.BigBowlSeedPool[t];
            null != n && ((n.node.position = position), (n.node.active = !0));
        }
    }

    PhysicsUpdate() {
        if (this.node.active && this.IsPhysicsEnabled) {
            this.node.position = this.node.position.add(this.Velocity);
            this.Velocity = this.Velocity.mul(0.7);
            for (let e = 0; e < Seed.BigBowlSeedPool.length; e++) {
                const r = Seed.BigBowlSeedPool[e];
                if (r !== this && r.node.active) {
                    const i = this.node.position.sub(r.node.position);
                    const a = i.magSqr();
                    if (a < this.RadiusSQ) {
                        const t = Math.sqrt(a),
                            o = i.mul(((2 * this.Radius - t) / t) * 0.125);
                        this.node.position = this.node.position.add(o);
                        r.node.position = r.node.position.sub(o);
                    }
                }
            }

            for (let e = 0; e < Seed.SmallBowlSeedPool.length; e++) {
                const r = Seed.SmallBowlSeedPool[e];
                if (r !== this && r.node.active) {
                    const i = this.node.position.sub(r.node.position);
                    const a = i.magSqr();
                    if (a < this.RadiusSQ) {
                        const t = Math.sqrt(a),
                            o = i.mul(((2 * this.Radius - t) / t) * 0.125);
                        this.node.position = this.node.position.add(o);
                        r.node.position = r.node.position.sub(o);
                    }
                }
            }
        }
    }
}
