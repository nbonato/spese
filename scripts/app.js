import { initializeExpenses, clearExpenses, exportExpenses } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeExpenses();

    // Button for clearing expenses
    document.getElementById("clearButton").addEventListener("click", () => {
        if (window.confirm("Are you sure you want to delete all expenses? This is definitive, there is no backup")) {
            clearExpenses();
            alert("All expenses cleared.");
            expenses = []
            populateExpenseList()
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


let addExpenseButton = document.querySelector("#addExpense")
let expenseModal = document.querySelector("#expenseModal")
let expenseForm = document.querySelector("#expenseModal form")
let expenseTypesDatalist = document.querySelector("#expenseTypes")

let confirmAddExpense = document.querySelector("#expenseModal .confirm");

let expensesListContainer = document.querySelector("#expensesList")

let jsonImport = document.getElementById("importExpenses")
jsonImport.value = null

let importModal = document.querySelector("#importModal")



addExpenseButton.addEventListener("click", () => {
    // Set default date for new expense to today
    document.getElementById('expenseDate').valueAsDate = new Date();
    expenseModal.show()
})

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseTypesOptions = JSON.parse(localStorage.getItem("expenseTypesOptions")) || [];


confirmAddExpense.addEventListener("click", () => {


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
                populateExpenseList()
                jsonImport.value = null
            })
            .catch((error) => {
                console.error(error); // Handle error if something goes wrong
            });
        
    }
});


function populateExpenseList() {
    document.querySelector("#expensesList tbody").innerHTML = ""
    for (let expense of expenses) {
        
        let expenseListRow = document.createElement('tr')

        // Create a td for each property and set its textContent
        const nameTd = document.createElement("td");
        nameTd.textContent = expense.name;

        const typeTd = document.createElement("td");
        typeTd.textContent = expense.type;

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

        // Append each Td to the expensesListItem container
        expenseListRow.appendChild(nameTd);
        expenseListRow.appendChild(typeTd);
        expenseListRow.appendChild(amountTd);
        expenseListRow.appendChild(dateTd);
        document.querySelector("#expensesList tbody").appendChild(expenseListRow)
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