$(document).ready(function(){
    var products = productsJSON["products"];
    // productsMap is the mapping of subcategory to the products belonging 
    // to it. It is defined as a global variable so that it can be accessed
    // from anywhere
    productsMap = generateProductsMap(products);
    // productIndex refers to the index in the products array from
    // where we start displaying products. For example, if the product 
    // index is 9 and num of entries from the dropdown is 10, we show 
    // products from index 10-19 in the products array in the table. This 
    // helps in pagination
    productIndex = -1;
    
    var numOfEntries = $(".show-entries-dropdown").val();
    populateTable(numOfEntries);
    
});

/*
 Constructor for product objects
*/
var Product = function(subcategory, title, price, popularity){
    this.subcategory = subcategory;
    this.title = title;
    this.price = price;
    this.popularity = popularity;
}

/*
 Generates a map of product objects with keys as subcategory
 i.e. All, tablet, smartWatches, mobile, fitnessTracker and value
 as products belonging to that subcategory sorted in descending 
 order based on popularity
*/

function generateProductsMap(products){

    var productsMap = {};
    var productsArray = [];
    var tabletArray = [];
    var smartWatchesArray = [];
    var mobileArray = [];
    var fitnessTrackerArray = [];
    
    
    for (var key in products) {
        if (products.hasOwnProperty(key)) {
            var productJSON = products[key];

            var subcategory = productJSON.subcategory;
            var title = productJSON.title;
            var price = productJSON.price;
            var popularity = parseInt(productJSON.popularity);

            var product = new Product(subcategory, title, price, popularity);
            productsArray.push(product);
            
            if(subcategory === "tablet"){
                tabletArray.push(product);
            }
            else if(subcategory === "smart-watches"){
                smartWatchesArray.push(product);
            }
            else if(subcategory === "mobile"){
                mobileArray.push(product);
            }
            else if(subcategory === "fitness-tracker"){
                fitnessTrackerArray.push(product);
            }
        }  
    }
    productsArray.sort(function(product1, product2){
        return product2.popularity - product1.popularity;
    });
    tabletArray.sort(function(product1, product2){
        return product2.popularity - product1.popularity;
    });
    smartWatchesArray.sort(function(product1, product2){
        return product2.popularity - product1.popularity;
    });
    mobileArray.sort(function(product1, product2){
        return product2.popularity - product1.popularity;
    });
    fitnessTrackerArray.sort(function(product1, product2){
        return product2.popularity - product1.popularity;
    });
    
    productsMap["All"] = productsArray;
    productsMap["tablet"] = tabletArray;
    productsMap["smartWatches"] = smartWatchesArray;
    productsMap["mobile"] = mobileArray;
    productsMap["fitnessTracker"] = fitnessTrackerArray;
    
    return productsMap;
}

/*
 Generates the html elements for the table based on the array of
 products passed to it
*/

function generateTable(productsArray){
    
    var table = $("<table class = 'table'></table>");
    var tableHead = $("<thead></thead>");
    
    var tableRow = $("<tr></tr>");
    var subcategoryHead = $("<th class='subcategory'>Subcategory</th>");
    var titleHead = $("<th class='title'>Title</th>");
    var priceHead = $("<th class='price'>Price</th>");
    var popularityHead = $("<th class='popularity'>Popularity</th>");
    
    $(tableRow).append(subcategoryHead);
    $(tableRow).append(titleHead);
    $(tableRow).append(priceHead);
    $(tableRow).append(popularityHead);
    
    $(tableHead).append(tableRow);
    
    $(table).append(tableHead);
    
    var tableBody = $("<tbody></tbody>");
    $(table).append(tableBody);
    
    $(".table-container").append(table);
    
    $.each(productsArray, function(key, value){
        generateRowForTable(value, tableBody);
    });
}

/*
 Generates the html elements for a row based on the product
 passed to it
*/

function generateRowForTable(product, tableBody){
    
    var tableRow = $("<tr></tr>");
    var subcategory = $("<td class='subcategory'>" + product.subcategory + "</td>");
    var title = $("<td class='title'>" + product.title + "</td>");
    var price = $("<td class='price'>" + product.price + "</td>");
    var popularity = $("<td class='popularity'>" + product.popularity + "</td>");
    
    $(tableRow).append(subcategory);
    $(tableRow).append(title);
    $(tableRow).append(price);
    $(tableRow).append(popularity);
    
    $(tableBody).append(tableRow);
}

/*
 Deletes the table and recreates it using new parameters.
*/

function populateTable(numOfEntries){
    $(".table").remove();
    
    var productsArrayForDisplay = [];
    
    var subcategory = $(".subcategory-dropdown").val();
    var productsArray = productsMap[subcategory];
    
    var i;
    // If the total number of products are lesser than the number of entries
    // in the dropdown, we need to select the number of products i.e. the
    // minimum of the two
    numOfEntries = Math.min(productsArray.length, numOfEntries);
    
    for(i=1; i<=numOfEntries; i++){
        var index = productIndex + i;
        var product = productsArray[index];
        if(product !== undefined){
            productsArrayForDisplay.push(product);
        }
    }
    
    generateTable(productsArrayForDisplay);
}

/*
 Recreates the table based upon the number of entries in the dropdown
 and starts showing from the first element i.e. productIndex = -1
*/

function changeEntries(numOfEntries){
    productIndex = -1;
    $(".show-entries-dropdown").val(numOfEntries);
    populateTable(parseInt(numOfEntries));
    generateShowEntriesText();
}

/*
 Recreates the table showing the previous products
*/

function previous(){
    var subcategory = $(".subcategory-dropdown").val();
    var productsArray = productsMap[subcategory];
    // Stops if we are showing the first elements
    if(productIndex !== -1){
        var numOfEntries = $(".show-entries-dropdown").val();
        var numOfEntriesInt = parseInt(numOfEntries);
        productIndex = productIndex - numOfEntriesInt;
        populateTable(numOfEntriesInt);
        generateShowEntriesText();
    }
}

/*
 Recreates the table showing the next products
*/

function next(){
    var subcategory = $(".subcategory-dropdown").val();
    var productsArray = productsMap[subcategory];
    var numOfEntries = $(".show-entries-dropdown").val();
    var numOfEntriesInt = parseInt(numOfEntries);
    numOfEntriesInt = Math.min(productsArray.length, numOfEntriesInt);
    
    var totalProducts = productsArray.length;
    var upperMultiple;
    // If the total products is not a multiple of the num of entries, 
    // we get the closest multiple above it
    if(totalProducts % numOfEntriesInt !== 0){
        upperMultiple = (parseInt(totalProducts/numOfEntriesInt)+1) * numOfEntriesInt;
    }
    else{
        upperMultiple = productsArray.length;
    }
    // Stops if we are showing the last elements
    if(productIndex !== (upperMultiple - numOfEntriesInt - 1)){
        productIndex = productIndex + numOfEntriesInt;
        populateTable(numOfEntriesInt);
        generateShowEntriesText();
    }
}

/*
 Recreates the table showing the first products
*/

function first(){
    var subcategory = $(".subcategory-dropdown").val();
    var productsArray = productsMap[subcategory];
    productIndex = -1;
    var numOfEntries = $(".show-entries-dropdown").val();
    var numOfEntriesInt = parseInt(numOfEntries);
    populateTable(parseInt(numOfEntriesInt));
    generateShowEntriesText();
}

/*
 Recreates the table showing the last products
*/

function last(){
    var subcategory = $(".subcategory-dropdown").val();
    var productsArray = productsMap[subcategory];
    var numOfEntries = $(".show-entries-dropdown").val();
    var numOfEntriesInt = parseInt(numOfEntries);
    numOfEntriesInt = Math.min(productsArray.length, numOfEntriesInt);
    
    var totalProducts = productsArray.length;
    var upperMultiple;
    if(totalProducts % numOfEntriesInt !== 0){
        upperMultiple = (parseInt(totalProducts/numOfEntriesInt)+1) * numOfEntriesInt;
    }
    else{
        upperMultiple = productsArray.length;
    }
    productIndex = upperMultiple - numOfEntriesInt - 1;
    populateTable(parseInt(numOfEntries));
    generateShowEntriesText();
}

/*
 Generates the text for depicting the current products being shown
*/

function generateShowEntriesText(){
    var subcategory = $(".subcategory-dropdown").val();
    var productsArray = productsMap[subcategory];
    var totalEntries = productsArray.length;
    var numOfEntries = $(".show-entries-dropdown").val();
    var numOfEntriesInt = parseInt(numOfEntries);
    numOfEntriesInt = Math.min(totalEntries, numOfEntriesInt);
    var upperEntry = productIndex + numOfEntriesInt + 1;
    if((productIndex+2+numOfEntriesInt)>=totalEntries){
        upperEntry = totalEntries;
    }
    var currentEntries = (productIndex + 2) + "-" + upperEntry;
    var showEntriesText = "Showing " + currentEntries + " of " + totalEntries;
    $(".show-entries-text").text(showEntriesText);
}

/*
 Recreates the table based on the subcategory chosen
*/

function changeSubcategory(subcategory){
    productIndex = -1;
    var defaultNumOfEntries = "10";
    $(".show-entries-dropdown").val(defaultNumOfEntries);
    populateTable(parseInt(defaultNumOfEntries));
    generateShowEntriesText();
}