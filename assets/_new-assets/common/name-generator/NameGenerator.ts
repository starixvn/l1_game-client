import * as animals from "./name-dictionaries/animals";
import * as marvels from "./name-dictionaries/marvels";
import * as fruits from "./name-dictionaries/fruits";
import * as colors from "./name-dictionaries/colors";
import * as Chance from "chance";

import { uniqueNamesGenerator } from 'unique-names-generator';

export default class NameGenerator {
    static chance = new Chance.Chance();

    public static generateName(): string {
        const dictionaries = [colors, animals, marvels, fruits];

        const randomDictionaryIndex = NameGenerator.chance.integer({ min: 0, max: 3 });
        const pickedDictionary = dictionaries[randomDictionaryIndex];

        const shortName = uniqueNamesGenerator({
            dictionaries: [pickedDictionary],
            separator: "",
            length: 1
        });

        const numberLength = shortName.length < 10 ? 5 : 14 - shortName.length;
        let maxNumber = "";
        for (let i = 0; i < numberLength; i++) {
            maxNumber = "9" + maxNumber;
        }
        const randomNumber = NameGenerator.chance.integer({ min: 0, max: +maxNumber });

        return `${shortName}${randomNumber}`;
    }
}
