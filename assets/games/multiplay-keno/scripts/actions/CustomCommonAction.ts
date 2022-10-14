import MegaKeno from "../MegaKeno";
import MegaKenoMd5 from "../MegaKenoMd5";

export const updateMD5String = (game: MegaKeno) => (data) => {
    if (game.md5Component) {
        const md5Comp = game.md5Component as MegaKenoMd5;
        md5Comp.isMiniType = game.isMiniKeno(game.gameId);
    }
};
