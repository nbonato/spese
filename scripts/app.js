import { convertFormToExpense, updateExpense } from './manageExpense.js';
import { initializeExpenses, clearExpenses, exportExpenses, importExpenses, refreshExpenseTypes } from './storage.js';

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


let addExpenseButton = document.querySelectorAll(".addExpense")
let expenseModal = document.querySelector("#expenseModal")
let expenseForm = document.querySelector("#expenseModal form")
let expenseTypesDatalist = document.querySelector("#expenseTypes")

let confirmAddExpense = document.querySelector("#expenseModal .confirm");

let expensesListContainer = document.querySelector("#expensesList")

let jsonImport = document.getElementById("importExpenses")
jsonImport.value = null

let importModal = document.querySelector("#importModal")



addExpenseButton.forEach(button => {
    button.addEventListener("click", () => {
        // Set default date for new expense to today
        document.getElementById('expenseDate').valueAsDate = new Date();
        expenseModal.show();
    });
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseTypesOptions = JSON.parse(localStorage.getItem("expenseTypesOptions")) || [];


confirmAddExpense.addEventListener("click", () => {
    convertFormToExpense(expenseForm, expenses, expenseTypesOptions)    
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
                initialiseAppContent()
                jsonImport.value = null
            })
            .catch((error) => {
                console.error(error); // Handle error if something goes wrong
            });
        
    }
});


function populateExpenseList() {
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    document.querySelector("#expensesList tbody").innerHTML = ""
    for (let [index, expense] of expenses.entries()) {
        
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

        // Append each Td to the expensesListItem container
        expenseListRow.appendChild(nameTd);
        expenseListRow.appendChild(typeTd);
        expenseListRow.appendChild(amountTd);
        expenseListRow.appendChild(dateTd);

        
        expenseListRow.addEventListener("click", (event) => updateExpense(event, expense, index, expenses, expenseTypesOptions))
        document.querySelector("#expensesList tbody").appendChild(expenseListRow)
    }
}

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
    populateExpenseList()
    populateExpenseTypesList()
}

initialiseAppContent()