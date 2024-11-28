import { updateMonthlyExpensesDisplay } from "./overviews.js";

export function populateExpenseList(expenses) {
    document.querySelector("#expensesList tbody").innerHTML = ""

    if (expenses.length > 0) {
        for (let expense of expenses) {
            addExpenseToTable(expense, expenses)
        }
        updateMonthlyExpensesDisplay(expenses)
    }

}


/**
 * Add expense to the rendered table
 * @param {*} expense   The new expense to be registered
*/
export function addExpenseToTable(expense, expenses) {
    
    const expensesListTable = document.querySelector("#expensesList tbody");

    let expenseListRow = document.createElement('tr')

    // Create a td for each property and set its textContent
    const nameTd = document.createElement("td");
    nameTd.textContent = expense.name;

    const typeTd = document.createElement("td");
    typeTd.textContent = expense.type.trim();

    const amountTd = document.createElement("td");
    amountTd.textContent = `€${expense.amount.toFixed(2)}`; // Format amount as currency
    amountTd.style.textAlign = 'right'
    amountTd.style.paddingLeft = '1rem' // Avoid numbers being too long 

    const dateTd = document.createElement("td");

    const dateObject = new Date(expense.date)
    // Format the date to display as "dd-mm"
    const day = String(dateObject.getDate()).padStart(2, '0');    // Get day with leading zero
    const month = dateObject.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
    
    // Combine day and month
    const formattedDate = `${day}-${month}`;

    dateTd.textContent = formattedDate;
    dateTd.style.textAlign = 'right'        

    // Append each td to the expenseListRow
    expenseListRow.appendChild(nameTd);
    expenseListRow.appendChild(typeTd);
    expenseListRow.appendChild(amountTd);
    expenseListRow.appendChild(dateTd);


    // expenseListRow.addEventListener("click", () => editExpense(expense, expenses))


    // Adppend the row to the table 
    expensesListTable.appendChild(expenseListRow)
}




function editExpense(expense, expenses) {
    expense.name = `EDIT ${expense.name}`
    populateExpenseList(expenses)
}

