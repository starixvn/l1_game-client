
import DataHandler from "./DataHandler";
import GameRoomBase from "../GameRoomBase";
import RoomPlayer from "../RoomPlayer";
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

    removePlayer(data: any) {
        if (data.playerId) {
            var slot = this.getPlayerSlot(data.playerId);

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
                delete this.otherPlayers[data.playerId];
            }
        }
    }

    addPlayers(data) {
        var players = Object.keys(data).map(key => data[key]);
        var playerCount = this.main.players.length;
        var length = players.length < playerCount ? players.length : playerCount;

        for (let i = 0; i < length; i++) {
            let player = players[i];
            this.main.players[i].setInfo(player);
            delete data[player.id];
        }

        if (players.length > playerCount) {
            this.otherPlayers = data;
        }
    }

    addPlayer(player) {
        var playerSlot = this.getPlayerSlot(player.id);

        if (!playerSlot) {
            let emptySlots = this.getEmptySlots();

            if (emptySlots.length > 0) {
                var emptySlot = emptySlots[0];
                emptySlot.setInfo(player);
            } else {
                this.otherPlayers[player.id] = player;
            }
        }
    }

    getPlayerSlot(playerId: string): RoomPlayer {
        return _.find(this.main.players, (player) => player.data && player.data.id === playerId)
    }

    getEmptySlots() {
        return _.filter(this.main.players, (player) => !player.data);
    }
}