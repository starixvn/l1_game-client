import GameUtils from "../../../common/GameUtils";
import Seed from "./Seed";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FantanBowlAnimation extends cc.Component {
    @property(cc.Prefab)
    SeedPrefab: cc.Prefab = null;

    @property(cc.Node)
    SeedsRoot: cc.Node = null;

    @property(cc.Sprite)
    ResultNumber: cc.Sprite = null;

    @property(sp.Skeleton)
    BowlAnimation: sp.Skeleton = null;

    @property({ type: cc.SpriteFrame })
    ResultNumberSprites: cc.SpriteFrame[] = [];

    spBigBowl: sp.spine.Bone = null;
    spSmallBowl: sp.spine.Bone = null;
    PreviousBigBowlPosition = cc.Vec3.ZERO;
    PreviousSmallBowlPosition = cc.Vec3.ZERO;
    numberOfSeed = 0;
    originBigBowlPosition = cc.Vec3.ZERO;
    tabIn = !1;
    IsPlaying = !1;
    TotalElapsedTime = 0;
    SeedsToDisplayList = [];
    SeedGroupingsList = [];
    RemainingSeedsList = [];
    TotalRevealTime = 0;
    arcStartAngle = 1.25 * Math.PI;
    arcAngle = 0.5 * Math.PI;
    designResolution = null;
    isResetDoneOnce = !1;

    static Instance: FantanBowlAnimation;

    private readonly ArcRadius = 450;
    private readonly SmallBowlToArcDistance = 160;
    private readonly SeedGroupArcPosY = 150;

    private readonly BigBowlSeedNumbers = 100;
    private get BigBowlRandomWidth() {
        return this.node.scale * 50;
    }

    private get BigBowlRadius_Small() {
        return this.node.scale * 48;
    }
    private get BigBowlRadius_Big() {
        return this.node.scale * 88;
    }

    private get SmallBowlRadius() {
        return this.node.scale * 45;
    }

    private get SmallBowlRadius_Inner() {
        return this.node.scale * 38;
    }

    onLoad() {
        this.spine_FreezeAnimationFrame(this.BowlAnimation, 0, "uncover");
        this.spBigBowl = this.BowlAnimation.findBone("bigBowl");
        this.spSmallBowl = this.BowlAnimation.findBone("smallBowl");
        this.BowlAnimation.clearTracks();

        setTimeout(() => {
            //TODO : fix not using timeout here
            this.PrepareNewSeeds();
        }, 1e3);
    }

    onDestroy() {
        Seed.BigBowlSeedPool = [];
        Seed.BigBowlSeedSwapIdx = [];
        Seed.SmallBowlSeedPool = [];
    }

    update(dt: number) {
        this.RoundSetupAnimation_Update(dt);
        Seed.UpdateAllSeeds();
    }

    constructScene() {
        this.tabIn = !0;
        this.ClearSeedGrouping();
        this.ResetBigBowlSeeds();
        this.spine_FreezeAnimationFrame(this.BowlAnimation, 0, "uncover");
        this.PrepareNewSeeds();
        this.HideAllResultSeeds();

        const n = 2;
        this.setResultNumberSprite(n);
        this.ResultNumber.node.stopAllActions();
        this.ResultNumber.node.opacity = 255;
    }

    PrepareNewSeeds() {
        if (this.BowlAnimation) {
            this.BowlAnimation.updateWorldTransform();
            this.PreviousBigBowlPosition = this.BowlAnimation.node.convertToWorldSpaceAR(
                new cc.Vec3(this.spBigBowl.worldX, this.spBigBowl.worldY)
            );
            this.PreviousSmallBowlPosition = this.BowlAnimation.node.convertToWorldSpaceAR(
                new cc.Vec3(this.spSmallBowl.worldX, this.spSmallBowl.worldY)
            );
            this.originBigBowlPosition = this.PreviousBigBowlPosition;
            if (0 === Seed.BigBowlSeedPool.length) {
                for (let e = 0; e < this.BigBowlSeedNumbers; e++) {
                    const seedNode = cc.instantiate(this.SeedPrefab);
                    this.SeedsRoot.addChild(seedNode);
                    Seed.BigBowlSeedPool.push(seedNode.getComponent(Seed));
                }
            }

            const r = this.SeedsRoot.convertToNodeSpaceAR(this.originBigBowlPosition);
            for (let e = 0; e < Seed.BigBowlSeedPool.length; e++) {
                const i = Seed.BigBowlSeedPool[e];
                i.Velocity = cc.Vec3.ZERO;
                i.node.position = new cc.Vec3(
                    r.x + this.BigBowlRandomWidth * (Math.random() - 0.5),
                    r.y + this.BigBowlRandomWidth * (Math.random() - 0.5)
                );
                i.node.active = !0;
            }
        }
    }

    RoundSetupAnimation_Init() {
        // this.ResetBigBowlSeeds();
        // this.PrepareNewSeeds();
        this.IsPlaying = !0;
        this.BowlAnimation.setAnimation(0, "shaking", !1);
        this.BowlAnimation.timeScale = 1;
        this.TotalElapsedTime = 0;
        this.BowlAnimation.updateWorldTransform();
        this.PreviousBigBowlPosition = this.BowlAnimation.node.convertToWorldSpaceAR(
            new cc.Vec3(this.spBigBowl.worldX, this.spBigBowl.worldY)
        );
        this.PreviousSmallBowlPosition = this.BowlAnimation.node.convertToWorldSpaceAR(
            new cc.Vec3(this.spSmallBowl.worldX, this.spSmallBowl.worldY)
        );
        if (this.SeedGroupingsList.length > 0 || this.RemainingSeedsList.length > 0) {
            this.ClearSeedGrouping();
        }
        setTimeout(() => {
            this.PrepareNewSeeds();
            // this.ResetBigBowlSeeds();
        }, 5e3);
    }

    RoundSetupAnimation_Update(dt: number) {
        if (this.IsPlaying) {
            const t = this.TotalElapsedTime;
            this.TotalElapsedTime += dt;
            this.BowlAnimation.updateWorldTransform();
            const bigBowlWPos = this.BowlAnimation.node.convertToWorldSpaceAR(new cc.Vec3(this.spBigBowl.worldX, this.spBigBowl.worldY)),
                smallBowlWPos = this.BowlAnimation.node.convertToWorldSpaceAR(
                    new cc.Vec3(this.spSmallBowl.worldX, this.spSmallBowl.worldY)
                );
            this.TotalElapsedTime < 4.3
                ? this.BigBowlMove(
                      bigBowlWPos,
                      bigBowlWPos.sub(this.PreviousBigBowlPosition),
                      this.BigBowlRadius_Small,
                      this.BigBowlRadius_Big
                  )
                : this.TotalElapsedTime > 5 &&
                  this.TotalElapsedTime < 7.5 &&
                  this.BigBowlMove(
                      bigBowlWPos,
                      bigBowlWPos.sub(this.PreviousBigBowlPosition),
                      this.BigBowlRadius_Small,
                      this.BigBowlRadius_Big
                  ),
                this.PassedTimeStamp(5, this.TotalElapsedTime, t) && this.SmallBowlRemove(smallBowlWPos, this.SmallBowlRadius_Inner),
                this.TotalElapsedTime > 5.5 && this.SmallBowlMove(smallBowlWPos, this.SmallBowlRadius),
                this.PassedTimeStamp(7.5, this.TotalElapsedTime, t) && (this.IsPlaying = !1),
                (this.PreviousBigBowlPosition = bigBowlWPos),
                (this.PreviousSmallBowlPosition = smallBowlWPos);
        }
    }

    BigBowlMove(bigBowlWPos: cc.Vec3, deltaPos: cc.Vec3, smallRadius: number, bigRadius: number) {
        const bigBowlInSeedRootPos = this.SeedsRoot.convertToNodeSpaceAR(bigBowlWPos);
        const smallRadiusSqr = smallRadius * smallRadius;
        const bigRadiusSqr = bigRadius * bigRadius;
        for (let c = 0; c < Seed.BigBowlSeedPool.length; c++) {
            const u = Seed.BigBowlSeedPool[c];
            const uPos = u.node.convertToWorldSpaceAR(cc.v3());
            let d = bigBowlWPos.sub(uPos);
            const p = d.magSqr();
            if (u.node.active && p < bigRadiusSqr && ((u.Velocity = u.Velocity.add(deltaPos.mul(0.11))), p > smallRadiusSqr)) {
                const l = Math.sqrt(p);
                d = d.mul(smallRadius / l);
                const newUPos = bigBowlInSeedRootPos.sub(d);
                u.node.position = newUPos;
                u.Velocity = u.Velocity.add(d.mul(0.02));
            }
        }

        for (let c = 0; c < Seed.SmallBowlSeedPool.length; c++) {
            const u = Seed.SmallBowlSeedPool[c];
            const uPos = u.node.convertToWorldSpaceAR(cc.v3());
            const d = bigBowlWPos.sub(uPos);
            const p = d.magSqr();
            u.node.active &&
                (p < smallRadiusSqr
                    ? (u.Velocity = u.Velocity.add(deltaPos.mul(0.11)))
                    : (u.Velocity.x < 0 &&
                          deltaPos.x >= 0 &&
                          ((u.Velocity = cc.Vec3.ZERO), (u.node.active = !1), Seed.SwapSeeds(bigBowlInSeedRootPos)),
                      0 != u.Velocity.magSqr() &&
                          p >= smallRadiusSqr &&
                          ((u.Velocity = cc.Vec3.ZERO), (u.node.active = !1), Seed.SwapSeeds(bigBowlInSeedRootPos))));
        }
    }

    SmallBowlRemove(smallBowlWPos, radius) {
        const radiusSqr = radius * radius;
        for (let r = 0; r < Seed.BigBowlSeedPool.length; r++) {
            const i = Seed.BigBowlSeedPool[r];
            const iWpos = i.node.convertToWorldSpaceAR(cc.v3());
            const eSqr = smallBowlWPos.sub(iWpos).magSqr();
            if (i.node.active && eSqr < radiusSqr) {
                Seed.BigBowlSeedSwapIdx.push(r);
                i.node.active = !1;
            }
        }

        for (let r = 0; r < Seed.SmallBowlSeedPool.length; r++) {
            const i = Seed.SmallBowlSeedPool[r];
            const iWpos = i.node.convertToWorldSpaceAR(cc.v3());
            const eSqr = smallBowlWPos.sub(iWpos).magSqr();
            if (i.node.active && eSqr < radiusSqr) {
                i.node.active = !1;
            }
        }
    }

    SmallBowlMove(smallBowlWPos, smallBowlRadius) {
        const radiusSqr = smallBowlRadius * smallBowlRadius;
        const smallBowlInSeedRootPos = this.SeedsRoot.convertToNodeSpaceAR(smallBowlWPos);
        for (let r = 0; r < Seed.BigBowlSeedPool.length; r++) {
            const a = Seed.BigBowlSeedPool[r];
            if (a.node.active) {
                const aWpos = a.node.convertToWorldSpaceAR(cc.v3());
                let s = smallBowlWPos.sub(aWpos);
                const c = s.magSqr();
                if (c < radiusSqr) {
                    const i = Math.sqrt(c);
                    (s = s.mul(smallBowlRadius / i)), (a.node.position = smallBowlInSeedRootPos.sub(s));
                }
            }
        }

        for (let r = 0; r < Seed.SmallBowlSeedPool.length; r++) {
            let a, s, c;
            (a = Seed.SmallBowlSeedPool[r]).node.active &&
                (c = (s = smallBowlWPos.sub(a.node.convertToWorldSpaceAR(cc.v3()))).magSqr()) < radiusSqr &&
                ((i = Math.sqrt(c)), (s = s.mul(smallBowlRadius / i)), (a.node.position = smallBowlInSeedRootPos.sub(s)));
        }
    }

    PassedTimeStamp(e: number, t: number, n: number) {
        return t >= e && n < e;
    }

    async revealResultAnimation(numbersOfSeed) {
        if (!this.SeedsToDisplayList) {
            return;
        }

        this.spine_FreezeAnimationFrame(this.BowlAnimation, 0.99);
        this.BowlAnimation.update(0.01);
        this.spSmallBowl.update();
        this.PreviousSmallBowlPosition = this.BowlAnimation.node.convertToWorldSpaceAR(
            new cc.Vec3(this.spSmallBowl.worldX, this.spSmallBowl.worldY)
        );
        this.BowlAnimation.node.active = !0;
        this.BowlAnimation.setAnimation(0, "uncover", !1);
        this.BowlAnimation.timeScale = 1;
        try {
            await GameUtils.delayTime(100 / 1e3);
            this.spawnResultSeeds(numbersOfSeed);
            const n = 1e3 * this.BowlAnimation.findAnimation("uncover").duration;

            await GameUtils.delayTime(n / 1e3);
            this.spraySeedsIntoArc();

            const delay = 500 + 10 * this.SeedsToDisplayList.length;
            await GameUtils.delayTime(delay / 1e3);
            await this.groupSeedsIntoFours();
        } catch (e) {
            console.warn(e.message);
        }
    }

    spawnResultSeeds(numbersOfSeed) {
        if (null !== this.SeedsToDisplayList && void 0 !== this.SeedsToDisplayList) {
            const t = this.SeedsRoot.convertToNodeSpaceAR(this.PreviousSmallBowlPosition),
                n = Seed.SmallBowlSeedPool.length;
            let r;
            if (n < numbersOfSeed) {
                for (r = 0; r < numbersOfSeed - n; ++r) {
                    const i = cc.instantiate(this.SeedPrefab);
                    i.parent = this.SeedsRoot;
                    Seed.SmallBowlSeedPool.push(i.getComponent(Seed));
                }
            }

            for (r = 0; r < numbersOfSeed; r++) {
                const i = Seed.SmallBowlSeedPool[r];
                (i.node.position = new cc.Vec3(t.x + 10 * Math.random() - 5, t.y + 10 * Math.random() - 5)),
                    (i.node.active = !0),
                    this.SeedsToDisplayList.push(i),
                    i.node.stopAllActions();
            }
        }
    }

    spraySeedsIntoArc() {
        if (null !== this.SeedsToDisplayList && void 0 !== this.SeedsToDisplayList) {
            // this.tabIn || //AudioManager.playEffect("beads_mass");
            for (
                let e = 1.1 * Math.PI, t = (0.2 * Math.PI) / this.SeedsToDisplayList.length, n = 0;
                n < this.SeedsToDisplayList.length;
                n++
            ) {
                const o = this.SeedsToDisplayList[n];
                o.IsPhysicsEnabled = false;
                const i = e - t * n,
                    a = this.ArcRadius + 15 * Math.random(),
                    s = Math.sin(i) * a,
                    c = Math.cos(i) * a + this.SmallBowlToArcDistance;
                this.MoveTo(o.node, s, c, 300, cc.easeQuadraticActionIn(), 10 * n, !0);
            }
        }
    }

    PlayBeadsColumnSound() {
        //AudioManager.playEffect("beads_column")
    }

    PlayBeadsFinalSound() {
        //AudioManager.playEffect("beads_final")
    }

    groupSeedsIntoFours() {
        return new Promise<void>((resolve, reject) => {
            if (!this.SeedsToDisplayList) {
                reject("this.SeedsToDisplayList null");
                return;
            }

            this.SeedsToDisplayList.reverse();
            let e = Math.floor(this.SeedsToDisplayList.length / 4);
            e = this.SeedsToDisplayList.length % 4 == 0 ? e - 1 : e;
            let delay = 0,
                o = 0;

            for (let t = this.arcAngle / (e - 1); o < e; ++o) {
                const r = [];
                for (let i = this.arcStartAngle - t * o, a = 0; a < 4; ++a) {
                    const s = this.SeedsToDisplayList.pop();
                    0 === a &&
                        !1 === this.tabIn &&
                        s.node.runAction(cc.sequence(cc.delayTime(delay / 1e3), cc.callFunc(this.PlayBeadsColumnSound)));
                    const c = this.SeedGroupArcPosY + 15 * a,
                        l = Math.sin(i) * c * 1.2, // this.halfWidth,
                        u = Math.cos(i) * c;
                    this.MoveTo(
                        s.node,
                        l + (2 * Math.random() - 1),
                        u + (1 * Math.random() - 1),
                        150,
                        cc.easeQuadraticActionIn(),
                        delay,
                        !0
                    ),
                        r.push(s);
                }
                this.SeedGroupingsList.push(r);
                delay += 230;
            }
            const d = [0, this.ResultNumber.node.y],
                p = this.SeedsToDisplayList.length,
                h = 20 * (p - 1),
                f = delay / 1e3;
            for (o = 0; o < p; ++o) {
                const s = this.SeedsToDisplayList.pop();
                this.MoveTo(s.node, d[0] + 40 * o - h, d[1], 200, cc.easeQuadraticActionIn(), delay, !0);
                delay += 100;
                /* dev: remove bounce scale effect
                    const m = 100 * o;
                    this.BounceScale(s.node, 1.375, 250, delay + 375 + m);
                    this.BounceScale(s.node, 1, 250, delay + 750 + m);
                    */
                this.RemainingSeedsList.push(s);
            }
            this.setResultNumberSprite(p);
            this.ResultNumber.node.opacity = 0;
            const _ = delay / 1e3 - f;
            const spawn = cc.spawn(cc.callFunc(resolve), cc.fadeIn(0.5));
            let resultNumberAction = cc.sequence(cc.delayTime(f), cc.delayTime(_ + 1.5), spawn);

            if (this.tabIn) {
                resultNumberAction = cc.sequence(cc.delayTime(f), cc.callFunc(this.PlayBeadsFinalSound), cc.delayTime(_ + 1.5), spawn);
            }
            this.ResultNumber.node.stopAllActions();
            this.ResultNumber.node.runAction(resultNumberAction);
        });
    }

    ClearSeedGrouping(e = false) {
        void 0 === e && (e = !1);
        const n = this.SeedGroupingsList.length;
        for (let t = this.RemainingSeedsList.length, o = 0; o < t; ++o) {
            this.RemainingSeedsList[o].IsPhysicsEnabled = true;
        }
        this.RemainingSeedsList.length = 0;
        for (let o = 0; o < n; ++o) {
            const r = this.SeedGroupingsList[o];
            for (let i = 0; i < 4; ++i) {
                r[i].IsPhysicsEnabled = true;
            }
            r.length = 0;
        }
        (this.SeedGroupingsList.length = 0), e ? (this.ResultNumber.node.active = !1) : this.FadeOut(this.ResultNumber.node, 200, 0, !0);
    }

    HideAllResultSeeds() {
        if (null !== this.SeedsToDisplayList && void 0 !== this.SeedsToDisplayList) {
            for (let e = 0; e < this.SeedsToDisplayList.length; e++) {
                this.SeedsToDisplayList[e].node.active = !1;
            }
            this.SeedsToDisplayList.length = 0;
            this.ClearSeedGrouping(!0);
            Seed.HideSmallBowlSeed();
        }
    }
    ResetBigBowlSeeds() {
        for (let e = 0; e < Seed.BigBowlSeedPool.length; e++) {
            const t = Seed.BigBowlSeedPool[e];
            if (t.node.active) {
                const r = this.PreviousBigBowlPosition.sub(t.node.convertToNodeSpaceAR(cc.v3(0))).magSqr(),
                    i = this.SeedsRoot.convertToNodeSpaceAR(this.PreviousBigBowlPosition);
                r > this.BigBowlRandomWidth &&
                    ((t.Velocity = cc.Vec3.ZERO),
                    (t.node.position = new cc.Vec3(
                        i.x + this.BigBowlRandomWidth * (Math.random() - 0.5),
                        i.y + this.BigBowlRandomWidth * (Math.random() - 0.5)
                    )));
            }
        }
    }

    setResultNumberSprite(resultNumber: number) {
        this.ResultNumber.node.active = !0;
        this.ResultNumber.spriteFrame = this.ResultNumberSprites[resultNumber - 1];
    }

    RoundAlreadyStarted() {
        this.spine_FreezeAnimationFrame(this.BowlAnimation, 0, "uncover");
        this.BowlAnimation.update(0.01);
        this.IsPlaying = !1;
    }

    RoundAlmostFinish() {
        this.HideAllResultSeeds();
        this.spine_FreezeAnimationFrame(this.BowlAnimation, 0, "uncover");
        this.BowlAnimation.update(0.01);
        this.IsPlaying = !1;
    }

    RoundAlreadyClosed() {
        this.HideAllResultSeeds();
        this.spine_FreezeAnimationFrame(this.BowlAnimation, 0, "uncover");
        this.IsPlaying = !1;
    }

    restart() {
        if (this.tabIn) {
            this.tabIn = !1;
            this.FadeOut(this.ResultNumber.node, 200, 0, !0);
        } else {
            this.RoundSetupAnimation_Init();
        }
    }

    startRound() {
        this.ResetBigBowlSeeds();
    }

    async closeRound() {
        await this.revealResultAnimation(this.numberOfSeed);
    }

    StartRound_Completed() {
        this.RoundAlreadyStarted();
    }

    CloseRound_Completed() {
        this.RoundAlreadyClosed();
    }

    spine_FreezeAnimationFrame(spineAnimation: sp.Skeleton, startProgress: number, animationName = "shaking") {
        (spineAnimation.node.active = !0), (spineAnimation.timeScale = 0), spineAnimation.setAnimation(0, animationName, !1);
        const trackEntry = spineAnimation.getCurrent(0);
        trackEntry.animationStart = trackEntry.animationEnd * startProgress;
    }

    MoveTo(node: cc.Node, x: number, y: number, duration: number, easing, delay: number, a) {
        const pos = cc.v3(x, y);
        if ((void 0 === delay && (delay = 0), void 0 === a && (a = !0), 0 == a)) return (node.x = pos.x), void (node.y = pos.y);
        const s = cc.moveTo(duration / 1e3, pos.x, pos.y).easing(easing);
        node.runAction(cc.sequence(cc.delayTime(delay / 1e3), s));
    }

    BounceScale(node: cc.Node, scale = 1.2, duration = 200, delayTime = 0) {
        node.scale = 1;
        const convertDuration = duration / 1e3;
        const r = cc.scaleTo(convertDuration / 2, scale).easing(cc.easeCircleActionOut()),
            i = cc.scaleTo(convertDuration / 2, 1).easing(cc.easeCircleActionOut());
        node.runAction(cc.sequence(cc.delayTime(delayTime / 1e3), r, cc.delayTime(convertDuration / 2), i));
    }

    FadeOut(e, t, n, o) {
        if ((void 0 === t && (t = 300), void 0 === n && (n = 0), void 0 === o && (o = !0), !o))
            return (e.active = !1), void (e.opacity = 0);
        e.active = !0;
        const r = cc.fadeOut(t / 1e3);
        e.runAction(cc.sequence(cc.delayTime(n / 1e3), r));
    }
    FadeIn(e, t, n, o) {
        if ((void 0 === t && (t = 300), void 0 === n && (n = 0), void 0 === o && (o = !0), !o))
            return (e.active = !0), void (e.opacity = 255);
        (e.active = !0), (e.opacity = 0);
        const r = cc.fadeIn(t);
        e.runAction(cc.sequence(cc.delayTime(n / 1e3), r));
    }

    setNumberOfSeed(e) {
        this.numberOfSeed = e;
    }
}
