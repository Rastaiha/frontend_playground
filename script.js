var content = '{"people": [{"name": "kif","image": "ss.jpg"},' +
    '{"name": "takht","image": "s2.jpg"},' +
    '{"name": "sina","image": "sina.jpg"}]}';//todo read file except hardCode

const people = JSON.parse(content);

for (let i = 0; i < people.people.length; i++){
    const card = document.createElement("div");
    card.className = "col-sm card";
    card.innerHTML = '<img src="' + people.people[i].image+ '">';
    document.getElementById("row1").appendChild(card);
}

for (let i = 0; i < people.people.length; i++){
    const card = document.createElement("div");
    card.className = "col-sm card";
    card.innerHTML = '<p>' + people.people[i].name + '"<p/>';
    document.getElementById("row2").appendChild(card);
}
