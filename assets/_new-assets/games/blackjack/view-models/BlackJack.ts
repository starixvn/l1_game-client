import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import NewCard, { CardAnimation, CardModel } from "../../../common/new-card/view-models/NewCard";
import { games } from "../../../SabaConfigs";
import DataHandler from "../../_base/handlers/DataHandler";
import GameBaseBetHandler from "../../_base/handlers/GameBaseBetHandler";
import GameBaseConfigsHandler from "../../_base/handlers/GameBaseConfigsHandler";
import GameBaseErrorHandler from "../../_base/handlers/GameBaseErrorHandler";
import GameBaseNoticeHandler from "../../_base/handlers/GameBaseNoticeHandler";
import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmHandler";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import RoomPlayer from "../../_base/RoomPlayer";
import BlackJackFinishHandler from "./handlers/BlackJackFinishHandler";
import BlackJackIngameHandler from "./handlers/BlackJackIngameHandler";
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
    cardDropPlace: cc.Node = null;

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
    ingameHander: DataHandler;
    activeHand: HandPlace = null;
    lastHandBets: any[] = [];

    public chipOption = [1000, 500, 200, 100, 50, 10, 5, 1];
    public configDuration = {
        drawingCardDelay: 0.7,
        delaySwitchHand: 1,
    }
    private priorityHands = [];
    private roundFinished = false;

    constructor() {
        super();
        this.init("BlackJack", null, null, 1, games.BlackJack.id);
    }

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
        cc.RedT.send({ scene: this.gameName });
        this.socket.emit("inGame");
    }

    stopGame() {
        // this.gameState = GameState.Stopped;
        // this.clearIntervalAndTimeout();
        // this.resetDataAndUI();
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
        this.betHandler = new GameBaseBetHandler(this);

        this.dealHander = new DealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new BlackJackFinishHandler(this);
        this.ingameHander = new BlackJackIngameHandler(this);

        this.addHandlers(
            this.umHandler,
            this.noticeHandler,
            this.betHandler,
            this.errorHandler,
            this.configsHandler,
            this.finishHandler,
            this.dealHander,
            this.ingameActionHander,
            this.ingameHander,
        );
    }

    initHandPlaces() {
        const chipFlyingDuration = 0.5;
        this.handPlaces.forEach((handPlace, index) => {
            handPlace.betItemClickCallback = () => {
                cc.RedT.audio.playClick();
                if (!this.priorityHands.includes(index)) {
                    this.priorityHands.push(index);
                }
                this.dealButton.active = true;
                this.clearButton.active = true;

                this.handPlaces.forEach(place => place.highlightPlace(false));
                handPlace.highlightPlace(true);
                const chipNode = this.betChips.createChip(this.currentBet).node;
                const destNode = this.chipContainers[index];
                handPlace.addBetAmount(this.currentBet);
                this.betChips.moveChipWithCallback(chipNode, this.currentBet, destNode, null, () => {
                    handPlace.updateDisplayBetValue();
                    handPlace.clearBetButton.active = true;
                    destNode.destroyAllChildren();
                    const chipStack = this.betChips.createChipStack(handPlace.getBetAmount(), this.chipOption);
                    chipStack.zIndex = -1;
                    destNode.addChild(chipStack);
                }, 0, chipFlyingDuration, 0);
            }
            handPlace.clearBetClickCallback = () => {
                this.chipContainers[index].destroyAllChildren();
                const location = this.priorityHands.indexOf(index);
                if (location > -1) {
                    this.priorityHands.splice(location, 1);
                }

                const existChip = this.checkExistChipOnTable()
                this.dealButton.active = existChip;
                this.clearButton.active = existChip;
            }
        })
    }

    checkExistChipOnTable(): boolean {
        return this.handPlaces.find(place => place.getBetAmount() > 0) != undefined;
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
        const cardScaleY = this.dealerHand.cardLayout.getScaleY();
        cardNode.position = startLocalPos;

        const pullDuration = 0.2;
        const moveDuration = 0.45;
        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
        cc.tween(cardNode)
            .delay(pullDuration)
            .call(() => {
                cardComponent.playAnimation(CardAnimation.DealerToHand, moveDuration);
            })
            .to(moveDuration, { position: nextPosition, scaleY: cardScaleY })
            .call(() => {
                handPlace.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    drawingCardToDealer(card: CardModel, faceDown: boolean, onComplete = () => { }) {
        const cardNode = this.createCard(card);
        this.dealerHand.addCard(cardNode);

        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = this.dealerHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = this.dealerHand.cardLayout.getNextPosition();
        const cardScaleY = this.dealerHand.cardLayout.getScaleY();
        cardNode.position = startLocalPos;

        const pullDuration = 0.2;
        const moveDuration = 0.45;
        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
        cc.tween(cardNode)
            .delay(pullDuration)
            .call(() => cardComponent.playAnimation(faceDown ? CardAnimation.DealerDrawingFaceDown : CardAnimation.DealerToHand, moveDuration))
            .to(moveDuration, { position: nextPosition, scaleY: cardScaleY })
            .call(() => {
                // this.dealerHand.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    dealerOpenSecondCard(card: CardModel, duration: number) {
        const cardNode = this.dealerHand.getCards()[1];
        const cardComponent = cardNode.getComponent(NewCard);
        cardComponent.setCard(card);
        cardComponent.playAnimation(CardAnimation.DealerOpenCard, duration);
    }

    finishRound() {
        if (!this.roundFinished) {
            return;
        }
        const finishHandler = this.finishHandler as BlackJackFinishHandler;
        if (!finishHandler.finishDataCache) {
            return;
        }
        finishHandler.processFinish();
    }

    startRound() {
        this.switchToNextHand();
    }

    switchToNextHand() {
        console.log("switchToNextHand ====================");
        const sortIndices = [0, 3, 1, 4, 2, 5];
        const places = sortIndices.map(i => this.handPlaces[i])
        const nextHand = places.find(hand => hand.isActive && !hand.isStand);
        if (nextHand) {
            this.activeHand = nextHand;
            nextHand.selected = true;
        } else {
            this.switchToDealer();
        }
        this.updateAvailableActions();
    }

    switchToDealer() {
        console.log("switchToDealer ====================");
        this.roundFinished = true;
        this.finishRound();
    }

    canSendRequest(): boolean {
        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return false;
        } else {
            this.waitingProcessing = true;
            return true;
        }
    }

    onDealClick() {
        cc.RedT.audio.playClick();

        if (!this.canSendRequest()) {
            return;
        }

        const hands = [];

        this.priorityHands.forEach(i => {
            const betAmount = this.handPlaces[i].getBetAmount()
            if (betAmount > 0) {
                hands.push({ pos: i + 1, bet: betAmount })
            }
        });

        this.lastHandBets = hands;
        console.log("deal hands   ", hands);
        this.rebet();
    }

    rebet() {
        const data = {
            deal: {
                hands: this.lastHandBets
            }
        };
        this.socket && this.socket.emit("bet", data);
    }

    onSplitClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            split: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onDoubleClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            double: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onStandClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            stand: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onHitClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            hit: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onNewBetClick() {
        cc.RedT.audio.playClick();
        this.collectCardsOnTable();
    }

    collectCardsOnTable(complete = () => { }) {
        this.newGame();
        const worldPositon = this.cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));

        let count = 0;
        this.handPlaces.forEach(place => {
            const cardNodes = place.getCards();
            if (cardNodes.length === 0) {
                return;
            }

            count++;
            const destPosition = cardNodes[0].parent.convertToNodeSpaceAR(worldPositon);
            cardNodes.forEach(cardNode => {
                const cardComponent = cardNode.getComponent(NewCard);
                cardComponent.playAnimation(CardAnimation.DropCard, 1);

                cc.tween(cardNode)
                    .to(0.3, { position: cc.v2(0, 0) })
                    .delay(0.1 + count * 0.05)
                    .to(0.7, { position: destPosition })
                    .delay(0.2)
                    .call(() => cardNode.destroy())
                    .start();
            })
        });

        const dealerCardsNodes = this.dealerHand.getCards();
        const destPosition = dealerCardsNodes[0].parent.convertToNodeSpaceAR(worldPositon);
        dealerCardsNodes.forEach(cardNode => {
            const cardComponent = cardNode.getComponent(NewCard);
            cardComponent.playAnimation(CardAnimation.DropCard, 1);

            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .delay(0.1 + count * 0.05)
                .to(0.5, { position: destPosition })
                .delay(0.2)
                .call(() => cardNode.destroy())
                .start();
        });

        cc.tween(this.node)
            .delay(1)
            .call(() => complete())
            .start();
    }

    onRebetClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        this.collectCardsOnTable(() => {
            let total = 0;
            this.lastHandBets.forEach(hand => total += hand.bet);
            if (total > cc.RedT.user.red) {
                this.showMiniWarning("Bạn hiện không có đủ tiền để cược.");
                return;
            }

            this.rebet();
        });
    }

    onClearClick() {
        cc.RedT.audio.playClick();
        this.handPlaces.forEach(place => place.onClearBetClick());
    }

    onLobbyClick() {
        cc.RedT.audio.playClick();

        this.closeGame();
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

    newGame() {
        this.hideAllButtons();
        this.handPlaces.forEach(place => {
            place.onClearBetClick();
            place.enablePlaceChip(true);
        });
        this.handPlaces[1].highlightPlace(true);
        this.dealerHand.resetView();
        this.roundFinished = false;
        (this.finishHandler as BlackJackFinishHandler).clearCache();
    }

    updateAvailableActions() {
        this.hideAllButtons();

        this.hitButton.active = this.standButton.active = !this.activeHand.isStand;
        this.doubleButton.active = this.activeHand.canDouble && !this.activeHand.isStand;
        this.smallSplitButton.active = !this.activeHand.isStand && this.activeHand.canSplit && this.doubleButton.active;
        this.bigSplitButton.active = !this.activeHand.isStand && this.activeHand.canSplit && !this.doubleButton.active;
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
                    // {
                    //     id: 22,
                    //     pos: 2,
                    //     isStand: false,
                    //     bet: 1,
                    //     cards: [
                    //         { rank: "K", suit: 2 },
                    //         { rank: "A", suit: 3 }
                    //     ],
                    //     total: 5,
                    // }
                    // ,
                    // {
                    //     id: 23,
                    //     pos: 3,
                    //     isStand: false,
                    //     bet: 1,
                    //     cards: [
                    //         { rank: 8, suit: 2 },
                    //         { rank: 5, suit: 3 }
                    //     ],
                    //     total: 5,
                    // }
                ]
            }
        };
        this.dealHander.handle(data);
        this.testFinish();
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

    testFinish() {
        const data = {
            finish:
            {
                results: [
                    { rank: 10, suit: 1 },
                    { rank: 3, suit: 1 },
                    { rank: 5, suit: 1 },
                    { rank: 9, suit: 1 },
                ],
                settlementResult: 18,
                winningHands: [
                    {
                        id: 1,
                        betwin: 10,
                    },
                    {
                        id: 4,
                        betwin: 10,
                    }
                ]
            }
        }
        this.finishHandler.handle(data);
    }
}
