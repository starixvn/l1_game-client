import DataHandler from "./DataHandler";
import GameRoomBase from "../GameRoomBase";
import RoomPlayer, { PlayerData } from "../RoomPlayer";
import * as _ from "lodash";

export default interface IGameBasePlayerHandler extends DataHandler {
    getPlayerSlot(playerId: string): RoomPlayer;
}
export default class GameBasePlayerHandler implements IGameBasePlayerHandler {
    otherPlayers = {};

    constructor(protected readonly main: GameRoomBase) {
    }

    handle(data: any): boolean {
        if (data.player) {
            this.addPlayer(data.player);
        }

        if (data.players) {
            this.addPlayers(data.players);
        }

        if (data.outgame) {
            this.removePlayer(data.outgame);
        }

        return true;
    }

    removePlayer(playerData: any) {
        if (playerData.playerId) {
            var slot = this.getPlayerSlot(playerData.playerId);

            if (slot) {
                slot.setInfo(null);
                let keys = Object.keys(this.otherPlayers);

                // Move player from others to slot
                if (keys.length > 0) {
                    let newPlayer = this.otherPlayers[keys[0]];
                    this.addPlayer(newPlayer);
                    delete this.otherPlayers[newPlayer.id];
                }
            } else {
                delete this.otherPlayers[playerData.playerId];
            }
        }
    }

    addPlayers(playersData) {
        const players: PlayerData[] = _.values(playersData);
        const realPlayers = _.filter(players, player => !player.type);
        const botPlayers = _.filter(players, player => player.type);

        _.forEach(realPlayers, (player) => {
            this.addPlayer(player);
        })

        _.forEach(botPlayers, (player) => {
            this.addPlayer(player);
        })
    }

    addPlayer(player: PlayerData) {
        const playerSlot = this.getPlayerSlot(player.id);
        const playerFromCache = RoomPlayer.getPlayerFromCache(player.id, this.main.gameName);
        player.idleCount = playerFromCache ? playerFromCache.idleCount : 0;

        if (!playerSlot) {
            const emptySlot = this.getEmptySlot();

            if (emptySlot && player.idleCount <= RoomPlayer.MAX_IDLE_COUNT) {
                emptySlot.setInfo(player);

                return;
            }

            this.otherPlayers[player.id] = player;
        }

    }

    updateTablePlayers() {
        let otherPlayers: any[] = _.values(this.otherPlayers);

        _.forEach(this.main.players, (player) => {
            if (!player.data) {
                return;
            }

            player.data.idleCount++
            RoomPlayer.storePlayerToCache(player.data, this.main.gameName);

            if (player.isIdle) {
                const oldPlayerData = player.data;

                const newPlayer = _.find(otherPlayers, player => player.idleCount <= RoomPlayer.MAX_IDLE_COUNT);

                if (newPlayer) {
                    player.setInfo(newPlayer);
                    delete this.otherPlayers[newPlayer.id];
                    this.otherPlayers[oldPlayerData.id] = oldPlayerData;
                    _.remove(otherPlayers, newPlayer);
                }
            }
        });

        const botsInTable = _.filter(this.main.players, player => player.data && player.data.type);
        const realPlayers: PlayerData[] = _.filter(otherPlayers, player => player && !player.type);

        _.forEach(botsInTable, (bot) => {
            const botData = bot.data;
            const realPlayer = _.find(realPlayers, player => player.idleCount <= RoomPlayer.MAX_IDLE_COUNT);

            if (realPlayer) {
                this.otherPlayers[botData.id] = botData;
                bot.setInfo(realPlayer);
                delete this.otherPlayers[realPlayer.id];
                _.remove(realPlayers, realPlayer);
            }
        })
    }

    getPlayerSlot(playerId: string): RoomPlayer {
        return _.find(this.main.players, (player) => player.data && player.data.id === playerId);
    }

    getEmptySlot(): RoomPlayer {
        return _.find(this.main.players, (player) => !player.data);
    }

    getBotSlot(): RoomPlayer {
        return _.find(this.main.players, (player) => player.data && player.data.type);
    }
}