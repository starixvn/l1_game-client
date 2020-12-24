

export default class VipSedieWarUtils {
    public static getBetChoiceString(choice: string): string {
        const dict = {
            even: "Tổng chẵn",
            odd: "Tổng lẻ",

            player: "Nhà Con",
            banker: "Nhà Cái",

            playerEven: "Nhà Con chẵn",
            playerOdd: "Nhà Con lẻ",

            bankerEven: "Nhà Cái chẵn",
            bankerOdd: "Nhà Cái lẻ",

            tie: "Hòa",
            playerRed3: "Nhà Con 3 đỏ",
            playerRed4: "Nhà Con 4 đỏ",
            playerWhite3: "Nhà Con 1 đỏ",
            playerWhite4: "Nhà Con 4 trắng",

            bankerRed3: "Nhà Cái 3 đỏ",
            bankerRed4: "Nhà Cái 4 đỏ",
            bankerWhite3: "Nhà Cái 1 đỏ",
            bankerWhite4: "Nhà Cái 4 trắng"
        };

        return dict[choice];
    }

    public static setDotsImage(result: any, playerResultNode: cc.Node, bankerResultNode: cc.Node, dotsFrame: cc.SpriteFrame[]) {
        const playerSprites = playerResultNode.children.map(child => {
            const sprite = child.getComponent(cc.Sprite);
            sprite.spriteFrame = dotsFrame[0];
            return sprite;
        });
        let index = 0;
        Object.keys(result.player).forEach(key => {
            if (result.player[key]) {
                playerSprites[index].getComponent(cc.Sprite).spriteFrame = dotsFrame[1];
                index++;
            }
        });

        const bankerSprites = bankerResultNode.children.map(child => {
            const sprite = child.getComponent(cc.Sprite);
            sprite.spriteFrame = dotsFrame[0];
            return sprite;
        });
        index = 0;
        Object.keys(result.banker).forEach(key => {
            if (result.banker[key]) {
                bankerSprites[index].getComponent(cc.Sprite).spriteFrame = dotsFrame[1];
                index++;
            }
        });
    }
}
