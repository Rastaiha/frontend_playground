// const patient1={
//   name:'ali',
//   friendname:'reza',
//   list=[],
// };

// const patient2={
//   name:'hasan',
//   friendname:'omid',
//   list=[],
// };

// const patient3={
//   name:'mahdi',
//   friendname:'reza',
//   list=[],
// };

const LEVELS_INFO = [{
        levelNumber: 0,
        people: [{
                id: 1,
                isPatient: true,
                friendId: 2,
                priorityList: [4],
            },
            {
                id: 2,
                isPatient: false,
                friendId: 1,
                priorityList: [],
            },
            {
                id: 3,
                isPatient: true,
                friendId: 4,
                priorityList: [2],
            },
            {
                id: 4,
                isPatient: false,
                friendId: 3,
                priorityList: [],
            },
        ],
        answer: [
            [
                [0, 2],
                [2, 3],
                [3, 0]
            ],
            [
                [1, 5],
                [5, 4],
                [4, 6],
                [6, 1],
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