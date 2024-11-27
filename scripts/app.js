import { populateExpenseList } from './expenseList.js';
import { displayExpenseTypesOptions, updateExpenseTypes } from './expenseTypesList.js';
import { addExpense } from './manageExpense.js';
import { clearExpenses, exportExpenses, importExpenses, initializeExpenses } from './storage.js';




document.addEventListener("DOMContentLoaded", () => {
    initializeExpenses();

    // Button for clearing expenses
    document.getElementById("clearButton").addEventListener("click", () => {
        if (window.confirm("Are you sure you want to delete all expenses? This is definitive, there is no backup")) {
            clearExpenses();
            alert("All expenses cleared.");
            expenses = []
            populateExpenseList(expenses)
          }

    });

    // Button for exporting expenses
    document.getElementById("exportButton").addEventListener("click", () => {
        exportExpenses();
        alert("Expenses exported successfully.");
    });

    // Button for importing expenses
    document.getElementById("importButton").addEventListener("click", () => {
        importModal.showModal()
    });
});


let addExpenseButton = document.querySelectorAll(".addExpense")
let expenseModal = document.querySelector("#expenseModal")
let expenseForm = document.querySelector("#expenseModal form")

let confirmAddExpense = document.querySelector("#expenseModal .confirm");

let jsonImport = document.getElementById("importExpenses")
jsonImport.value = null

let importModal = document.querySelector("#importModal")



addExpenseButton.forEach(button => {
    button.addEventListener("click", () => {
        // Set default date for new expense to today
        document.getElementById('expenseDate').valueAsDate = new Date();
        expenseModal.showModal();
    });
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseTypesOptions = JSON.parse(localStorage.getItem("expenseTypesOptions")) || [];



confirmAddExpense.addEventListener("click", () => {
    addExpense(expenseForm, expenses)
})



jsonImport.addEventListener("change", function() {
    // Enable button when file is uploaded
    importModal.querySelector(".confirm").disabled = false;
});

// Button for importing expenses
importModal.querySelector(".confirm").addEventListener("click", () => {
    if (window.confirm("Are you sure you want to import? This will delete all current expenses. This is definitive, there is no backup")) {
        importExpenses(jsonImport)
            .then((jsonData) => {
                expenses = jsonData; // Assign parsed data to expenses
                localStorage.setItem("expenses", JSON.stringify(expenses));
                initialiseAppContent()
                jsonImport.value = null
            })
            .catch((error) => {
                console.error(error); // Handle error if something goes wrong
            });
        
    }
});


let expenseTypeInput = document.querySelector("#expenseType")

expenseTypeInput.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    displayExpenseTypesOptions(expenseTypeInput);
});

function initialiseAppContent() {
    updateExpenseTypes(expenses, expenseTypesOptions)
    populateExpenseList(expenses)
}

initialiseAppContent()

