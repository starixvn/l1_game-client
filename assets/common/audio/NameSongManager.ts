import _ = require("lodash");

import { systemType } from "../../configs/Configs";
import { SystemType } from "../../ISystem";

interface IDataSongs {
    [SystemType.SC1]: string[];
    [SystemType.SC2]: string[];
}

export default class NameSongManager {
    private readonly songs: IDataSongs = { [SystemType.SC1]: [], [SystemType.SC2]: [] };

    constructor(data: IDataSongs) {
        this.songs = data;
    }

    public getSongName() {
        return systemType === SystemType.SC2
            ? this.getRandomNameSong(this.songs[SystemType.SC2])
            : this.getRandomNameSong(this.songs[SystemType.SC1]);
    }

    private getRandomNameSong(songs: string[]) {
        return songs[_.random(songs.length - 1)];
    }
}
