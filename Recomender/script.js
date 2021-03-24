class RecommenderGame {
    table = [[]];
    normalizedMatrix = [[]]
    reducedMatrix = [[]]

    RecommenderGame() {
        this._initializeTable();
        this._normalizeMatrix();
        this._reduceMatrixDimension();
    }

    _initializeTable() {
        //todo
    }

    setTableCellValue(row, column, newValue) {
        this.table[row][column] = newValue;
    }

    _normalizeMatrix() {

        for (let i = 0; i < this.table.length; i++) {
            let j;
            let sumOfSquares = 0;

            for (j = 0; j < this.table[0].length; j++) {
                sumOfSquares += this.table[i][j] * this.table[i][j];
            }

            for (j = 0; j < this.table[0].length; j++) {
                this.normalizedMatrix[i][j] = this.table[i][j] / Math.sqrt(sumOfSquares);
            }
        }

    }

    _reduceMatrixDimension() {
        this.reducedMatrix = druid.Matrix.from(this.normalizedMatrix).to2dArray;
        //todo
    }


}


const a = [
    [22, 10, 2, 3, 7],
    [14, 7, 10, 0, 8],
    [-1, 13, -1, -11, 3],
    [-3, -2, 13, -2, 4],
    [9, 8, 1, -2, 4],
    [9, 1, -7, 5, -1],
    [2, -6, 6, 5, 1],
    [4, 5, 0, -2, 2]
]

// const { u, v, q } = SVDJS.SVD(a)
// console.log(u)
// console.log(v)
// console.log(q)
// const {v} = SVDJS.SVD(a);
// console.log(v)