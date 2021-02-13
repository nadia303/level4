const config1 = {
    parent: '#usersTable',
    columns: [
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age'},
    ],
    apiUrl: "https://mock-api.shpp.me/nmishchuk/users"
};

const config2 = {
    parent: '#usersTable',
    columns: [
        {title: 'Name', value: 'name'},
        {title: 'Surname', value: 'surname'},
        {title: 'Avatar', value: 'avatar'},
        {title: 'Birthday', value: 'birthday'},
    ],
    apiUrl: "https://mock-api.shpp.me/nmishchuk/users"
};

const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Петя', surname: 'Васечкин', age: 15},
    {id: 30052, name: 'Катя', surname: 'Іванова', age: 55},
    {id: 30053, name: 'Галя', surname: 'Семків', age: 37},
    {id: 30054, name: 'Максим', surname: 'Галянта', age: 9},
    {id: 30055, name: 'Вася', surname: 'Худяков', age: 47},
    {id: 30056, name: 'Ольга', surname: 'Романова', age: 36},
];


function addSearchField() {
    let input_field = document.createElement("input");

    let table = document.getElementById("usersTable");
    table.appendChild(input_field);
}

function addUsersAddButton() {

}

async function DataTable(config) {
    addSearchField();
    addUsersAddButton();
    document.getElementById("usersTable").innerHTML = `
    <div class="container">
    <div class = "interaction">
    <input class="search_user" type="text" placeholder="Type here to search the user">
    <button class = "button_style button_style_add" id = "addBtn">Add</button>
    </div>
    <table class="customers"></table>
    </div>`;
    let addButton = document.getElementById("addBtn");
    addButton.onclick = createNewUser;


    createTableHead(config);
    if (arguments.length === 2) {
        let tableData = arguments[1];
        createTableBody(config, tableData);
    } else {
        let url = config.apiUrl;
        let tableData = await getResponse(url);

        createTableBody(config, tableData);

    }
}

function createTableHead(config) {
    let table_head = document.createElement("thead");
    document.querySelector(".customers").appendChild(table_head);
    let head = document.createElement("tr");
    table_head.appendChild(head);
    let head_cell = document.createElement("th");
    head_cell.innerHTML = "№";
    head.appendChild(head_cell);
    for (let i = 0; i < config.columns.length; i++) {
        let head_cell = document.createElement("th");
        head_cell.innerHTML = `${config.columns[i].title}`;
        head.appendChild(head_cell);
    }

    let head_cell_action = document.createElement("th");
    head_cell_action.innerHTML = "Action";
    head.appendChild(head_cell_action);
}

function createTableBody(config, data) {
    let table_body = document.createElement("tbody");
    document.querySelector(".customers").appendChild(table_body);
    let counter = 1;// the serial number

    for (let key in data) {
        let row = document.createElement("tr");
        row.id = data[key].id;
        table_body.appendChild(row);
        let col = document.createElement("td");
        col.innerHTML = counter++;
        row.appendChild(col);

        for (let j = 0; j < config.columns.length; j++) {
            let col = document.createElement("td");
            let tableValue = config.columns[j].value;
            if (tableValue === "birthday") {
                let dateOfBirth = data[key][config.columns[j].value];
                //corrects the birth date format
                dateOfBirth = dateOfBirth.substring(0, 10);
                col.innerHTML = `${dateOfBirth}`;
                row.appendChild(col);
            } else {
                col.innerHTML = `${data[key][config.columns[j].value]}`;
                row.appendChild(col);
            }
        }

        createButton(row);
    }
}

function createButton(row) {
    let col = document.createElement("td");
    let button = document.createElement("button");
    button.innerHTML = "Delete";
    button.classList.add("button_style");
    button.classList.add("button_style_delete");
    col.appendChild(button);
    row.appendChild(col);
    let userId;//
    button.onclick = function () {
        deleteUser(userId)
    }
}

async function deleteUser(userId) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error("url is not find")
    }

}

async function getResponse(url) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error("url is not find")
    }
    let json = await response.json();
    return json.data;
}


function createNewUser(){
    document.getElementById("usersTable").innerHTML = `
<tr>
    <form autocomplete="off" class="form">
   <td> <input type="text" id ="name"></td>
<td>  <input type="text" id ="surname"></td>
  <td>  <input type="text" id ="avatar"></td>
    <td>  <input type="text" id ="birthday"></td>
    
    </form>
</tr>`;
    console.log("Hi");


}


DataTable(config2);


