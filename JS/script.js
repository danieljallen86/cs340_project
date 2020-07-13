document.addEventListener('DOMContentLoaded', function() {

    if (document.title !== 'The Jasmine Dragon'){
        let pageName = window.location.search.slice(1)
        updateTitle(pageName);
        updateHeader(pageName);

        if (pageName.includes('list')){
            populateTable(pageName);
        }
        
        if (pageName.includes('edit')){
            updateForm(pageName);
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
    
    else if (pageName === 'nation_add') header.textContent = 'Add a Nation'

    else if (pageName === 'element_add') header.textContent = 'Add an Element'
}

function populateTable(pageName){
    makeHeaders(pageName);
    fillData(pageName);
}

function makeHeaders(pageName){
    const tableHeaders = {
        customer_list: ['Name', 'Nation', 'Bender', 'Element'],
        tea_list: ['Name', 'Caffeinated'],
        order_list: ['Date', 'Customer', 'Tea']
    }

    //make header
    let newRow = document.createElement('tr');

    for (let header of tableHeaders[pageName]){
        let newCell = document.createElement('th');
        newCell.textContent = header;
        newRow.appendChild(newCell)
    }

    let newCell = document.createElement('th')
    newCell.textContent = 'Edit/Delete';
    newRow.appendChild(newCell)


    document.querySelector('.resutls_table').appendChild(newRow);
}

function fillData(pageName, data){
    const dummyData = {
        customer_list: [{
            'Name': 'Ang',
            'Nation': 'Air Nomad', 
            'Bender': true,
            'Element': 'All (Avatar)'
        }], 
        tea_list:[{
            'Name': 'Jasmine',
            'Caffeinated': 'true'}],
        order_list: [{
            'Date': '2020-07-12',
            'Customer': 'Fire Lord Zuko',
            'Tea': 'Jasmine'
        }]
    }

    for(let i = 0; i < dummyData[pageName].length; ++i){
        let newRow = document.createElement('tr');
        
        let dataKeys = Object.keys(dummyData[pageName][0]);
        for (let j = 0; j < dataKeys.length; ++j) {
            let newCell = document.createElement('td');
            newCell.textContent = dummyData[pageName][i][dataKeys[j]];
            newRow.appendChild(newCell)
        }
        newRow.appendChild(addFormBtns(newRow));

        document.querySelector('.resutls_table').appendChild(newRow);
    }
}

function addFormBtns(newRow){
    tableBtns = [['edit_entry','<ion-icon name="pencil-outline"></ion-icon>',editEntry],
                ['remove_entry','<ion-icon name="trash-outline"></ion-icon>',delEntry]];
            
    //add edit and remove buttons
    let newCell = document.createElement('td');
    let cellForm = document.createElement('form');
    cellForm.method = 'POST';

    for(let button of tableBtns){
        let cellBtn = document.createElement('button')
        cellBtn.type = 'submit';
        // cellBtn.value = data.id;
        cellBtn.name = button[0];
        cellBtn.id = button[0];
        cellBtn.innerHTML = button[1];
        cellBtn.addEventListener('click',function(){button[2](null)});
        cellForm.appendChild(cellBtn);
    }

    newCell.appendChild(cellForm);

    return newCell;
}

function editEntry(){
    event.preventDefault()
}

function delEntry(){
    event.preventDefault();
}

function updateForm(pageName){
    // list fields

    // update fields

    // if edit 
        // fill form
        // change button name
}

function updateFields(pageName){}

function populateFields(pageName){}