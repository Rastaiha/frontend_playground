class Node {
    constructor(id) {
        this.id = id;
    }
}

class Graph {
    selectedNodes = [];
    selectedEdges = [];
    nodes = [];
    edges = [];

    constructor(node, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    selectNode(nodeId) {

    }

    unselectNode(nodeId) {

    }

    selectEdge(edgeId) {

    }

    unselectEdge(edgeId) {

    }

    addNewNode() {

    }

    removeSelectedNodes() {

    }

    addEdge(node1Id, node2Id) {

    }

    addEdgesBetweenSelectedNodes() {

    }

    removeEdgesBetweenSelectedNodes() {

    }
};

//////////////

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


var str = prompt("inter number of patients:");
const PEOPLE_NUMBER = Number(str);
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

const friends = [
    'حشمت',
    'اشرف',
    'معصومه',
    'غلام',
    'صفرعلی',
    'بیگُم',
    'مهین‌تاج',
    'شهپر',
    'مهوش',
];


class Person extends Node {
    friendId;
    priorityList = [];

    constructor(priorityList, friendId) {
        this.friendId = friendId;
        this.priorityList = priorityList;
        this.NAMES = NAMES[Math.floor(Math.random() * NAMES.length)];
        this.friends = friends[Math.floor(Math.random() * friends.length)];
    }

}


class GameTheoryMiniGame extends Graph {
    donorsId = [];
    patientsId = [];

    constructor() {

    }

    //override from parent
    addEdge() {

    }


}