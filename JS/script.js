// LIST PAGES
document.addEventListener('DOMContentLoaded', function() {
    if (document.title = 'List of Entities'){
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
    let tableHeaders = {
        customers: ['Name', 'Nation', 'Bender', 'Element'],
        teas: ['Name', 'Caffeinated'],
        orders: ['Date', 'Customer', 'Tea']
    }

    // build headers

    // query database (call separate func)
}