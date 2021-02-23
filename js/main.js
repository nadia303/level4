const config1 = {
    parent: '#usersTable',
    columns: [
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age'},
    ]
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
//Saves the url address of the server where the data about users is located
let url;
//Saves the last id, so we cav create new id by incrementing it
let idForNewUser;

/*
 * The main function that creates the table
 * Receives the param config which is the configuration of the table
 */
async function DataTable(config) {
    document.getElementById("usersTable").innerHTML = `
    <div class="container">
    <div class = "interaction">
    <input class="search_user" type="text" id = "field_to_search"placeholder="Type here to search the user">
    <button class = "button_style button_style_add" id = "addBtn">Add</button>
    </div>
    <table class="customers"></table>
    </div>`;

    createTableHead(config);
    if (arguments.length === 2) {
        let tableData = arguments[1];
        createTableBody(config, tableData);
    } else {
        url = config.apiUrl;
        let tableData = await getResponse(url);
        createTableBody(config, tableData);
    }
    addButtonForNewUser();
    addSearchField();
}

/*
 * Adds the search field in order to find the user
 */
function addSearchField() {
    let input_field = document.getElementById("field_to_search");
    input_field.onkeyup = () => findTheUser();
}

/*
 * Invokes when the search value was entered
 */
function findTheUser() {
    let table = document.querySelector(".table_body")
    let input = document.getElementById('field_to_search').value;
    let tds = table.getElementsByTagName("tr");
    for (let i = 0; i < tds.length; i++) {
        let that = tds[i];
        if (that.innerText.toUpperCase().indexOf(input.toUpperCase()) > -1) {
            that.style.display = '';
        } else {
            that.style.display = 'none';
        }
    }
}

/*
 * Adds the button in order to add a new user
 */
function addButtonForNewUser() {
    let addBtn = document.getElementById("addBtn");
    addBtn.onclick = () => {
        let new_user = document.getElementById("new_user");
        new_user.classList.add("first_row_visible");
        let interaction = document.querySelector(".interaction");
        interaction.classList.add("first_row_notVisible");
    }
}

/*
 * Creates table head according to the received configuration (config)
 */
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

/*
 * Creates table bode according to the received configuration (config) and data
 */
function createTableBody(config, data) {
    let table_body = document.createElement("tbody");
    table_body.classList.add("table_body");
    document.querySelector(".customers").appendChild(table_body);
    createNewUser(config);
    let counter = 1;// the serial number

    for (let key in data) {
        let row = document.createElement("tr");
        row.id = data[key].id;
        idForNewUser = data[key].id; //in order to get the last id
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
        createButtonDelete(row);
    }
}

/*
 * Adds the delete button in order to delete user
 */
function createButtonDelete(row) {
    let col = document.createElement("td");
    let button = document.createElement("button");
    button.innerHTML = "Delete";
    button.classList.add("button_style_delete");
    button.classList.add("button_style");
    col.appendChild(button);
    row.appendChild(col);
    let userId = row.id;
    button.onclick = function () {
        deleteUser(userId)
    }
}

/*
 * Deletes the user when "delete" button is pressed
 */
function deleteUser(userId) {
    fetch(url + "/" + userId, {
        method: 'DELETE',
    })
        .then(res => res.text()) // or res.json()
        .then(res => console.log(res))
    window.location.reload(true);
}

/*
 * Gets the dara from server according to the received url
 */
async function getResponse(url) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error("url is not found")
    }
    let json = await response.json();
    return json.data;
}

/*
 * Creates the inputs in order to enter a data about new user
 */
function createNewUser(config) {
    let table_body = document.querySelector(".table_body");
    let row = document.createElement("tr");
    row.classList.add("first_row_notVisible");
    row.id = "new_user";
    table_body.appendChild(row);
    let col = document.createElement("td");
    row.appendChild(col);

    for (let j = 0; j < config.columns.length; j++) {
        let col = document.createElement("td");
        let input = document.createElement("input");
        input.onchange = () => input.classList.add("entered");
        input.classList.add("input_value");
        let tableValue = config.columns[j].value;
        input.id = tableValue;
        row.appendChild(col);
        col.appendChild(input);
    }
    createButtonAdd(row, config);
}

/*
 * Posy the new user on server according to the received data
 */
function postUser(newUserData) {
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newUserData)
    })
        .then(res => res.text()) // or res.json()
        .then(res => console.log(res))
    window.location.reload(true);
}

/*
 * Creates "add" button which adds the new user by invoking the function PostUser
 */
function createButtonAdd(row, config) {
    let col = document.createElement("td");
    let button = document.createElement("button");
    button.innerHTML = "Add";
    button.classList.add("button_style_add");
    button.classList.add("button_style");
    col.appendChild(button);
    row.appendChild(col);

    let newUserData = {};
    button.onclick = function () {
        for (let j = 0; j < config.columns.length; j++) {
            let key = config.columns[j].value;
            let oneValue = document.getElementById(key).value;
            if (oneValue) {
                newUserData[key] = oneValue;
            } else {
                document.getElementById(key).classList.add("not_entered");
            }
        }
        newUserData["id"] = ++idForNewUser;
        let dataLength = Object.keys(newUserData).length;
        if (dataLength === config.columns.length + 1) {
            postUser(newUserData);
        }
    }
}

DataTable(config2);



