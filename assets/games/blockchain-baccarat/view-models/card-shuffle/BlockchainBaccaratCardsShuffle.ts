import { Chain } from "./../../BlockchainBaccaratType";
import { Blockchain } from "./../../event-models/BlockchainBaccaratCardListModel";
import { CardAnimation } from "./../../../../common/new-card/view-models/NewCard";
import { CardModel } from "../../BlockchainBaccaratType";
import BlockchainCard from "../../components/card-list/view-models/BlockchainCard";

const { ccclass, property } = cc._decorator;

enum TimeShowAnim {
    full = 42,
    burnCard = 38.5
}

@ccclass
export default class BlockchainBaccaratCardsShuffle extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cutCard: cc.Node = null;

    @property(cc.Node)
    burnCard: cc.Node = null;

    @property(cc.Node)
    containerBurnCards: cc.Node = null;

    @property(cc.Node)
    centerCard: cc.Node = null;

    @property(cc.Node)
    cardsBox: cc.Node = null;

    @property(cc.Node)
    cardsDrop: cc.Node = null;

    private readonly durationFlyCard = 0.6;
    private readonly durationFlyOpenCard = 0.4;
    private readonly durationFlyCardBurn = 1;
    private readonly durationDropCards = 0.4;
    private readonly durationPrepareOpenCards = 1;
    private readonly durationCutCard = 3.5;

    private cardCenterTween: cc.Tween;
    private allCardsFlyTween: cc.Tween;
    private allCardsDropTween: cc.Tween[];

    public cardVerification: BlockchainCardVerification;

    onLoad = () => {
        this.allCardsDropTween = [];
    };

    onHidden() {
        this.resetActions();
    }

    resetActions() {
        const skeleton = this.cutCard.getComponent(sp.Skeleton);
        skeleton.destroy();
        this.cardCenterTween.stop();
        this.allCardsFlyTween.stop();
        this.centerCard?.children[0].stopAllActions();
        this.allCardsDropTween?.forEach((cardTween: cc.Tween) => {
            cardTween.stop();
        });
    }

    async handleShowCutCards(data: Blockchain, duration: number) {
        const cutCardValue = data.chain?.[0]?.card;
        const formatData: Chain[] = data.chain.slice(1, data.burnedCards);
        console.log(duration, "handleShowCutCards");
        if (duration >= TimeShowAnim.full) {
            this.cardsBox.parent.active = false;
            this.cutCard.active = true;
            const skeleton = this.cutCard.getComponent(sp.Skeleton);
            skeleton.timeScale = this.getSkeletonDuration(skeleton) / this.durationCutCard;
            const isCached = skeleton!.isAnimationCached();
            if (isCached) {
                skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
            } else {
                skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
            }
            skeleton.setCompleteListener(async () => {
                this.cardsBox.parent.active = true;
                this.cutCard.active = false;
                await this.handleShowBurnCard(cutCardValue);
                await this.flyAllCards(formatData, 1, () => {
                    this.openAllCards();
                });
            });
        } else if (duration >= TimeShowAnim.burnCard && duration < TimeShowAnim.full) {
            await this.handleShowBurnCard(cutCardValue);
            await this.flyAllCards(formatData, this.durationPrepareOpenCards, () => {
                this.openAllCards();
            });
        } else {
            await this.handleShowBurnCard(cutCardValue, false);
            formatData.forEach((data: Chain, index: number) => {
                this.createCardsBurn(this.cardPrefab, index, data.card, (card: cc.Node, cardData: CardModel) => {
                    const cardComponent = card.children[0].getComponent(BlockchainCard);
                    cardComponent.setCardOldStyle(cardData);
                    cardComponent.faceUp();
                });
            });
        }
    }

    async handleShowBurnCard(cardData: CardModel, isAnimation = true) {
        const card = cc.instantiate(this.cardPrefab);
        this.burnCard.removeAllChildren(true);
        this.centerCard.removeAllChildren(true);

        if (isAnimation) {
            this.centerCard.addChild(card);
            this.centerCard.children[0].opacity = 0;
            await this.handleFlyCard(this.centerCard.children[0], this.durationFlyCardBurn, this.cardsBox, cardData);
        } else {
            this.burnCard.addChild(card);
            const cardComponent = card.getComponent(BlockchainCard);
            cardComponent.setCardOldStyle(cardData);
            cardComponent.faceUp();
        }
    }

    handleDropCards() {
        this.dropCards(this.burnCard.children[0], this.cardsDrop, 0.6, this.durationDropCards);
        this.dropCards(this.centerCard.children[0], this.cardsDrop, 0.6, this.durationDropCards);
        this.containerBurnCards.children.forEach((card) => {
            this.dropCards(card?.children?.[0], this.cardsDrop, 0.6, this.durationDropCards);
        });
    }

    private handleFlyCard(card: cc.Node, duration: number, start: cc.Node, cardData: CardModel): Promise<void> {
        const cardComponent = card.getComponent(BlockchainCard);
        return new Promise((resolve) => {
            this.cardCenterTween = cc
                .tween(card)
                .call(() => {
                    cardComponent.setCardOldStyle(cardData);
                    this.actionCardFly({
                        card: card,
                        start
                    });
                    cardComponent.playAnimation(CardAnimation.DealerOpenCard, this.durationFlyOpenCard);
                })
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    }

    private flyAllCards(formatData: Chain[], duration: number, callbackOpenCards: () => void) {
        const prefabCard = this.cardPrefab;
        return new Promise<void>((resolve) => {
            this.allCardsFlyTween = cc
                .tween(this)
                .call(() => {
                    this.centerCard.children[0].runAction(
                        cc.moveTo(this.durationFlyCard, cc.v2(this.burnCard.x, this.burnCard.y)).easing(cc.easeInOut(2))
                    );
                })
                .call(() => {
                    formatData.forEach((data: Chain, index: number) => {
                        this.createCardsBurn(prefabCard, index, data.card, (card: cc.Node) => {
                            card.children[0].opacity = 0;
                            this.actionCardFly({ card: card.children[0], start: this.cardsBox });
                        });
                    });
                })
                .delay(duration)
                .call(() => {
                    callbackOpenCards();
                })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    private actionCardFly({ card, start, scale = 1 }: { card: cc.Node; start: cc.Node; scale?: number }) {
        const convertCardBox: cc.Vec3 = cc.v3(card.parent.convertToNodeSpaceAR(start.convertToWorldSpaceAR(cc.v2(0, 0))));
        const cardPosition = card.position;
        card.position = convertCardBox;
        card.opacity = 255;
        card.runAction(
            cc.spawn(
                cc.rotateTo(this.durationFlyCard, 0).easing(cc.easeInOut(2)),
                cc.scaleTo(this.durationFlyCard, scale).easing(cc.easeInOut(2)),
                cc.moveTo(this.durationFlyCard, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2))
            )
        );
    }

    private dropCards(card: cc.Node, cardsDrop: cc.Node, durationJumpToBoxCard: number, duration: number): Promise<void> {
        return (
            card &&
            new Promise<void>((resolve) => {
                const worldPosition = cardsDrop.convertToWorldSpaceAR(cc.v2(0, 0));
                const destPosition = card.parent.convertToNodeSpaceAR(worldPosition);
                const cardComponent: BlockchainCard = card.getComponent(BlockchainCard);
                cardComponent.setStatusInfoTag(false);
                const dropTween = cc
                    .tween(card)
                    .call(() => {
                        cardComponent.playAnimation(CardAnimation.DropCard, 0.6);
                    })
                    .then(cc.jumpTo(durationJumpToBoxCard, destPosition, 250, 1))
                    .call(() => {
                        card.opacity = 0;
                    })
                    .delay(duration)
                    .call(() => {
                        resolve();
                    })
                    .start();

                this.allCardsDropTween.push(dropTween);
            })
        );
    }

    private openAllCards() {
        this.containerBurnCards.children.forEach((card) => {
            card?.children[0]?.getComponent(BlockchainCard)?.playAnimation(CardAnimation.DealerOpenCard, this.durationFlyOpenCard);
        });
    }

    private getSkeletonDuration(skeleton: sp.Skeleton) {
        return skeleton.findAnimation(skeleton.defaultAnimation).duration;
    }

    private createCardsBurn(
        prefabCard: cc.Prefab,
        index: number,
        cardData: CardModel,
        callback: (card: cc.Node, cardData?: CardModel) => void
    ) {
        const cardPrefab = cc.instantiate(prefabCard);
        const card = this.containerBurnCards.children[index];
        card.removeAllChildren();
        card.addChild(cardPrefab);
        const cardComponent = card.children[0].getComponent(BlockchainCard);
        cardComponent.setCardOldStyle(cardData);
        cardComponent.setIndexNumber(index);
        cardComponent.setCardVerification(this.cardVerification);
        callback(card, cardData);
    }
}
