class RecommenderGame {

    table = new Array(10).fill(0).map(() => new Array(10).fill(0));
    // normalizedMatrix = new Array(10).fill(0).map(() => new Array(10).fill(0));
    reducedMatrix = new Array(10).fill(0).map(() => new Array(2).fill(0));

    constructor(table) {
        this._initializeTable(table);
        // this._normalizeMatrix();
        this._reduceMatrixDimension();
    }

    _initializeTable(table) {
        this.table = table;
    }

    setTableCellValue(row, column, newValue) {
        this.table[row][column] = newValue;
    }

    // _normalizeMatrix() {
    //
    //     for (let i = 0; i < this.table.length; i++) {
    //         let j;
    //         let sumOfSquares = 0;
    //
    //         for (j = 0; j < this.table[i].length; j++) {
    //             sumOfSquares += this.table[i][j] * this.table[i][j];
    //         }
    //         for (j = 0; j < this.table[i].length; j++) {
    //             this.normalizedMatrix[i][j] = this.table[i][j] / Math.sqrt(sumOfSquares);
    //             if (i === j)  this.normalizedMatrix[i][j] = 100;
    //         }
    //     }
    //
    // }

    _reduceMatrixDimension() {
        var a = mdsjs.convertToMatrix(this.table, true);
        mdsjs.landmarkMDSAsync(a, 2, function (points) {
            console.log("" + points);
        });
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

var c = [[0, 2, 2, 4, 6, 6, 4, 6, 6, 7],
    [2, 0, 2, 2, 3, 4, 2, 3, 4, 5],
    [2, 2, 0, 4, 4, 6, 4, 4, 6, 4],
    [4, 2, 4, 0, 1, 1, 4, 6, 6, 1],
    [6, 3, 4, 1, 0, 1, 2, 3, 4, 2],
    [6, 4, 6, 1, 1, 0, 4, 4, 6, 6],
    [4, 2, 4, 4, 2, 4, 0, 1, 1, 7],
    [6, 3, 4, 6, 3, 4, 1, 0, 1, 2],
    [6, 4, 6, 6, 4, 6, 1, 1, 0, 2],
    [4, 3, 7, 4, 9, 8, 4, 7, 5, 0]]

var b = [
    [0, 2, 2, 4, 6, 6, 4, 6, 6],
    [2, 0, 2, 2, 3, 4, 2, 3, 4],
    [2, 2, 0, 4, 4, 6, 4, 4, 6],
    [4, 2, 4, 0, 1, 1, 4, 6, 6],
    [6, 3, 4, 1, 0, 1, 2, 3, 4],
    [6, 4, 6, 1, 1, 0, 4, 4, 6],
    [4, 2, 4, 4, 2, 4, 0, 1, 1],
    [6, 3, 4, 6, 3, 4, 1, 0, 1],
    [6, 4, 6, 6, 4, 6, 1, 1, 0]
]


re = new RecommenderGame(c);
// console.log(re.table)
// console.log(re.normalizedMatrix);
// console.log(re.reducedMatrix);
