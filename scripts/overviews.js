/** 
 * @module overview
 * @description This module handles the grouping and display of expenses based on month, day etc.
 *  
 */


let expenseDisplay = document.querySelector("#overview-display")


export function expenseMonth(expense) {
    return new Date(expense.date).getMonth() + 1
}

export function expenseDateTime(expense) {
    return new Date(expense.date)
}

export function expenseDay(expense) {
    return new Date(expense.date).getDay()
}


/**
 * Updates the text (most importantly the value) displayed in the
 * "Total expenses this month" text.
 */
export function updateTotalMonthlyExpensesDisplay(expenses) {
    let grouped = groupExpensesMonthly(expenses);
    categoriseExpenses(grouped)
    
}

function groupExpensesMonthly(expenses) {
    let grouped = Object.groupBy(expenses, expenseMonth);
    grouped = grouped[new Date().getMonth()+1]
    return grouped
}



function categoriseExpenses(grouped) {
    const categorised = Object.groupBy(grouped, ({ type }) => type.trim());
    // Iterate over each category and sum the property
    // First, create an array of [category, total] pairs and sort it by total
    const sortedCategories = Object.entries(categorised).map(([category, expensesArray]) => {
        const total = sumPropertyArray(expensesArray);
        return [category, total];
    }).sort((a, b) => b[1] - a[1]);  // Sort in descending order by total (b[1] - a[1])
    updateCategoriesTable(sortedCategories, grouped);
    updateTotalMonthlyExpensesText(sumValuesArray(sortedCategories, 1).toFixed(2))
}


function updateCategoriesTable(sortedCategories, grouped) {
    const categoriesTable = document.querySelector("#categories tbody");
    categoriesTable.innerHTML = ""
    let categoriesObject = Object.fromEntries(
        sortedCategories.map(([key, value]) => [key, { amount: value }])
    );
        // Iterate through the sorted array and append to the table
    for (const [category, total] of sortedCategories) {
        let categoriesRow = document.createElement('tr')
        // Create a td for each property and set its textContent
        const typeTd = document.createElement("td");
        typeTd.textContent = category;

        const amountTd = document.createElement("td");
        amountTd.textContent = `€${total.toFixed(2)}`; // Format amount as currency
        amountTd.style.textAlign = 'right'
        amountTd.style.paddingLeft = '1rem' // Avoid numbers being too long 

        // Append each td to the categoriesRow
        categoriesRow.appendChild(typeTd);
        categoriesRow.appendChild(amountTd);
        categoriesObject[category]["exclude"] = false
        categoriesRow.addEventListener("click", (event) => toggleCategory(event, category, categoriesObject))
        // Append the row to the table 
        categoriesTable.appendChild(categoriesRow)
    }  
}



/* function findCategory(array, category) {
    for (let [index, element] of array.entries()) {
        if (element[0] == category) {
            return index
        }
    }
    return false
} */

function toggleCategory(event, category, categoriesObject) {
    const classes = event.target.parentNode.classList;
    categoriesObject[category]["exclude"] = classes.toggle("excluded-category");
    
    const totalAmount = Object.values(categoriesObject).reduce((sum, item) => {
        return item.exclude ? sum : sum + item.amount;
    }, 0);    

    updateTotalMonthlyExpensesText(totalAmount.toFixed(2))    
}

/**
 * Takes an array of objects and returns the sum of values for a specified property,
 * rounded to 2 decimal places
 * 
 * @param {Array} array     Array of objects for which a property needs to be summed 
 * @param {*} propertyName  Name of the property to sum up, default is 'amount' 
 * @returns {Number}        Sum of properties with the specified name, rounded to
 *                          2 decimal places
 */
function sumPropertyArray(array, propertyName = "amount") {
    return Math.round(array.reduce((n, obj) => n + obj[propertyName], 0) * 100) / 100;
}

/**
 * Takes an array and sums its values. Optionally, it sums the nth value of 
 * each sub-array in an array
 * 
 * @param {Array} array 
 * @param {Number} index    Optional - if specified, the function returns the sum of
 *                          nth values of the sub-arrays in the array
 */
function sumValuesArray(array, index = 0) {
    let sum = 0
    if (index == 0) {
        for (let element of array) {
            sum += element
        }
    } else {
        for (let element of array) {
            sum += element[index]
        }
    }
    return sum
}


function updateTotalMonthlyExpensesText(totalMonthlyExpenses) {
    expenseDisplay.querySelector(".total").textContent = `Total expenses this month: ${totalMonthlyExpenses}`
}