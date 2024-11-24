/** 
 * @module overview
 * @description This module handles the grouping and display of expenses based on month, day etc.
 *  
 */


let expenseDisplay = document.querySelector("#overview-display")


function expenseMonth(expense) {
    return new Date(expense.date).getMonth() + 1
}

function expenseDay(expense) {
    return new Date(expense.date).getDay()
}

window.expenseDay = expenseDay;

window.expenseMonth = expenseMonth;
window.testExpenses = JSON.parse(localStorage.getItem("expenses"))

export function updateMonthlyExpensesDisplay(expenses) {
    let grouped = Object.groupBy(expenses, expenseMonth);
    grouped = grouped[new Date().getMonth()+1]
    categoriseExpenses(expenses)
    expenseDisplay.querySelector(".total").textContent = `Total expenses this month: ${sumProperty(grouped).toFixed(2)}`
}


function categoriseExpenses(expenses) {
    const categorised = Object.groupBy(expenses, ({ type }) => type.trim());
    // Iterate over each category and sum the property

    // First, create an array of [category, total] pairs and sort it by total
    const sortedCategories = Object.entries(categorised).map(([category, expensesArray]) => {
        const total = sumProperty(expensesArray);
        return [category, total];
    }).sort((a, b) => b[1] - a[1]);  // Sort in descending order by total (b[1] - a[1])

    // Then, iterate through the sorted array and log/append to the table
    for (const [category, total] of sortedCategories) {
        addCategoryToTable(category, total);
    }

}


function addCategoryToTable(category, total) {
    
    const categoriesTable = document.querySelector("#categories tbody");

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


    // Adppend the row to the table 
    categoriesTable.appendChild(categoriesRow)
}



/**
 * Takes an array and returns the sum of values for a specified property,
 * rounded to 2 decimal places
 * 
 * @param {Array} array     Array of objects for which a property needs to be summed 
 * @param {*} propertyName  Name of the property to sum up, default is 'amount' 
 * @returns {Number}        Sum of properties with the specified name, rounded to
 *                          2 decimal places
 */
function sumProperty(array, propertyName = "amount") {
    return Math.round(array.reduce((n, obj) => n + obj[propertyName], 0) * 100) / 100;
}