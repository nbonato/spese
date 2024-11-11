import { initializeExpenses, clearExpenses, exportExpenses } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeExpenses();

    // Button for clearing expenses
    document.getElementById("clearButton").addEventListener("click", () => {
        clearExpenses();
        alert("All expenses cleared.");
    });

    // Button for exporting expenses
    document.getElementById("exportButton").addEventListener("click", () => {
        exportExpenses();
        alert("Expenses exported successfully.");
    });
});


let addExpenseButton = document.querySelector("#addExpense")
let expenseModal = document.querySelector("#expenseModal")
let expenseForm = document.querySelector("#expenseModal form")

let confirmAddExpense = document.querySelector("#expenseModal .confirm");

let expensesListContainer = document.querySelector("#expensesList")

addExpenseButton.addEventListener("click", () => {
    expenseModal.show()
})

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

confirmAddExpense.addEventListener("click", () => {
    
    // Parse the form data into an expense object
    let formData = new FormData(expenseForm);
    let expense = {
        "name" : formData.get("expenseName"),
        "type" : formData.get("expenseType"),
        "amount" : parseFloat(formData.get("expenseAmount")),
        "date" : formData.get("expenseDate"),
    }

    // Fetch existing expenses from localStorage, add the new expense, and save back
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    console.log(expense)
    expenseForm.reset()
    populateExpenseList()
})



function populateExpenseList() {
    for (let expense of expenses) {
        let expensesListItem = document.createElement('li');
        expensesListItem.textContent = expense.name
        expensesListContainer.appendChild(expensesListItem)
    }
}

populateExpenseList()