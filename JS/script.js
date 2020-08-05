const dataKeys = {
    customer: ['charname', 'naysh', 'bender', 'element'],
    tea: ['name', 'caffeinated'],
    order: ['order_id', 'order_date', 'status', 'charname', 'tea'],
    nation: [`name`, `capital`, `ruler`, `element_id`],
    element: [`name`, `original_bender`] 
}

const tableHeaders = {
    customer: ['Name', 'Nation', 'Bender', 'Element'],
    tea: ['Name', 'Caffeinated'],
    order: ['Order Number', 'Date', 'Order Status', 'Customer', 'Tea']
}

document.addEventListener('DOMContentLoaded', function() {

    if (document.title !== 'The Jasmine Dragon'){
        let pageName = window.location.search.slice(1).split('?')[0];

        if (pageName.includes('list')){
            updateTitle(pageName);
            updateHeader(pageName);
            populateTable(pageName);
            changeAddBtn(pageName);

            // clear the fields
            document.querySelector('#order_search').value = '';
            document.querySelector('#name_search').value = '';

            if (pageName.includes('tea')) {
                document.getElementById('search_bar').style.display = 'none';
            } else if (pageName.includes('customer')) {
                document.querySelector('.order_search').style.display = 'none'
            }
            document.querySelector('.search_btn').addEventListener('click', searchTable);
        } 
        else if (pageName.includes('edit') || pageName.includes('add')){
            updateTitle(pageName);
            updateHeader(pageName);
            updateForm(pageName);
            updateBackButton(pageName);
            if (pageName.includes('add')){
                fillFormData();
            }
            document.querySelector('.form_btn').addEventListener('click', insertEdit);
        }
        else if (String(window.location).includes('detail')){
            let entity = window.location.search.slice(1).split('&')[0];
            let id = window.location.search.split('&')[1];

            if (entity === 'order' || entity === 'tea'){
                document.querySelector('.cust_orders').style.display = 'none';
            }
        
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
    // query database for entity information
    let request = new XMLHttpRequest();

    const entInfo = {id: id};
    request.open("GET", `http://flip3.engr.oregonstate.edu:4568/ind-${entity === 'customer' ? 'char' : entity}?id=${id}`, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function(){
        myResponse = JSON.parse(request.responseText);
        if (entity === 'customer') customerDeets(myResponse);
        else if (entity === 'tea') teaDeets(myResponse['results'][0]);
        else if (entity === 'order') orderDeets(myResponse['results'][0]); 
    })
    request.send(null);
}

function customerDeets(data) {
    let custData = data['results'][0];
    document.querySelector('.entity_name').textContent = custData.name
    for (let attribute of ['Nation', 'Bender', 'Element']) {
        let newDiv = document.createElement('div');
        let newLabel = document.createElement('h3');
        let newData = document.createElement('span');

        newLabel.textContent = attribute;
        newDiv.appendChild(newLabel)

        if (attribute === 'Nation') newData.textContent = custData.nation;
        else if (attribute === 'Bender') newData.textContent = custData.bender === 1 ? 'Yes' : 'No';
        else newData.textContent = custData.element;

        newDiv.appendChild(newData)
        document.querySelector('.attributes').appendChild(newDiv)
    }

    createCustOrderTable(data['orders']);
    addNewOrderBtn(data.name);   
}

function createCustOrderTable(data){
    makeHeaders('order_deets');
    fillData(data, 'order_deets')
}

function addNewOrderBtn(name){
    let orderSection = document.querySelector('.cust_orders');
    let orderBtn = document.createElement('a');
    orderBtn.className = 'add_btn'
    orderBtn.href = `edit.html?order_add?${name}`
    let btn = document.createElement('button');
    btn.textContent = 'Add New Order';
    orderBtn.appendChild(btn);

    orderSection.parentNode.insertBefore(orderBtn, orderSection.nextSibling)

}

function teaDeets(data){
    document.title = data.name;
    document.querySelector('.entity_name').textContent = data.name
    for (let attribute of ['Tea Name', 'Caffeinated']) {
        let newDiv = document.createElement('div');
        let newLabel = document.createElement('h3');
        let newData = document.createElement('span');

        newLabel.textContent = attribute;
        newDiv.appendChild(newLabel)

        if (attribute === 'Tea Name') newData.textContent = data.name;
        else if (attribute === 'Caffeinated') newData.textContent = data.caffeinated === 1 ?
        'Caffeinated' : 'Decaf';

        newDiv.appendChild(newData)
        document.querySelector('.attributes').appendChild(newDiv)
    }
}

function orderDeets(data){
    document.title = `Order No. ${data.order_id}`;
    document.querySelector('.entity_name').textContent = `Order Number ${data.order_id}`;

    for (let attribute of ['Status', 'Date', 'Customer', 'Tea']) {
        let newDiv = document.createElement('div');
        let newLabel = document.createElement('h3');
        let newData = document.createElement('span');

        newLabel.textContent = attribute;
        newDiv.appendChild(newLabel)
        if (attribute === 'Status') newData.textContent = data.status;
        else if (attribute === 'Date') {
            let dateArr = data.order_date.slice(0,10).split('-');
            newData.textContent = `${Number(dateArr[1])}/${Number(dateArr[2])}/${dateArr[0]}`;
        }
        else if (attribute === 'Customer') newData.textContent = data.charname;
        else newData.textContent = data.tea;

        newDiv.appendChild(newData);
        document.querySelector('.attributes').appendChild(newDiv)
    }
}

function changeAddBtn(pageName){
    //select the add button
    let addBtn = document.querySelector('.add_btn');
    addBtn.lastElementChild.textContent = (pageName.includes('customer')) ? 'Add New Customer' : (pageName.includes('tea')) ? 'Add New Tea' : 'Add New Order';

    addBtn.href = `edit.html?${(pageName.includes('customer')) ? 'customer_add' : (pageName.includes('tea')) ? 'tea_add' : 'order_add'}`;
}

function populateTable(pageName){
    makeHeaders(pageName);

    let request = new XMLHttpRequest();
    const route = pageName === 'customer_list' ? 'chars' : pageName === 'tea_list' ? 'teas' : 'orders';
    request.open("GET", `http://flip3.engr.oregonstate.edu:4568/${route}`, true);
    request.addEventListener('load', function(){
        myResponse = JSON.parse(request.responseText)['results'];
        fillData(myResponse, pageName);
    })
    request.send(null);
}

function makeHeaders(pageName){

    //make header
    let newRow = document.createElement('tr');
    newRow.className = 'table_head';

    for (let header of tableHeaders[pageName.split('_')[0]]){
        let newCell = document.createElement('th');
        newCell.textContent = header;
        newRow.appendChild(newCell)
    }

    let newCell = document.createElement('th')
    newCell.textContent = 'View / Edit / Delete';
    newRow.appendChild(newCell)


    document.querySelector('.results_table').appendChild(newRow);
}

function fillData(data, pageName){
    for(let i = 0; i < data.length; ++i){
        let newRow = document.createElement('tr');
        newRow.className = pageName.includes('order') ? `${data[i]['order_id']} ${data[i]['charname']}` : data[i]['charname'];
        newRow.id = data[i]['order_id'] || data[i]['tea_id'] || data[i]['character_id']
        
        const keys = dataKeys[pageName.split('_')[0]]
        for (let j = 0; j < keys.length; ++j) {
            let newCell = document.createElement('td');
            if (keys[j] === 'bender'){
                newCell.textContent = data[i][keys[j]] === 1 ? 'Yes' : 'No';
            } else if (keys[j] === 'element') {
                newCell.textContent = data[i][keys[j]] !== null ? data[i][keys[j]] : 'NA';
            } else if (keys[j] === 'order_date') {
                let dateArr = data[i][keys[j]].slice(0,10).split('-');
                newCell.textContent = `${Number(dateArr[1])}/${Number(dateArr[2])}/${dateArr[0]}`
            } else if (keys[j] === 'caffeinated') {
                newCell.textContent = data[i][keys[j]] === 1 ? 'Caffeinated' : 'Decaf'
            } else {
                newCell.textContent = data[i][keys[j]];
            }
            newRow.appendChild(newCell)
        }
        newRow.appendChild(addFormBtns(data[i]));

        document.querySelector('.results_table').appendChild(newRow);
    }
}

function addFormBtns(data){
    tableBtns = [['view_entry','<ion-icon name="eye-outline"></ion-icon>',viewEntry],
                ['edit_entry','<ion-icon name="pencil-outline"></ion-icon>',editEntry],
                ['remove_entry','<ion-icon name="trash-outline"></ion-icon>',delEntry]];
    let newCell = document.createElement('td');
    let cellForm = document.createElement('form');
    cellForm.method = 'POST';

    for(let button of tableBtns){
        let cellBtn = document.createElement('button');
        cellBtn.type = 'submit';
        cellBtn.value = data['order_id'] || data['character_id'] || data['tea_id'];
        cellBtn.name = button[0];
        cellBtn.id = button[0];
        cellBtn.innerHTML = button[1];
        cellBtn.addEventListener('click',function(){
            button[2](data['order_id'] || data['character_id'] || data['tea_id'], 
            data['order_id'] ? 'order' : data['character_id'] ? 'customer' : 'tea')});
        cellForm.appendChild(cellBtn);
    }

    newCell.appendChild(cellForm);

    return newCell;
}

function viewEntry(id, entity){
    window.location.href=`detail.html?${entity}&${id}`
    event.preventDefault();
}

function editEntry(id, entity){
    window.location.href=`edit.html?${entity}_edit?${id}`;
    event.preventDefault();
}

function delEntry(id, entity){
    // determine route based on entity
    const routeName = (entity === 'customer') ? 'chars' : `${entity}s`
    const delData = {'id': id}
    // submit query with id
    let request = new XMLHttpRequest();
    request.open('DELETE', `http://flip3.engr.oregonstate.edu:4568/${routeName}`,true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function(){
        document.getElementById(id).style.display = 'none'
    })
    request.send(JSON.stringify(delData));

    event.preventDefault();
}

function searchTable(){
    console.log('searched')
    let rows = document.querySelectorAll('tr');
    let nameSearch = document.getElementById('name_search');
    let orderSearch = document.getElementById('order_search');

    for (let node of rows){
        if (!nameSearch.value && !orderSearch.value) {
            node.style.display = '';
        } else {
            if (!node.className.includes(nameSearch.value || orderSearch.value) && node.className !== 'table_head'){
                node.style.display = 'none'
            }
        }
    }
}

function updateForm(pageName){
    // object of innerHTML
    const pageForms = {
        customer: '<div><label for="name">Customer Name</label><input type="text" name="name" id = "name" required=""></div><div><label for="select_nation">Nation <a class="silly_add" href="edit.html?nation_add"><br>add a nation</a></label><select name="nation" id="select_nation"><option selected="true" value=null default> -- select a nation -- </option></select></div><div><label for="bender">Bender? <a class="silly_add" href="edit.html?element_add"><br>add an element</a></label><select name="bender" id="bender"><option value=null default>No</option></select></div><input class="form_btn" type="submit" name="add_cust" value="Add Customer">',

        tea: '<div><label for="tea_name">Tea Name</label><input type="text" name="name" id="tea_name" required></div><div><label for="caff">Caffeinated?</label><div><input type="radio"  class="caff" name="caff" value="1">True<input type="radio" class="caff" name="caff" value="0">False</div></div><input class="form_btn" type="submit" name="add_tea" value="Add Tea">',

        nation: '<div><label for="nation">Nation</label><input type="text" name="name" id= "nation" required></div><div><label for="capital">Capital</label><input type="text" name="capital" id="capital"></div><div><label for="ruler">Ruler</label><input type="text" name="ruler" id="ruler"></div><div><label for="element">National Element <a class="silly_add" href="edit.html?element_add"><br>add element</a></label></label><select name="element" id="element"><option value=null default>None</option></select></div><input class="form_btn" type="submit" name="add_nation" value="Add Nation">',

        element: '<div><label for="element_name">Element</label><input type="text" name="name" id="element_name" required></div><div><label for="first_bender">Original Bender</label><input type="text" name="first_bender" id="first_bender"></div><input class="form_btn" type="submit" name="add_element" value="Add Element">',

        order: '<div><label for="date">Order Date</label><input class="date" type="date" name="date" id="date" required></div><div><label for="customer">Customer</label>                    <select name="customer" id="customer"><option value=null default> -- select a customer -- </option></select></div><div class="tea_selection"><label>Tea<br><a class="silly_add" href="edit.html?tea_add">Add a tea</a></label><select id="tea_select"><option value=null default> -- select a tea -- </option></select></div><div><label for="order_status">Order Status<br></label><select name="order_status" id="order_status"><option value="new">New</option><option value="in_process">Processing</option><option value="complete">Complete</option><option value="canceled">Canceled</option></select></div><input class="form_btn" type="submit" name="add_order" value="Add Order">',

        status: '<div><label for="status">Status Label</label><input name="status" type="text" id="status"></div><input class="form_btn" type="submit" name="add_status" value="Add Order Status">'
    };

    // update form
    let formChoice = window.location.search.slice(1).split('_')[0];
    let pageForm = document.querySelector('.master_form');

    pageForm.innerHTML = pageForms[formChoice];

    if (pageName.includes('customer') || pageName.includes('order') || pageName.includes('nation')) {
        makeOptions(pageName);
    }

    if (pageName.includes('edit')) {
        // change button name & value
        document.querySelector('.form_btn').value = 
            'Update ' +document.querySelector('.form_btn').value.split(' ').slice(1)

        document.querySelector('.form_btn').name = 
            'update_' + document.querySelector('.form_btn').name.split('_').slice(1)        
    }

    // if adding a new order from the customer details page
    if (pageName === 'order_add' && window.location.search.slice(1).split('?')[1]) {
        let custField = document.getElementById('customer');
        // put customer name in customer field
        custField.value = window.location.search.slice(1).split('?')[1];
    }
}

function makeOptions(pageName){
    if (pageName.includes('customer')){
        fillOptions('nations', 'select_nation');
        fillOptions('elements', 'bender')
    }

    if (pageName.includes('nation')){
        fillOptions('elements', 'element');
    }
    
    if (pageName.includes('order')){
        fillOptions('chars', 'customer')
        fillOptions('teas', 'tea_select');
    }
}

async function fillOptions(route, id){
    const optionField = document.getElementById(id);
    
    let request = new XMLHttpRequest();
    request.open("GET", `http://flip3.engr.oregonstate.edu:4568/${route}`, true);
    request.addEventListener('load', function(){
        myResponse = JSON.parse(request.responseText)['results'];
        
        for (let item of myResponse){
            let newOp = document.createElement('option');
            newOp.value = item['element_id'] || item['nation_id'] || item['tea_id'] || item['character_id'];
            newOp.text = item['name'] || item['charname'];
            optionField.appendChild(newOp);
        }
        if (id === 'bender'){
            let newOp = document.createElement('option');
            newOp.value = 'avatar';
            newOp.text = 'Avatar (all)';
            optionField.appendChild(newOp);
        }
    })
    request.send(null);
}

function fillFormData(){
    // get url parameters (set them to match input id)
    // put data in fields
}

function insertEdit(){
    let routeMethod; 
    const pageName = window.location.search.slice(1).split('?')[0];
    const routeName = (pageName.split('_')[0] === 'customer') ? 'chars' : `${pageName.split('_')[0]}s`;
    
    // if add use route
    if (pageName.includes('add')) {
        routeMethod = 'POST';
        
    } else {
        routeMethod = 'PUT';
    }
    // package data
    const queryData = packageData(pageName.split('_') [0]);

    // send query
    let request = new XMLHttpRequest();
    request.open(routeMethod, `http://flip3.engr.oregonstate.edu:4568/${routeName}`,true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function(){
        // redirect to previous page
        location.replace(document.referrer);
    });
    request.send(JSON.stringify(queryData))
    event.preventDefault();
}

function packageData(entity) {
    let queryData = {}

    if (entity == 'customer'){
        queryData.bender = document.getElementById('bender').value;
        queryData.name = document.getElementById('name').value;
        queryData.nation = document.getElementById('select_nation').value;
    } 
    else if (entity == 'tea'){
        queryData.name = document.getElementById('tea_name').value;
        // figure out which radio is selected
        let caff = Array.from(document.querySelectorAll('.caff'));
        queryData.caffeinated = caff[0].checked ? 1 : 0;
    }
    else if (entity == 'order'){
        queryData.date = document.getElementById('date').value;
        queryData.char = document.getElementById('customer').value;
        queryData.tea = document.getElementById('tea_select').value;
        queryData.status = document.getElementById('order_status').value;
    }
    else if (entity == 'nation'){
        queryData.name = document.getElementById('nation').value;
        queryData.captal = document.getElementById('capital').value;
        queryData.ruler = document.getElementById('ruler').value;
        queryData.element_id = document.getElementById('element').value;
    }
    else if (entity == 'element'){
        queryData.name = document.getElementById('element_name').value;
        queryData.original_bender = document.getElementById('first_bender').value;
    }

    return queryData
}