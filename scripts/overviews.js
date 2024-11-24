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
    expenseDisplay.textContent = `Total expenses this month: ${sumProperty(grouped).toFixed(2)}`
}


function categoriseExpenses(expenses) {
    const categorised = Object.groupBy(expenses, ({ type }) => type.trim());
    // Iterate over each category and sum the property
    for (const [category, expensesArray] of Object.entries(categorised)) {
        const total = sumProperty(expensesArray);
        console.log(`${category}:`, total.toFixed(2));
    }

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