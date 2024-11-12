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
let expenseTypesDatalist = document.querySelector("#expenseTypes")

let confirmAddExpense = document.querySelector("#expenseModal .confirm");

let expensesListContainer = document.querySelector("#expensesList")

addExpenseButton.addEventListener("click", () => {
    expenseModal.show()
})

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseTypesOptions = JSON.parse(localStorage.getItem("expenseTypesOptions")) || [];


confirmAddExpense.addEventListener("click", () => {
    
    // Set default date for new expense to today
    document.getElementById('expenseDate').valueAsDate = new Date();


    // Parse the form data into an expense object
    let formData = new FormData(expenseForm);
    let expense = {
        "name" : formData.get("expenseName"),
        "type" : formData.get("expenseType").toLowerCase(),
        "amount" : parseFloat(formData.get("expenseAmount")),
        "date" : formData.get("expenseDate"),
    }

    if (!expenseTypesOptions.includes(expense.type)) {
        // Fetch existing expensetypes from localStorage, add the new expense, and save back
        expenseTypesOptions = JSON.parse(localStorage.getItem("expenseTypesOptions")) || [];
        expenseTypesOptions.push(expense.type);
        localStorage.setItem("expenseTypesOptions", JSON.stringify(expenseTypesOptions));
        let option = document.createElement('option');
        option.value = expense.type;
        expenseTypesDatalist.appendChild(option)
    }

    // Fetch existing expenses from localStorage, add the new expense, and save back
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.reset()
    populateExpenseList()
})



function populateExpenseList() {
    expensesListContainer.innerHTML = ""
    for (let expense of expenses) {
        let expensesListItem = document.createElement('li');
        expensesListItem.textContent = expense.name
        expensesListContainer.appendChild(expensesListItem)
    }
}

function populateExpenseTypesList() {
    for (let expenseType of expenseTypesOptions) {
        let option = document.createElement('option');
        option.value = expenseType;
        expenseTypesDatalist.appendChild(option)
    }
}

populateExpenseList()
populateExpenseTypesList()