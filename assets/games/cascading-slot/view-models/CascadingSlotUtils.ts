export const convertBoardValue = (data: number[]): number[][] => {
    const result: number[][] = [];

    const column = 6;
    const row = 5;

    for (let i = 0; i < column; i++) {
        result.push([]);
        for (let j = 0; j < row; j++) {
            // result[i].push(data[i * row + j]);
            result[i].push(data[i * row + row - j - 1]);
        }
    }

    return result;
};

export const convertStringToArray = (data: string) => {
    return data.split(",").map((value) => {
        return value !== "" ? +value : null;
    });
};

export const convertData = (value: string) => {
    return convertBoardValue(convertStringToArray(value));
};
