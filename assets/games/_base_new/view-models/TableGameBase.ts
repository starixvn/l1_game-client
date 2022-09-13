import _ = require("lodash");

import GameUtils from "../../../common/GameUtils";
import { playWinningEffect } from "../../_base/action/PayChipsAction";
import RoomPlayer, { PlayerData } from "../../_base/view-models/RoomPlayer";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import {
    handleAddPlayers,
    handlePlaceOwnChip,
    handlePlaceTotalChips,
    handlePlayerChipAction,
    hanleAddPlayer,
    removePlayer,
    updateTablePlayer,
} from "../actions/CommonTableGameAction";
import { clearChipsForLostChoices, payChips, resetUIAndClearChips } from "../actions/NewPayChipsAction";
import { BetModel } from "../models/BetModel";
import NewTableGameData from "../models/NewTableGameData";
import PlayerModel from "../models/PlayerModel";
import MiniGameBase from "./MiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableGameBase extends MiniGameBase {
    @property({ type: RoomPlayer })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node })
    otherPlayers: cc.Node = null;

    @property(cc.Prefab)
    winningPlayerEffectPrefab: cc.Prefab = null;

    protected get WinningAnimationDuration() {
        return 3;
    }

    public isMiniGameInContainer = true;
    otherPlayersCache = {};
    playerChips = [];
    readonly payChipFlyTime = 1.2;
    startRoundDuration = 1;
    showResultDuration = 1;
    public gameData: NewTableGameData;

    onLoad() {
        super.onLoad();
        this.players.forEach((player) => (player.node.active = false));
    }

    createGameData(): GameData {
        return new NewTableGameData();
    }

    initGameDataEvents() {
        super.initGameDataEvents();

        const clearNewRoundEvent = this.startRoundDuration > 0 ? Durations.Events.BEGIN_STARTING_ROUND : Durations.Events.BEGIN_PLACING_BET;
        this.emitterListener(this.gameData.durations, clearNewRoundEvent, updateTablePlayer);
        this.emitterListener(this.gameData.durations, clearNewRoundEvent, resetUIAndClearChips);
        this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_OWN_CHIP, handlePlaceOwnChip);
        if (this.showOtherPlayerChips) {
            this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_PLAYER_CHIP, handlePlayerChipAction);
            this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_TOTAL_CHIPS, handlePlaceTotalChips);
        }
        this.emitterListener(this.gameData.playerModel, PlayerModel.Events.ADD_PLAYER, hanleAddPlayer);
        this.emitterListener(this.gameData.playerModel, PlayerModel.Events.ADD_PLAYERS, handleAddPlayers);
        this.emitterListener(this.gameData.playerModel, PlayerModel.Events.REMOVE_PLAYER, removePlayer);
    }

    /**
     * Handling after showing settlement result
     */
    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.gameData.roundHistory.update();
        this.showWaittingTime(true);
        this.gameData.resultHash.updateUI();
        this.handlePayChips(settlement);
    }

    handlePayChips(settlement) {
        if (!this.showOtherPlayerChips) {
            clearChipsForLostChoices(this, settlement.settlementResult);
            return;
        }
        if (!!settlement) {
            payChips(this, settlement.settlementResult, settlement.winningPlayers, this.payChipFlyTime, this.WinningAnimationDuration);
        }
    }

    showStatus(status: any) {
        const { win, bet } = status;

        if (win) {
            const playerNode = this.userProfile.userAvatar.node.parent;
            this.showWinningBet(bet);
            playWinningEffect(this, playerNode, this.WinningAnimationDuration);
            this.updateUserBalance();
        }
    }

    addPlayer(player: PlayerData) {
        const playerSlot = this.getPlayerSlot(player.id);
        const playerFromCache = RoomPlayer.getPlayerFromCache(player.id, this.gameName);
        player.idleCount = playerFromCache ? playerFromCache.idleCount : 0;

        if (!playerSlot) {
            const emptySlot = this.getEmptySlot();

            if (emptySlot && player.idleCount <= RoomPlayer.MAX_IDLE_COUNT) {
                emptySlot.setInfo(player);

                return;
            }

            this.otherPlayersCache[player.id] = player;
        }
    }

    getPlayerSlot(playerId: string): RoomPlayer {
        return _.find(this.players, (player) => player.data && player.data.id === playerId);
    }

    getEmptySlot(): RoomPlayer {
        return _.find(this.players, (player) => !player.data);
    }

    getBotSlot(): RoomPlayer {
        return _.find(this.players, (player) => player.data && player.data.type);
    }

    placePlayerChip(data) {
        const { betChoice, amount, rate } = data;
        let startNode: cc.Node;
        const playerSlot = this.getPlayerSlot(data.playerId);
        const betItem = _.find(this.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());
        if (playerSlot) {
            this.updatePlayerSlotDataStorage(data, playerSlot);
            startNode = playerSlot.avatar.node;
        } else {
            startNode = this.otherPlayers;
            this.updateOtherDataStorage(data);
        }

        if (betItem) {
            const convertValue = GameUtils.getValueByCurrency(amount, rate);
            const chipValues = GameUtils.getChipQuantity(convertValue, this.betChips.chipValues);

            Object.keys(chipValues).forEach((chipValue) => {
                let count = chipValues[chipValue];
                for (; count > 0; count--) {
                    this.betChips.placeChipToChipBox(+chipValue, betItem.chipNode, startNode, null);
                }
            });
        }

        this.playerChips.pop();
    }

    updatePlayerSlotDataStorage(data: any, playerSlot: any) {
        playerSlot.setBalance(data.red);
        playerSlot.data.idleCount = 0;
        RoomPlayer.storePlayerToCache(playerSlot.data, this.gameName);
    }

    updateOtherDataStorage(data: any) {
        const player = this.otherPlayersCache[data.playerId];

        if (player) {
            player.idleCount = 0;
            player.red = data.red;
            this.otherPlayersCache[data.playerId] = player;
            RoomPlayer.storePlayerToCache(player, this.gameName);
        }
    }
}
