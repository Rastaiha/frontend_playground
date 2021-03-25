const LEVELS_INFO = [
    //////////////////////////////////////////////level 0
    {
        levelNumber: 0,
        people: [{
                id: 0,
                isPatient: true,
                friendId: 1,
                priorityList: [3, 5, 1],
            },
            {
                id: 1,
                isPatient: false,
                friendId: 0,
                priorityList: [],
            },
            {
                id: 2,
                isPatient: true,
                friendId: 3,
                priorityList: [5, 1, 3],
            },
            {
                id: 3,
                isPatient: false,
                friendId: 2,
                priorityList: [],
            },
            {
                id: 4,
                isPatient: true,
                friendId: 5,
                priorityList: [5, 7],
            },
            {
                id: 5,
                isPatient: false,
                friendId: 4,
                priorityList: [],
            },
            {
                id: 6,
                isPatient: true,
                friendId: 7,
                priorityList: [1, 5],
            },
            {
                id: 7,
                isPatient: false,
                friendId: 6,
                priorityList: [],
            },
        ],
        answer: [
            /// [patient , doner]
            [
                [0, 3],
                [2, 5],
                [4, 7],
                [6, 1]
            ],
        ]


    },
    ///////////////////////////////////////////////////////level 1
    {
        levelNumber: 1,
        people: [{
                id: 0,
                isPatient: true,
                friendId: 1,
                priorityList: [3, 1],
            },
            {
                id: 1,
                isPatient: false,
                friendId: 0,
                priorityList: [],
            },
            {
                id: 2,
                isPatient: true,
                friendId: 3,
                priorityList: [3, 1],
            },
            {
                id: 3,
                isPatient: false,
                friendId: 2,
                priorityList: [],
            },

        ],
        answer: [
            /// [patient , doner]
            [
                [0, 1],
                [2, 3]
            ],
        ]
    },
    ///////////////////////////////////////////////////level 2

    {
        levelNumber: 2,
        people: [{
                id: 0,
                isPatient: true,
                friendId: 1,
                priorityList: [1, 5],
            },
            {
                id: 1,
                isPatient: false,
                friendId: 0,
                priorityList: [],
            },
            {
                id: 2,
                isPatient: true,
                friendId: 3,
                priorityList: [7, 5],
            },
            {
                id: 3,
                isPatient: false,
                friendId: 2,
                priorityList: [],
            },
            {
                id: 4,
                isPatient: true,
                friendId: 5,
                priorityList: [3, 7],
            },
            {
                id: 5,
                isPatient: false,
                friendId: 4,
                priorityList: [],
            },
            {
                id: 6,
                isPatient: true,
                friendId: 7,
                priorityList: [3, 5],
            },
            {
                id: 7,
                isPatient: false,
                friendId: 6,
                priorityList: [],
            },

        ],
        answer: [
            /// [patient , doner]
            [
                [0, 1]
            ],
            [
                [2, 7],
                [6, 3]
            ],
            [
                [4, 5]
            ],
        ]
    },
    ///////////////////////////////////////////////////level 3

    {
        levelNumber: 3,
        people: [{
                id: 0,
                isPatient: true,
                friendId: 1,
                priorityList: [1, 5],
            },
            {
                id: 1,
                isPatient: false,
                friendId: 0,
                priorityList: [],
            },
            {
                id: 2,
                isPatient: true,
                friendId: 3,
                priorityList: [1, 5],
            },
            {
                id: 3,
                isPatient: false,
                friendId: 2,
                priorityList: [],
            },
            {
                id: 4,
                isPatient: true,
                friendId: 5,
                priorityList: [3, 7],
            },
            {
                id: 5,
                isPatient: false,
                friendId: 4,
                priorityList: [],
            },
            {
                id: 6,
                isPatient: true,
                friendId: 7,
                priorityList: [5, 9],
            },
            {
                id: 7,
                isPatient: false,
                friendId: 6,
                priorityList: [],
            },
            {
                id: 8,
                isPatient: true,
                friendId: 9,
                priorityList: [11, 9],
            },
            {
                id: 9,
                isPatient: false,
                friendId: 8,
                priorityList: [],
            },
            {
                id: 10,
                isPatient: true,
                friendId: 11,
                priorityList: [5, 7],
            },
            {
                id: 11,
                isPatient: false,
                friendId: 10,
                priorityList: [],
            },

        ],
        answer: [
            /// [patient , doner]
            ///this part is not complete
            [
                [],
                [],
                []
            ],
            [
                [],
                [],
                [],
                [],
            ],
        ]
    },

    ///////////////////////////////////////////////////level 4

    {
        levelNumber: 4,
        people: [{
                id: 0,
                isPatient: true,
                friendId: 1,
                priorityList: [1, 3],
            },
            {
                id: 1,
                isPatient: false,
                friendId: 0,
                priorityList: [],
            },
            {
                id: 2,
                isPatient: true,
                friendId: 3,
                priorityList: [1, 5],
            },
            {
                id: 3,
                isPatient: false,
                friendId: 2,
                priorityList: [],
            },
            {
                id: 4,
                isPatient: true,
                friendId: 5,
                priorityList: [3, 5],
            },
            {
                id: 5,
                isPatient: false,
                friendId: 4,
                priorityList: [],
            },
            {
                id: 6,
                isPatient: true,
                friendId: 7,
                priorityList: [5, 11, 7, 9],
            },
            {
                id: 7,
                isPatient: false,
                friendId: 6,
                priorityList: [],
            },
            {
                id: 8,
                isPatient: true,
                friendId: 9,
                priorityList: [7, 11],
            },
            {
                id: 9,
                isPatient: false,
                friendId: 8,
                priorityList: [],
            },
            {
                id: 10,
                isPatient: true,
                friendId: 11,
                priorityList: [9],
            },
            {
                id: 11,
                isPatient: false,
                friendId: 10,
                priorityList: [],
            },
            {
                id: 12,
                isPatient: true,
                friendId: 13,
                priorityList: [7, 13, 19],
            },
            {
                id: 13,
                isPatient: false,
                friendId: 12,
                priorityList: [],
            },
            {
                id: 14,
                isPatient: true,
                friendId: 15,
                priorityList: [17, 19, 15],
            },
            {
                id: 15,
                isPatient: false,
                friendId: 14,
                priorityList: [],
            },
            {
                id: 16,
                isPatient: true,
                friendId: 17,
                priorityList: [13, 7, 19],
            },
            {
                id: 17,
                isPatient: false,
                friendId: 16,
                priorityList: [],
            },
            {
                id: 18,
                isPatient: true,
                friendId: 19,
                priorityList: [5, 1, 13, 17],
            },
            {
                id: 19,
                isPatient: false,
                friendId: 18,
                priorityList: [],
            },
        ],
        answer: [
            /// [patient , doner]
            ///this part is not complete
            [
                [, ],
                [, ],
                [, ]
            ],
            [
                [, ],
                [, ],
                [, ],
                [, ],
            ],
        ]
    },




]

const NAMES = [
    'اصغر',
    'محمد',
    'نصرت',
    'منصوره',
    'اسماعیل',
    'مهری',
    'هاشم',
    'داریوش',
    'پریوش',
];

const LAST_NAMES = [
    'فرهادی',
    'دلربا',
    'حدادی',
    'غلام‌رضایی',
    'کاکایی',
    'کربکندی',
    'بی‌طرف',
    'جعفری',
    'خان‌پور',
    'بقال‌زاده',
    'ماس‌بند',
    'بقولی‌زاده',
    'قلی‌پور',
    'تاتاری',
];

class Person {
    constructor(id, priorityList, friendId, isPatient) {
        this.id = id;
        this.friendId = friendId;
        this.priorityList = priorityList;
        this.isPatient = isPatient;
        this.name = NAMES[Math.floor(Math.random() * NAMES.length)] + ' ' + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    }
}


class GameTheoryMiniGame {
    perople = [];
    edges = [];

    constructor(level) {
        this.LevelInfo = LEVELS_INFO[level];
        for (let id = 0; id < LevelInfo.people.length; id++) {
            const initialPerson = LevelInfo.people[id];
            let newPerson = new Person(id, initialPerson.priorityList, initialPerson.friendId, initialPerson.isPatient);
            this.perople.push(newPerson);
        }
    }

    addEdge(patientId, donorId) {
        for (let i = 0; i < this.people.length; i++) {
            if (patientId == i && !this.perople[i].isPatient) {
                console.log("Error!");
                return;
            }
            if (donorId == i && this.perople[i].isPatient) {
                console.log("Error!");
                return;
            }
        }
        this.edges.push([patientId, donorId]);
        console.log("Edge added succesfully!");
    }

    removeEdge() {

    }

    getResult() {
        const answer = this.LevelInfo.answer;

    }
}


console.log(new GameTheoryMiniGame(0));