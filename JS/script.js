document.addEventListener('DOMContentLoaded', function() {
    // LIST PAGES
    if (document.title === 'List of Entities'){
        let pageName = window.location.search.slice(1)
        updateTitle(pageName);
        updateHeader(pageName);   
        populateTable(pageName);     
    }

})

function updateTitle(pageName){
    if (pageName === 'customers') { document.title = 'Customers';
    } 
    else if (pageName === 'teas'){ document.title = 'Teas';
    }
    else if (pageName === 'orders'){ document.title = 'Orders'
    }
}

function updateHeader(pageName){
    let header = document.querySelector('.results_header')

    if (pageName === 'customers') { header.textContent = 'Customers';
    } 
    else if (pageName === 'teas'){ header.textContent = 'Teas';
    }
    else if (pageName === 'orders'){ header.textContent = 'Orders';
    }
}


function populateTable(pageName){
    makeHeaders(pageName);
    fillData(pageName);

    // query database (call separate func)
}

function makeHeaders(pageName){
    const tableHeaders = {
        customers: ['Name', 'Nation', 'Bender', 'Element'],
        teas: ['Name', 'Caffeinated'],
        orders: ['Date', 'Customer', 'Tea']
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

function fillData(pageName){
    const dummyData = {
        customers: [{
            'Name': 'Ang',
            'Nation': 'Air Nomad', 
            'Bender': true,
            'Element': 'All (Avatar)'
        }], 
        teas:[{
            'Name': 'Jasmine',
            'Caffeinated': 'true'}],
        orders: [{
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
    event.preventDefault()
}