import * as i18n from "i18n/runtime-scripts/LanguageData";

import { lazyInject } from "../../../Application";
import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import AudioManager from "../../../common/audio/AudioManager";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import FadeEffectButton from "../../../common/custom-button/FadeEffectButton";
import NewButton from "../../../common/custom-button/NewButton";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NewCard, { CardAnimation, CardModel } from "../../../common/new-card/view-models/NewCard";
import { userManager } from "../../../common/user/UserManager";
import { GameState } from "../../_base/GameState";
import DataHandler from "../../_base/handlers/DataHandler";
import GameBaseConfigsHandler from "../../_base/handlers/GameBaseConfigsHandler";
import GameBaseErrorHandler from "../../_base/handlers/GameBaseErrorHandler";
import GameBaseNoticeHandler from "../../_base/handlers/GameBaseNoticeHandler";
import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import GameBaseVoidTicketDataHandler from "../../_base/handlers/GameBaseVoidTicketHandler";
import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";
import RoomPlayer from "../../_base/view-models/RoomPlayer";
import BlackJackConfig from "./BlackJackConfig";
import BlackJackHistory from "./BlackJackHistory";
import BlackJackUtils from "./BlackJackUtils";
import BlackJackBetHandler from "./handlers/BlackJackBetHandler";
import BlackJackFinishHandler from "./handlers/BlackJackFinishHandler";
import BlackJackIngameHandler from "./handlers/BlackJackIngameHandler";
import DealHandler from "./handlers/DealHandler";
import IngameActionHandler from "./handlers/IngameActionHandler";
import HandPlace from "./HandPlace";

const { ccclass, property } = cc._decorator;

export const BlackJackId = 23;

export enum BlackJackActionType {
    START_ROUND = 0,
    IN_ROUND,
    END_ROUND,
    ERROR
}
@ccclass
export default class BlackJack extends SocketIOTableGameBase {
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
    dealerChipTray: cc.Node = null;

    @property(cc.Node)
    splitButton: cc.Node = null;

    @property(cc.Node)
    doubleButton: cc.Node = null;

    @property(cc.Node)
    standButton: cc.Node = null;

    @property(cc.Node)
    hitButton: cc.Node = null;

    @property(cc.Node)
    newBetButton: cc.Node = null;

    @property(cc.Node)
    rebetAndDealButton: cc.Node = null;

    @property(cc.Node)
    clearButton: cc.Node = null;

    @property(cc.Node)
    dealButton: cc.Node = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(cc.Label)
    minBetLabel: cc.Label = null;

    @property(cc.Label)
    maxBetLabel: cc.Label = null;

    @property(cc.Label)
    blackjackOddLabel: cc.Label = null;

    @property(cc.Prefab)
    blackjackHistory: cc.Prefab = null;

    @property(cc.SpriteFrame)
    shadowChip: cc.SpriteFrame = null;

    @property(cc.AudioSource)
    cardSlideAudioSource: cc.AudioSource = null;

    @property(cc.AudioSource)
    gameNotificationsAudio: cc.AudioSource = null;

    @property(cc.AudioSource)
    singleChipAudio: cc.AudioSource = null;

    @property(cc.Node)
    bottomBetChipsPos: cc.Node = null;

    @lazyInject(BlackJackConfig)
    private readonly blackJackConfig: BlackJackConfig;

    dealHander: DataHandler;
    ingameActionHander: DataHandler;
    ingameHander: DataHandler;
    activeHand: HandPlace = null;
    lastHandBets: any[] = [];
    audioNotificationInterval: any;

    public configDuration = {
        drawingCardDelay: 0.7,
        delaySwitchHand: 1
    };
    private readonly priorityHands = [];
    private roundFinished = false;
    private betChipsPostion;

    constructor() {
        super();
        this.gameId = BlackJackId;
    }

    onLoad() {
        super.onLoad();
        this.betChipsPostion = this.betChipsContainer.parent.position;
        this.initHandPlaces();
        this.hideAllButtons();
        this.totalBetLabel.string = "";
        this.splitButton.getComponent(NewButton).callback.selected = () => this.onSplitClick();
        this.doubleButton.getComponent(NewButton).callback.selected = () => this.onDoubleClick();
        this.standButton.getComponent(NewButton).callback.selected = () => this.onStandClick();
        this.hitButton.getComponent(NewButton).callback.selected = () => this.onHitClick();
        this.newBetButton.getComponent(NewButton).callback.selected = () => this.onNewBetClick();
        this.rebetAndDealButton.getComponent(NewButton).callback.selected = () => this.onRebetClick();
        this.clearButton.getComponent(NewButton).callback.selected = () => this.onClearClick();
        this.dealButton.getComponent(NewButton).callback.selected = () => this.onDealClick();
    }

    onDestroy() {
        super.onDestroy();
        this.stopIntervalReminder();
    }

    override stopGame() {}

    disableGame() {
        this.gameState = GameState.Disabled;
    }

    protected onGameHide() {}

    setGameRound(gameRoundId) {}

    checkShowUmMessage(data: any) {
        return true;
    }

    setUpHandlers() {
        this.umHandler = new GameBaseUmDataHandler(this);
        this.noticeHandler = new GameBaseNoticeHandler(this);
        this.errorHandler = new GameBaseErrorHandler(this);
        this.configsHandler = new GameBaseConfigsHandler(this);
        this.betHandler = new BlackJackBetHandler(this);
        this.voidTicketHandler = new GameBaseVoidTicketDataHandler(this);

        this.setupSpecialHandler();

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
            this.voidTicketHandler
        );
    }

    setupSpecialHandler() {
        this.dealHander = new DealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new BlackJackFinishHandler(this);
        this.ingameHander = new BlackJackIngameHandler(this);
    }

    getCurrentTotalAmount(): number {
        let total = 0;
        this.handPlaces.forEach((place) => {
            total += place.getBetAmount();
        });
        return total;
    }

    updateTotalBetLabel() {
        const total = this.getCurrentTotalAmount();
        this.totalBetLabel.string = numberWithCommas(total);
    }

    initHandPlaces() {
        const chipFlyingDuration = 0.5;
        this.handPlaces.forEach((handPlace, index) => {
            handPlace.betItemClickCallback = () => {
                if (this.waitingProcessing) {
                    return;
                }

                this.handPlaces.forEach((place) => place.highlightPlace(false));
                handPlace.highlightPlace(true);

                const maxBet = this.getMaxBet();
                if (handPlace.getBetAmount() + this.currentBet > maxBet) {
                    this.showMiniWarning(i18n.t("messages.maxStakeHand", { maxBet: numberWithCommas(maxBet) }));
                    return;
                }

                if (this.getCurrentTotalAmount() + this.currentBet > userManager.balance) {
                    this.showMiniWarning(i18n.t("messages.notEnoughMoney"));
                    return;
                }

                this.playSingleChipsSound();

                handPlace.showBetText(false);

                if (!this.priorityHands.includes(index)) {
                    this.priorityHands.push(index);
                }
                this.dealButton.getComponent(FadeEffectButton).setActive();
                this.clearButton.getComponent(FadeEffectButton).setActive();
                handPlace.addBetAmount(this.currentBet);

                const chipNode = this.betChips.createBigChip(this.currentBet);
                const destNode = this.chipContainers[index];
                const startNode = this.betChips.getChipNode(this.currentBet);
                chipNode.position = destNode.convertToNodeSpaceAR(startNode.convertToWorldSpaceAR(cc.v3(0, 0)));
                destNode.addChild(chipNode);

                let destPosition = cc.v2(0, 0);
                destPosition = this.handleDestPosition(destNode, destPosition);

                chipNode.runAction(
                    cc.sequence(
                        cc.jumpTo(chipFlyingDuration, destPosition, 150, 1),
                        cc.callFunc(() => {
                            handPlace.updateDisplayBetValue();
                            handPlace.clearBetButton.active = true;
                            destNode.destroyAllChildren();
                            const chipStack = BlackJackUtils.createChipStack(
                                handPlace.getBetAmount(),
                                this.betChips,
                                this.shadowChip,
                                destNode.skewX
                            );
                            chipStack.zIndex = -1;
                            destNode.addChild(chipStack);
                            this.updateTotalBetLabel();
                        })
                    )
                );
            };
            handPlace.clearBetClickCallback = (checkExistChip) => {
                handPlace.showBetText(true);
                this.chipContainers[index].destroyAllChildren();
                const location = this.priorityHands.indexOf(index);
                if (location > -1) {
                    this.priorityHands.splice(location, 1);
                }

                checkExistChip && this.checkExistChipOnTable();
            };
        });
    }

    handleDestPosition(destNode: any, destPosition: any) {
        if (destNode.childrenCount > 0) {
            const stack = destNode.children[0].getComponent(ChipStack);
            if (stack) {
                destPosition = cc.v2(0, stack.getCurrentHeight());
            }
        }

        return destPosition;
    }

    checkExistChipOnTable() {
        const existChip = this.handPlaces.find((place) => place.getBetAmount() > 0) !== undefined;
        this.dealButton.getComponent(FadeEffectButton).setActive(existChip);
        this.clearButton.getComponent(FadeEffectButton).setActive(existChip);
        this.updateTotalBetLabel();
    }

    createCard(card: CardModel): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(NewCard);
        cardComponent.setCard(card);
        return node;
    }

    playAudioCardSliding() {
        AudioManager.getInstance().playSFX(this.cardSlideAudioSource.clip);
    }

    drawingCardToPlayer(card: CardModel, pos: number, onComplete = () => {}) {
        const cardNode = this.createCard(card);
        const handPlace = this.handPlaces[pos];
        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = handPlace.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = handPlace.cardLayout.getNextPosition();
        const rotationX = handPlace.selected ? this.dealerHand.cardLayout.selectedRotationX : 0;
        const scaleY = handPlace.selected ? 1.15 : 1;
        cardNode.position = cc.v3(startLocalPos.x, startLocalPos.y, 0);
        handPlace.addCard(cardNode);

        const pullDuration = 0.2;
        const moveDuration = 0.45;
        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
        cc.tween(cardNode)
            .delay(pullDuration)
            .call(() => {
                this.playAudioCardSliding();
                cardComponent.playAnimation(CardAnimation.DealerToHand, moveDuration);
            })
            .to(moveDuration, { position: nextPosition, rotationX: rotationX, scaleY: scaleY }, { easing: "easeOut" })
            .call(() => {
                handPlace.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    drawingCardToDealer(card: CardModel, faceDown: boolean, onComplete = () => {}) {
        const cardNode = this.createCard(card);
        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = this.dealerHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = this.dealerHand.cardLayout.getNextPosition();
        const rotationX = 0;
        cardNode.position = cc.v3(startLocalPos.x, startLocalPos.y, 0);
        this.dealerHand.addCard(cardNode);

        const pullDuration = 0.2;
        const moveDuration = 0.45;
        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
        cc.tween(cardNode)
            .delay(pullDuration)
            .call(() => {
                this.playAudioCardSliding();
                cardComponent.playAnimation(faceDown ? CardAnimation.DealerDrawingFaceDown : CardAnimation.DealerToHand, moveDuration);
            })
            .to(moveDuration, { position: nextPosition, rotationX: rotationX }, { easing: "easeOut" })
            .call(() => {
                onComplete();
            })
            .start();
    }

    dealerOpenFirstCard(card: CardModel, duration: number) {
        // override
    }

    dealerOpenSecondCard(card: CardModel, duration: number) {
        this.dealerOpenCard(card, duration, 1);
    }

    dealerOpenCard(card: CardModel, duration: number, order: number) {
        const cardNode = this.dealerHand.getCards()[order];
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
        const sortIndices = [0, 3, 1, 4, 2, 5];
        const places = sortIndices.map((i) => this.handPlaces[i]);
        const nextHand = places.find((hand) => hand.isActive && !hand.isStand);
        if (nextHand) {
            if (this.activeHand !== nextHand) {
                if (this.activeHand) {
                    this.activeHand.selected = false;
                }
                this.activeHand = nextHand;
            }
            nextHand.selected = true;
            this.showActionsWithBehavior(BlackJackActionType.IN_ROUND);
        } else {
            this.switchToDealer();
            this.inRoundActionVisibility(false);
        }

        this.updateAvailableActions();
    }

    switchToDealer() {
        this.roundFinished = true;
        this.finishRound();
    }

    canSendRequest(): boolean {
        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return false;
        } else {
            this.lockBet();
            return true;
        }
    }

    onDealClick() {
        AudioManager.getInstance().playClick();
        if (!this.canSendRequest()) {
            return;
        }

        this.handPlaces.forEach((place) => {
            place.showClearBetButton(false);
        });

        const hands = [];

        this.priorityHands.forEach((i) => {
            const betAmount = this.handPlaces[i].getBetAmount();
            if (betAmount > 0) {
                hands.push({ pos: i + 1, bet: betAmount });
            }
        });

        this.lastHandBets = hands;
        this.rebet();
        this.slidingDownBetChip(true);
    }

    socketSendData(key: string, data: any) {
        if (data) {
            data.username = userManager.userName;
            this.setIntervalReminder();
        }

        if (this.socket && this.socket.connected) {
            if (data) {
                this.socket.emit(key, data);
            } else {
                this.socket.emit(key);
            }
        }
    }

    rebet() {
        const data = {
            deal: {
                hands: this.lastHandBets
            }
        };
        this.socketSendData("bet", data);
    }

    onSplitClick() {
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            split: {
                id: this.activeHand.idValue
            }
        };
        this.socketSendData("bet", data);
    }

    onDoubleClick() {
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            double: {
                id: this.activeHand.idValue
            }
        };
        this.socketSendData("bet", data);
    }

    onStandClick() {
        AudioManager.getInstance().playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            stand: {
                id: this.activeHand.idValue
            }
        };
        this.socketSendData("bet", data);
    }

    onHitClick() {
        AudioManager.getInstance().playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            hit: {
                id: this.activeHand.idValue
            }
        };
        this.socketSendData("bet", data);
    }

    onNewBetClick() {
        AudioManager.getInstance().playClick();
        this.collectCardsOnTable();
        this.slidingDownBetChip(false);
    }

    collectCardsOnTable(complete = () => {}) {
        this.newGame();
        const worldPositon = this.cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));

        let count = 0;
        const dealerCardsNodes = this.dealerHand.getCards();
        const destPosition = dealerCardsNodes[0].parent.convertToNodeSpaceAR(worldPositon);
        dealerCardsNodes.forEach((cardNode) => {
            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .delay(count * 0.05)
                .call(() => {
                    const cardComponent = cardNode.getComponent(NewCard);
                    cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                })
                .then(cc.jumpTo(0.5, destPosition, 250, 1))
                .delay(0.2)
                .call(() => cardNode.destroy())
                .start();
        });
        count++;
        this.handPlaces.forEach((place) => {
            const cardNodes = place.getCards();
            if (cardNodes.length === 0) {
                return;
            }

            count++;
            const destPos = cardNodes[0].parent.convertToNodeSpaceAR(worldPositon);
            cardNodes.forEach((cardNode) => {
                cc.tween(cardNode)
                    .to(0.3, { position: cc.v2(0, 0) })
                    .delay(count * 0.05)
                    .call(() => {
                        const cardComponent = cardNode.getComponent(NewCard);
                        cardComponent.playAnimation(CardAnimation.DropCard, 0.7);
                    })
                    .then(cc.jumpTo(0.7, destPos, 250, 1))
                    .delay(0.2)
                    .call(() => cardNode.destroy())
                    .start();
            });
        });

        cc.tween(this.node)
            .delay(1)
            .call(() => complete())
            .start();
    }

    onRebetClick() {
        if (!this.canSendRequest()) {
            return;
        }

        this.collectCardsOnTable(() => {
            let total = 0;
            this.lastHandBets.forEach((hand) => (total += hand.bet));
            if (total > userManager.balance) {
                this.showMiniWarning(i18n.t("messages.notEnoughMoney"));
                this.slidingDownBetChip(false);
                this.showProcessingWarning(false);

                return;
            }
            //restore chip value
            this.lastHandBets.forEach((hand) => {
                this.playSingleChipsSound();

                const chipStack = BlackJackUtils.createChipStack(
                    hand.bet,
                    this.betChips,
                    this.shadowChip,
                    this.chipContainers[hand.pos - 1].skewX
                );
                this.chipContainers[hand.pos - 1].addChild(chipStack);
                const place = this.handPlaces[hand.pos - 1];
                place.updateDisplayBetValue(hand.bet);
                place.showBetText(false);
            });
            this.updateTotalBetLabel();
            this.rebet();
        });
    }

    onClearClick() {
        if (this.waitingProcessing) {
            return;
        }
        AudioManager.getInstance().playClick();
        this.handPlaces.forEach((place) => place.onClearBetClick());
        this.slidingDownBetChip(false);
    }

    openHistory() {
        const history = cc.instantiate(this.blackjackHistory);
        this.historyComponent = history.getComponent(BlackJackHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(history);
    }

    hideAllButtons() {
        this.splitButton.getComponent(FadeEffectButton).setActive(false);
        this.doubleButton.getComponent(FadeEffectButton).setActive(false);
        this.standButton.getComponent(FadeEffectButton).setActive(false);
        this.hitButton.getComponent(FadeEffectButton).setActive(false);
        this.newBetButton.getComponent(FadeEffectButton).setActive(false);
        this.rebetAndDealButton.getComponent(FadeEffectButton).setActive(false);
        this.clearButton.getComponent(FadeEffectButton).setActive(false);
        this.dealButton.getComponent(FadeEffectButton).setActive(false);
    }

    newGame() {
        this.hideAllButtons();
        this.totalBetLabel.string = "0";
        this.handPlaces.forEach((place) => {
            place.onClearBetClick(false);
            place.enablePlaceChip(true);
        });
        this.handPlaces[1].highlightPlace(true);
        this.dealerHand.resetView();
        this.roundFinished = false;
        (this.finishHandler as BlackJackFinishHandler).clearCache();
        this.activeHand = null;

        this.clearWinningBet();
        this.clearWinningEffect();
    }

    updateAvailableActions() {
        if (!this.activeHand) {
            return;
        }

        this.hitButton.getComponent(FadeEffectButton).setDisabled(this.activeHand.isStand);
        this.standButton.getComponent(FadeEffectButton).setDisabled(this.activeHand.isStand);
        this.doubleButton
            .getComponent(FadeEffectButton)
            .setDisabled((!this.activeHand.canDouble && !this.activeHand.isStand) || this.activeHand.isStand);
        this.splitButton
            .getComponent(FadeEffectButton)
            .setDisabled((!this.activeHand.isStand && !this.activeHand.canSplit) || this.activeHand.isStand);
    }

    showActionsWithBehavior(behavior: number) {
        switch (behavior) {
            case BlackJackActionType.START_ROUND:
                this.startRoundActionVisibility(true);
                this.inRoundActionVisibility(false);
                this.finishActionVisibility(false);
                break;
            case BlackJackActionType.IN_ROUND:
                this.inRoundActionVisibility(true);
                this.startRoundActionVisibility(false);
                this.finishActionVisibility(false);
                break;
            case BlackJackActionType.END_ROUND:
                this.finishActionVisibility(true);
                this.inRoundActionVisibility(false);
                this.startRoundActionVisibility(false);
                break;
            case BlackJackActionType.ERROR:
                this.startRoundActionVisibility(false);
                this.finishActionVisibility(false);
                break;
        }
    }

    startRoundActionVisibility(status: boolean) {
        this.dealButton.getComponent(FadeEffectButton).setActive(status);
        this.clearButton.getComponent(FadeEffectButton).setActive(status);
    }

    inRoundActionVisibility(status: boolean) {
        this.hitButton.getComponent(FadeEffectButton).setActive(status);
        this.standButton.getComponent(FadeEffectButton).setActive(status);
        this.doubleButton.getComponent(FadeEffectButton).setActive(status);
        this.splitButton.getComponent(FadeEffectButton).setActive(status);
    }

    disabledInRoundAction(status: boolean) {
        this.hitButton.getComponent(FadeEffectButton).setDisabled(status);
        this.standButton.getComponent(FadeEffectButton).setDisabled(status);
        this.doubleButton.getComponent(FadeEffectButton).setDisabled(status);
        this.splitButton.getComponent(FadeEffectButton).setDisabled(status);
    }

    finishActionVisibility(status: boolean) {
        this.rebetAndDealButton.getComponent(FadeEffectButton).setActive(status);
        this.newBetButton.getComponent(FadeEffectButton).setActive(status);
    }

    updateDisplayForRemoteConfig() {
        super.updateDisplayForRemoteConfig();
        this.updateDisplayMinMaxBet();
        this.updateOdds();
    }

    updateOdds() {
        const odds = `${GameUtils.roundFixed(+this.gameConfigs.odds.blackjack - 1, 2)}`;
        this.blackjackOddLabel.string = i18n.t("ui.blackjack_pay", { odds });
    }

    updateDisplayMinMaxBet() {
        this.minBetLabel.string = numberWithCommas(this.getMinBet());
        this.maxBetLabel.string = numberWithCommas(this.getMaxBet());
    }

    updateUserStakeLevel(data): boolean {
        const updated = super.updateUserStakeLevel(data);
        this.updateDisplayMinMaxBet();
        return updated;
    }

    playAudioNotification() {
        AudioManager.getInstance().playSFX(this.gameNotificationsAudio.clip);
    }

    setIntervalReminder() {
        this.stopIntervalReminder();
        this.audioNotificationInterval = setInterval(() => {
            if (!this.isAlive()) {
                return;
            }
            this.playAudioNotification();
        }, 300000);
    }

    stopIntervalReminder() {
        this.audioNotificationInterval && clearInterval(this.audioNotificationInterval);
    }

    playSingleChipsSound() {
        AudioManager.getInstance().playSFX(this.singleChipAudio.clip);
    }

    slidingDownBetChip(isMoveBottom: boolean) {
        const movePosition = cc.v3(
            this.betChipsContainer.parent.position.x,
            this.bottomBetChipsPos.position.y,
            this.betChipsContainer.parent.position.z
        );

        cc.tween(this.betChipsContainer.parent)
            .to(
                0.3,
                {
                    position: isMoveBottom ? movePosition : this.betChipsPostion
                },
                { easing: isMoveBottom ? "easeOutCirc" : "easeInCirc" }
            )
            .start();
    }
}
