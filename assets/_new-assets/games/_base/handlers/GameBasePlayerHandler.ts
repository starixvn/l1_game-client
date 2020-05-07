
import DataHandler from "./DataHandler";
import GameRoomBase from "../GameRoomBase";

export default class GameBasePlayerHanlder implements DataHandler {
    otherPlayers = {};
    readonly positions = {
        1: { id: 1, data: null },
        2: { id: 2, data: null },
        3: { id: 3, data: null },
        4: { id: 4, data: null },
        5: { id: 5, data: null },
        6: { id: 6, data: null },
        7: { id: 7, data: null },
        8: { id: 8, data: null },
    };

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
        if (!!data.playerId) {
            let slot = this.getPlayerSlot(data.playerId);

            if (slot) {
                this.positions[slot.id].data = null;
                this.main.players[slot.id - 1].setInfo(null);
                let keys = Object.keys(this.otherPlayers);
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
        let players = Object.keys(data).map(key => data[key]);
        var positionsSize = Object.keys(this.positions).length;

        let length = players.length < positionsSize ? players.length : positionsSize;
        for (let i = 0; i < length; i++) {
            let player = players[i];
            this.main.players[i].setInfo(player);
            this.positions[i + 1].data = player;
            delete data[player.id];
        }

        if (players.length > positionsSize) {
            this.otherPlayers = data;
        }
    }

    addPlayer(player) {
        var playerSlot = this.getPlayerSlot(player.id);

        if (!playerSlot) {
            let emptySlots = this.getEmptySlots();

            if (emptySlots.length > 0) {
                var selectedPos = emptySlots[0];
                this.positions[selectedPos.id].data = player;
                this.main.players[selectedPos.id - 1].setInfo(player);
            } else {
                this.otherPlayers[player.id] = player;
            }
        }
    }

    getPlayerSlot(playerId) {
        for (const key in Object.keys(this.positions)) {
            const playerSlot = this.positions[key];

            if (playerSlot.data && playerSlot.data.id == playerId) {
                return playerSlot;
            }
        }

        return null;
    }

    getEmptySlots() {
        let slots = Object.keys(this.positions).map(key => this.positions[key]);
        let emptySlots = slots.filter((slot) => {
            return slot.data == null
        });

        return emptySlots;
    }
}