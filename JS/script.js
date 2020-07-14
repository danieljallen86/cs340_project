const dummyData = {
    customer: [{
        'name': 'Ang',
        'nation': 'Air Nomad', 
        'bender': true,
        'element': 'All (Avatar)'
    }], 
    tea:[{
        'name': 'Jasmine',
        'caffeinated': 'true'}],
    order: [{
        'order_id': 1846,
        'date': '2020-07-12',
        'customer': 'Fire Lord Zuko',
        'tea': 'Jasmine'
    }]
}

const tableHeaders = {
    customer: ['Name', 'Nation', 'Bender', 'Element'],
    tea: ['Name', 'Caffeinated'],
    order: ['Order Number', 'Date', 'Customer', 'Tea']
}

document.addEventListener('DOMContentLoaded', function() {

    if (document.title !== 'The Jasmine Dragon'){
        let pageName = window.location.search.slice(1).split('?')[0];

        if (pageName.includes('list')){
            updateTitle(pageName);
            updateHeader(pageName);
            populateTable(pageName);
        } 
        else if (pageName.includes('edit') || pageName.includes('add')){
            updateTitle(pageName);
            updateHeader(pageName);
            updateForm(pageName);
            updateBackButton(pageName);
        }
        else if (String(window.location).includes('detail')){
            let entity = window.location.search.slice(1).split('&')[0];
            let id = window.location.search.split('&')[1];
        
            updateDetailPageBtns(entity, id);
            displayDetails(entity, id);
        }
    } 
})

function updateTitle(pageName){
    if (pageName === 'customer_list') document.title = 'Customers';
    else if (pageName === 'tea_list') document.title = 'Teas';
    else if (pageName === 'order_list') document.title = 'Orders';
    else if (pageName === 'customer_add') document.title = 'Add a Customer';
    else if (pageName === 'tea_add') document.title = 'Add a Tea';
    else if (pageName === 'order_add') document.title = 'Add an Order';
    else if (pageName === 'customer_edit') document.title = 'Update a Customer Record';
    else if (pageName === 'tea_edit') document.title = 'Update a Tea Record';
    else if (pageName === 'order_edit') document.title = 'Update an Order';  
    else if (pageName === 'nation_add') document.title = 'Add a Nation'
    else if (pageName === 'element_add') document.title = 'Add an Element'
    else if (pageName === 'nation_edit') document.title = 'Update a Nation Record';
    else if (pageName === 'element_edit') document.title = 'Update an Element';
    else if (pageName === 'status_add') document.title = 'Add An Order Status';
}

function updateHeader(pageName){
    var header = (pageName.includes('list')) ? 
        document.querySelector('.results_header') : 
        document.querySelector('.form_header');

    if (pageName === 'customer_list')  header.textContent = 'Customers';
    else if (pageName === 'tea_list') header.textContent = 'Teas';
    else if (pageName === 'order_list') header.textContent = 'Orders';
    else if (pageName === 'customer_add') header.textContent = 'Add a Customer';
    else if (pageName === 'tea_add') header.textContent = 'Add a Tea';
    else if (pageName === 'order_add') header.textContent = 'Add an Order';
    else if (pageName === 'customer_edit') header.textContent = 'Update a Customer Record'; 
    else if (pageName === 'tea_edit') header.textContent = 'Update a Tea Record';
    else if (pageName === 'order_edit') header.textContent = 'Update an Order';  
    else if (pageName === 'nation_add') header.textContent = 'Add a Nation';
    else if (pageName === 'element_add') header.textContent = 'Add an Element';
    else if (pageName === 'nation_edit') header.textContent = 'Update a Nation Record';
    else if (pageName === 'element_edit') header.textContent = 'Update an Element';
    else if (pageName === 'status_add') header.textContent = 'Add An Order Status';
}

function updateBackButton(pageName){
    let backBtn = document.querySelector('.back_btn');
    if (pageName.includes('status') || pageName.includes('nation') || pageName.includes('element')){
        backBtn.href = 'javascript:history.back()'
    } else {
        backBtn.href = `list.html?${pageName.split('_').slice(0,1)}_list`
    }
}

function updateDetailPageBtns(entity, id){
    let editBtn = document.querySelector('.edit_btn');
    let delBtn = document.querySelector('.del_btn');

    editBtn.href = `edit.html?${entity}_edit?${id}`;
    delBtn.addEventListener('click', delEntry);
}

function displayDetails(entity, id){
    // query database with id
    document.title = id;
    let data = dummyData[entity][0]
    console.log(data)
    if (entity === 'customer') customerDeets(data);
    else if (entity === 'tea') teaDeets(data);
    else if (entity === 'order') orderDeets(data);
}

function customerDeets(data) {
    document.querySelector('.entity_name').textContent = data.name
    for (let attribute of ['Nation', 'Bender', 'Element']) {
        let newDiv = document.createElement('div');
        let newLabel = document.createElement('h3');
        let newData = document.createElement('span');

        newLabel.textContent = attribute;
        newDiv.appendChild(newLabel)

        if (attribute === 'Nation') newData.textContent = data.nation;
        else if (attribute === 'Bender') newData.textContent = data.bender;
        else newData.textContent = data.element

        newDiv.appendChild(newData)
        document.querySelector('.attributes').appendChild(newDiv)
    }
}

function teaDeets(data){
    document.querySelector('.entity_name').textContent = data.name
    for (let attribute of ['Tea Name', 'Caffeinated']) {
        let newDiv = document.createElement('div');
        let newLabel = document.createElement('h3');
        let newData = document.createElement('span');

        newLabel.textContent = attribute;
        newDiv.appendChild(newLabel)

        if (attribute === 'Tea Name') newData.textContent = data.name;
        else if (attribute === 'Caffeinated') newData.textContent = data.caffeinated;

        newDiv.appendChild(newData)
        document.querySelector('.attributes').appendChild(newDiv)
    }
}

function orderDeets(data){
    document.querySelector('.entity_name').textContent = `Order No. ${data.order_id}`;

    for (let attribute of ['Date', 'Customer', 'Tea']) {
        let newDiv = document.createElement('div');
        let newLabel = document.createElement('h3');
        let newData = document.createElement('span');

        newLabel.textContent = attribute;
        newDiv.appendChild(newLabel)

        if (attribute === 'Date') newData.textContent = data.date.split('-').reverse().join('-');
        else if (attribute === 'Customer') newData.textContent = data.customer;
        else newData.textContent = data.tea

        newDiv.appendChild(newData)
        document.querySelector('.attributes').appendChild(newDiv)
    }
}

function populateTable(pageName){
    makeHeaders(pageName);
    fillData(pageName, dummyData[pageName.split('_')[0]]);
}

function makeHeaders(pageName){

    //make header
    let newRow = document.createElement('tr');

    for (let header of tableHeaders[pageName.split('_')[0]]){
        let newCell = document.createElement('th');
        newCell.textContent = header;
        newRow.appendChild(newCell)
    }

    let newCell = document.createElement('th')
    newCell.textContent = 'View / Edit / Delete';
    newRow.appendChild(newCell)


    document.querySelector('.resutls_table').appendChild(newRow);
}

function fillData(pageName, data){
    for(let i = 0; i < data.length; ++i){
        let newRow = document.createElement('tr');
        
        let dataKeys = Object.keys(data[0]);
        for (let j = 0; j < dataKeys.length; ++j) {
            let newCell = document.createElement('td');
            newCell.textContent = data[i][dataKeys[j]];
            newRow.appendChild(newCell)
        }
        newRow.appendChild(addFormBtns(newRow, data));

        document.querySelector('.resutls_table').appendChild(newRow);
    }
}

function addFormBtns(newRow, data){
    tableBtns = [['view_entry','<ion-icon name="eye-outline"></ion-icon>',viewEntry],
                ['edit_entry','<ion-icon name="pencil-outline"></ion-icon>',editEntry],
                ['remove_entry','<ion-icon name="trash-outline"></ion-icon>',delEntry]];
    console.log(data)           
    //add edit and remove buttons
    let newCell = document.createElement('td');
    let cellForm = document.createElement('form');
    cellForm.method = 'POST';

    for(let button of tableBtns){
        let cellBtn = document.createElement('button')
        cellBtn.type = 'submit';
        cellBtn.value = data[0]['name'] || data[0]['order_id'];
        cellBtn.name = button[0];
        cellBtn.id = button[0];
        cellBtn.innerHTML = button[1];
        cellBtn.addEventListener('click',function(){button[2](null)});
        cellForm.appendChild(cellBtn);
    }

    newCell.appendChild(cellForm);

    return newCell;
}

function viewEntry(){
    let id = event.srcElement.value;
    let entity = event.srcElement.ownerDocument.URL.split('?')[1].split('_')[0];
    window.location.href=`detail.html?${entity}&${id}`
    event.preventDefault();
}

function editEntry(){
    let entity = event.srcElement.ownerDocument.URL.split('?')[1].split('_')[0];
    let id = event.srcElement.value
    window.location.href=`edit.html?${entity}_edit?${id}`;
    event.preventDefault();
}

function delEntry(){
    event.preventDefault();
}

function updateForm(pageName){
    // object of innerHTML
    const pageForms = {
        customer: '<div><label for="name">Customer Name</label><input type="text" name="name" id = "name" required=""></div><div><label for="select_nation">Nation <a class="silly_add" href="edit.html?nation_add"><br>add a nation</a></label><select name="nation" id="select_nation"><option selected="true" value=null default> -- select a nation -- </option><option value="air">Air Nomad</option><option value="earth">Earth Kingdom</option><option value="fire">Fire Nation</option><option value="water">Water Tribe</option></select></div><div><label for="bender">Bender? <a class="silly_add" href="edit.html?element_add"><br>add an element</a></label><select name="bender" id="bender"><option value="none" default>No</option><option value="air">Air</option><option value="earth">Earth</option><option value="fire">Fire</option><option value="water">Water</option><option value="avatar">All (Avatar)</option></select></div><input class="form_btn" type="submit" name="add_cust" value="Add Customer">',

        tea: '<div><label for="tea_name">Tea Name</label><input type="text" name="name" id="tea_name" required></div><div><label for="caff">Caffeinated?</label><div><input type="radio" name="caff" id="caff" value="true">True<input type="radio" name="caff" ="true">False</div></div><input class="form_btn" type="submit" name="add_tea" value="Add Tea">',

        nation: '<div><label for="nation">Nation</label><input type="text" name="name" id= "nation" required></div><div><label for="captial">Capital</label><input type="text" name="capital" id="captial"></div><div><label for="ruler">Ruler</label><input type="text" name="ruler" id="ruler"></div><div><label for="element">National Element <a class="silly_add" href="edit.html?element_add"><br>add element</a></label></label><select name="element" id="element"><option value="none" default>None</option><option value="air">Air</option><option value="earth">Earth</option><option value="fire">Fire</option><option value="water">Water</option></select></div><input class="form_btn" type="submit" name="add_nation" value="Add Nation">',

        element: '<div><label for="element_name">Element</label><input type="text" name="name" id="element_name" required></div><div><label for="first_bender">Original Bender</label><input type="text" name="first_bender" id="first_bender"></div><input class="form_btn" type="submit" name="add_element" value="Add Element">',

        order: '<div><label for="date">Order Date</label><input class="date" type="date" name="date" id="date" required></div><div><label for="customer">Customer</label><input type="text" name="customer" id="customer" required></div><div class="tea_selection"><label>Tea</label><div><label>Green <input type="checkbox" name="green"></label><label>Black <input type="checkbox" name="black"></label><label>Herbal <input type="checkbox" name="herbal"></label></div></div><div><label for="order_status">Order Status<br><a class="silly_add" href="edit.html?status_add">Add a status</a></label><select name="order_status" id="order_status"><option value="new">New</option><option value="in_process">Processing</option><option value="complete">Complete</option><option value="canceled">Canceled</option></select></div><input class="form_btn" type="submit" name="add_order" value="Add Order">',

        status: '<div><label for="status">Status Label</label><input name="status" type="text" id="status"></div><input class="form_btn" type="submit" name="add_status" value="Add Order Status">'
    };

    // update update form
    let formChoice = window.location.search.slice(1).split('_')[0];
    let pageForm = document.querySelector('.master_form');

    pageForm.innerHTML = pageForms[formChoice];

    if (pageName.includes('edit')) {
        // fill form
            // query database 
            populateFields();

        // change button name & value
        document.querySelector('.form_btn').value = 
            'Update ' +document.querySelector('.form_btn').value.split(' ').slice(1)

        document.querySelector('.form_btn').name = 
            'update_' + document.querySelector('.form_btn').name.split('_').slice(1)        
    }
}

function populateFields(pageName){}