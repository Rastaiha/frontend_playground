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

class Person extends Node {
  friendId;
  priorityList = [];

  constructor(priorityList, friendId) {
    this.friendId = friendId;
    this.priorityList = priorityList;
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