let expenseTypesDatalist = document.querySelector("#expenseTypes")
let expenseTypeInput = document.querySelector("#expenseType")


export function initialiseExpenseTypeInput(expenseTypesOptions) {
    expenseTypeInput.addEventListener("focus", (event) => {
        displayExpenseTypesOptions();
    });
    expenseTypeInput.addEventListener("input", (event) => selectExpenseType(event, expenseTypesOptions))
}




/**
 * Add all available expense types as options to the list in the 
 * add expense form
 * 
 * @param {Array} expenseTypesOptions 
 * 
 */
export function populateExpenseTypesList(expenseTypesOptions) {
    expenseTypesDatalist.innerHTML = ""
    for (let expenseType of expenseTypesOptions) {
        let option = document.createElement('li');
        option.textContent = expenseType;
        option.addEventListener("click", () => {expenseTypeInput.value = expenseType})
        expenseTypesDatalist.appendChild(option)
    }
}


export function hideExpenseTypesOptions(event) {
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


export function updateExpenseTypes(expenses, expenseTypesOptions) {
    expenseTypesOptions = [...new Set(expenses.map(expense => expense.type.trim()))]
    localStorage.setItem("expenseTypesOptions", JSON.stringify(expenseTypesOptions));
    populateExpenseTypesList(expenseTypesOptions)
}


export function displayExpenseTypesOptions() {
    expenseTypesDatalist.style.display = "flex";

    // Add a click listener to the document to handle clicks outside
    document.addEventListener("click", (event) => hideExpenseTypesOptions(event));
}

/**
 * Implements filter-as-you-type for the epxense types field 
 * @param {Event} event                 The input event on the expense types field
 * @param {Array} expenseTypesOptions   All available expense types
 */
export function selectExpenseType(event, expenseTypesOptions) {
    let currentInput = event.target.value
    let filteredTypes = expenseTypesOptions.filter((type) => 
        type.toLowerCase().includes(currentInput.toLowerCase())
    )
    populateExpenseTypesList(filteredTypes)    
}



