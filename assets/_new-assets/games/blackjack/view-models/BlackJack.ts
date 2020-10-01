import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import NewCard, { CardAnimation, CardModel } from "../../../common/new-card/view-models/NewCard";
import DataHandler from "../../_base/handlers/DataHandler";
import GameBaseConfigsHandler from "../../_base/handlers/GameBaseConfigsHandler";
import GameBaseErrorHandler from "../../_base/handlers/GameBaseErrorHandler";
import GameBaseNoticeHandler from "../../_base/handlers/GameBaseNoticeHandler";
import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmHandler";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import RoomPlayer from "../../_base/RoomPlayer";
import DealHandler from "./handlers/DealHandler";
import IngameActionHandler from "./handlers/IngameActionHandler";
import HandPlace from "./HandPlace";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlackJack extends NewSocketGameBase {

    @property({ type: cc.Node, visible: false, override: true })
    timeWaitNode: cc.Node = null;

    @property({ type: cc.Label, visible: false, override: true })
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime, visible: false, override: true })
    animatedTime: AnimatedTime = null;

    @property({ type: cc.Label, visible: false, override: true })
    gameRound: cc.Label = null;

    @property({ type: RoomPlayer, visible: false, override: true })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node, visible: false, override: true })
    otherPlayers: cc.Node = null;

    @property({ type: HandPlace })
    handPlaces: HandPlace[] = [];

    @property(HandPlace)
    dealerHand: HandPlace = null;

    @property({ type: cc.Node })
    chipContainers: cc.Node[] = [];

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardBox: cc.Node = null;

    @property(cc.Node)
    smallSplitButton: cc.Node = null;

    @property(cc.Node)
    bigSplitButton: cc.Node = null;

    @property(cc.Node)
    doubleButton: cc.Node = null;

    @property(cc.Node)
    standButton: cc.Node = null;

    @property(cc.Node)
    hitButton: cc.Node = null;

    @property(cc.Node)
    newBetButton: cc.Node = null;

    @property(cc.Node)
    rebetButton: cc.Node = null;

    @property(cc.Node)
    clearButton: cc.Node = null;

    @property(cc.Node)
    dealButton: cc.Node = null;

    dealHander: DataHandler;
    ingameActionHander: DataHandler;
    activeHand: HandPlace = null;

    onLoad() {
        super.onLoad();
        this.initHandPlaces();
        this.hideAllButtons();
    }

    onEnable() {

    }

    onDisable() {

    }

    start() {
        // cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }

    protected onGameHide() {
    }

    protected initGameAudios() {
    }

    setGameRound(gameRoundId) {
    }

    setUpHandlers() {
        this.umHandler = new GameBaseUmDataHandler(this);
        this.noticeHandler = new GameBaseNoticeHandler(this);
        this.errorHandler = new GameBaseErrorHandler(this);
        this.configsHandler = new GameBaseConfigsHandler(this);

        this.dealHander = new DealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);

        this.addHandlers(
            this.umHandler,
            this.noticeHandler,
            this.errorHandler,
            this.configsHandler,
            this.dealHander,
            this.ingameActionHander
        );
    }

    initHandPlaces() {
        const chipFlyingDuration = 0.5;
        const chipOption = [1000, 500, 200, 100, 50, 10, 5, 1];
        this.handPlaces.forEach((handPlace, index) => {
            handPlace.betItemClickCallback = () => {
                // cc.RedT.audio.playClick();

                const chipNode = this.betChips.createChip(this.currentBet).node;
                const destNode = this.chipContainers[index];
                this.betChips.moveChipWithCallback(chipNode, this.currentBet, destNode, null, () => {
                    handPlace.addBetAmount(this.currentBet);
                    handPlace.clearBetButton.active = true;
                    destNode.getChildByName("stack")?.destroy();
                    const chipStack = this.betChips.createChipStack(handPlace.getBetAmount(), chipOption);
                    chipStack.name = "stack";
                    chipStack.zIndex = -1;
                    destNode.addChild(chipStack);
                }, 0, chipFlyingDuration, 0);
            }
            handPlace.clearBetClickCallback = () => {
                handPlace.clearBetAmount();
                this.chipContainers[index].destroyAllChildren();
            }
        })
    }

    createCard(card: CardModel): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(NewCard);
        cardComponent.setCard(card);
        return node;
    }

    drawingCardToPlayer(card: CardModel, pos: number, onComplete = () => { }) {
        const cardNode = this.createCard(card);
        const handPlace = this.handPlaces[pos];
        handPlace.addCard(cardNode);

        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = handPlace.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = handPlace.cardLayout.getNextPosition();
        cardNode.position = startLocalPos;

        const duration = 0.45;
        cardComponent.playAnimation(CardAnimation.DealerToHand, duration);

        cc.tween(cardNode)
            .to(duration, { position: nextPosition })
            .call(() => {
                handPlace.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    drawingCardToDealer(card: CardModel, onComplete = () => { }) {
        const cardNode = this.createCard(card);
        this.dealerHand.addCard(cardNode);

        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = this.dealerHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = this.dealerHand.cardLayout.getNextPosition();
        cardNode.position = startLocalPos;

        const duration = 0.45;
        cardComponent.playAnimation(CardAnimation.DealerToHand, duration);

        cc.tween(cardNode)
            .to(duration, { position: nextPosition })
            .call(() => {
                this.dealerHand.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    startRound() {
        this.switchToNextHand();
    }

    switchToNextHand() {
        console.log("switchToNextHand ====================");
        const nextHand = this.handPlaces.find(hand => hand.isActive && !hand.isStand);
        if (nextHand) {
            nextHand.selected = true;
        } else {
            this.switchToDealer();
        }
    }

    switchToDealer() {
        console.log("switchToDealer ====================");
    }

    onDealClick() {
        cc.RedT.audio.playClick();
    }

    onSplitClick() {
        cc.RedT.audio.playClick();

    }

    onDoubleClick() {
        cc.RedT.audio.playClick();
    }

    onStandClick() {
        cc.RedT.audio.playClick();
    }

    onHitClick() {
        cc.RedT.audio.playClick();

    }

    onNewBetClick() {
        cc.RedT.audio.playClick();
    }

    onRebetClick() {
        cc.RedT.audio.playClick();
    }

    onClearClick() {
        cc.RedT.audio.playClick();
    }

    onLobbyClick() {
        cc.RedT.audio.playClick();
    }

    onHistoryClick() {
        cc.RedT.audio.playClick();
    }

    onGuideClick() {
        cc.RedT.audio.playClick();
    }

    hideAllButtons() {
        this.smallSplitButton.active = false;
        this.bigSplitButton.active = false;
        this.doubleButton.active = false;
        this.standButton.active = false;
        this.hitButton.active = false;
        this.newBetButton.active = false;
        this.rebetButton.active = false;
        this.clearButton.active = false;
        this.dealButton.active = false;
    }

    testDealer() {
        const data = {
            deal: {
                roundId: 1,
                totalAmount: 10,
                uid: "fasdaaaa",
                memberId: 14247,
                dealer: [{ rank: "A", suit: 1 }],
                hands: [
                    {
                        id: 1,
                        pos: 1,
                        isStand: false,
                        bet: 1,
                        cards: [
                            { rank: 2, suit: 0 },
                            { rank: 2, suit: 1 }
                        ],
                        total: 5,
                    },

                    {
                        id: 1,
                        pos: 2,
                        isStand: false,
                        bet: 1,
                        cards: [
                            { rank: "K", suit: 2 },
                            { rank: "A", suit: 3 }
                        ],
                        total: 5,
                    }
                ]
            }
        };
        this.dealHander.handle(data);
    }

    testHit() {
        const data = {
            hit:
            {
                id: 1,
                pos: 1,
                bet: 10,
                betwin: 0,
                cards: [
                    { rank: 2, suit: 1 },
                    { rank: 3, suit: 1 },
                    { rank: 6, suit: 1 }
                ],
                newCard: { rank: 6, suit: 1 },
                total: [11],
                isStand: false
            }
        }
        this.ingameActionHander.handle(data);
    }

    testDouble() {
        const data = {
            double:
            {
                id: 1,
                pos: 1,
                bet: 10,
                betwin: 0,
                cards: [
                    { rank: 2, suit: 1 },
                    { rank: 3, suit: 1 },
                    { rank: 6, suit: 1 }
                ],
                newCard: { rank: 6, suit: 1 },
                total: [11],
                isStand: true
            }
        }
        this.ingameActionHander.handle(data);
    }

    testSplit() {
        const data = {
            split:
            {
                data: {
                    hands: [
                        {
                            id: 1,
                            pos: 1,
                            bet: 10,
                            betwin: 0,
                            cards: [
                                { rank: 2, suit: 1 },
                                { rank: 10, suit: 1 },
                            ],
                            total: [11],
                            isStand: false
                        },
                        {
                            id: 4,
                            pos: 4,
                            bet: 10,
                            betwin: 0,
                            cards: [
                                { rank: 2, suit: 1 },
                                { rank: 7, suit: 1 },
                            ],
                            splitFrom: 1,
                            total: [11],
                            isStand: false
                        }
                    ]
                },
                endBet: 10
            }
        }
        this.ingameActionHander.handle(data);
    }

}
