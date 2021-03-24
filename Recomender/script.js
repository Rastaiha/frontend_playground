class RecommenderGame {

    table = new Array(10).fill(0).map(() => new Array(10).fill(0));
    normalizedMatrix  = new Array(10).fill(0).map(() => new Array(10).fill(0));
    reducedMatrix  = new Array(10).fill(0).map(() => new Array(10).fill(0));

    constructor(table) {
        this._initializeTable(table);
        this._normalizeMatrix();
        this._reduceMatrixDimension();
    }

    _initializeTable(table) {
        this.table = table;
    }

    setTableCellValue(row, column, newValue) {
        this.table[row][column] = newValue;
    }

    _normalizeMatrix() {

        for (let i = 0; i < this.table.length; i++) {
            let j;
            let sumOfSquares = 0;

            for (j = 0; j < this.table[i].length; j++) {
                sumOfSquares += this.table[i][j] * this.table[i][j];
            }
            for (j = 0; j < this.table[i].length; j++) {
                this.normalizedMatrix[i][j] = this.table[i][j] / Math.sqrt(sumOfSquares);
            }
        }

    }

    _reduceMatrixDimension() {
        this.reducedMatrix = druid.Matrix.from(this.normalizedMatrix).to2dArray;
        //todo
    }


}


var a = [
    [22, 10, 2, 3, 7],
    [14, 7, 10, 0, 8],
    [-1, 13, -1, -11, 3],
    [-3, -2, 13, -2, 4],
    [9, 8, 1, -2, 4],
    [9, 1, -7, 5, -1],
    [2, -6, 6, 5, 1],
    [4, 5, 0, -2, 2]
]


re = new RecommenderGame(a);
console.log(re.table)
console.log(re.normalizedMatrix);
console.log(re.reducedMatrix);
