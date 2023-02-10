import _ = require("lodash");

import { systemType } from "../../configs/Configs";
import { SystemType } from "../../ISystem";

export interface IDataSongs {
    [SystemType.SC1]: string[];
    [SystemType.SC2]: string[];
}

export default class NameSongManager {
    private _songs: IDataSongs = { [SystemType.SC1]: [], [SystemType.SC2]: [] };

    set songs(data: IDataSongs) {
        this._songs = data;
    }
    constructor(data: IDataSongs) {
        this._songs = data;
    }

    public getSongName() {
        return systemType === SystemType.SC2
            ? this.getRandomNameSong(this._songs[SystemType.SC2])
            : this.getRandomNameSong(this._songs[SystemType.SC1]);
    }

    private getRandomNameSong(songs: string[]) {
        return songs[_.random(songs.length - 1)];
    }
}
