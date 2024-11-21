import { populateExpenseList } from './expenseList.js';
import { addExpense, convertFormToExpense, updateExpense } from './manageExpense.js';
import { initializeExpenses, clearExpenses, exportExpenses, importExpenses, refreshExpenseTypes } from './storage.js';

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
let expenseTypesDatalist = document.querySelector("#expenseTypes")
let expensesListTable = document.querySelector("#expensesList tbody")

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

/* confirmAddExpense.addEventListener("click", () => {
    expenses.push(convertFormToExpense(expenseForm))
    addExpenseToTable(convertFormToExpense(expenseForm))
}) */


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



function populateExpenseTypesList() {
    expenseTypesDatalist.innerHTML = ""
    localStorage.setItem("expenseTypesOptions", JSON.stringify(expenseTypesOptions));

    for (let expenseType of expenseTypesOptions) {
        let option = document.createElement('li');
        option.textContent = expenseType;
        option.addEventListener("click", () => {expenseTypeInput.value = expenseType})
        expenseTypesDatalist.appendChild(option)
    }
}


let expenseTypeInput = document.querySelector("#expenseType")

expenseTypeInput.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    displayExpenseTypesOptions();
});

function displayExpenseTypesOptions() {
    expenseTypesDatalist.style.display = "flex";

    // Add a click listener to the document to handle clicks outside
    document.addEventListener("click", hideExpenseTypesOptions);
}

function hideExpenseTypesOptions(event) {
    // Check if the click is outside the datalist and input field
    if (
        event.target !== expenseTypesDatalist &&
        !expenseTypesDatalist.contains(event.target) &&
        event.target !== expenseTypeInput
    ) {
        expenseTypesDatalist.style.display = "none";
        document.removeEventListener("click", hideExpenseTypesOptions); // Clean up the event listener
    }
}




function updateExpenseTypes() {
    expenseTypesOptions = refreshExpenseTypes(expenses)
    localStorage.setItem("expenseTypesOptions", JSON.stringify(expenseTypesOptions));
    populateExpenseTypesList()
}


function initialiseAppContent() {
    updateExpenseTypes()
    populateExpenseList(expenses)
    populateExpenseTypesList()
}

initialiseAppContent()