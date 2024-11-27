let expenseTypesDatalist = document.querySelector("#expenseTypes")


/**
 * Add all available expense types as options to the list in the 
 * add expense form
 * 
 * @param {Array} expenseTypesOptions 
 * 
 */
export function populateExpenseTypesList(expenseTypesOptions, expenseTypeInput) {
    expenseTypesDatalist.innerHTML = ""
    for (let expenseType of expenseTypesOptions) {
        let option = document.createElement('li');
        option.textContent = expenseType;
        option.addEventListener("click", () => {expenseTypeInput.value = expenseType})
        expenseTypesDatalist.appendChild(option)
    }
}


export function hideExpenseTypesOptions(event, expenseTypeInput) {
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


export function updateExpenseTypes(expenses, expenseTypesOptions, expenseTypeInput) {
    expenseTypesOptions = [...new Set(expenses.map(expense => expense.type.trim()))]
    localStorage.setItem("expenseTypesOptions", JSON.stringify(expenseTypesOptions));
    populateExpenseTypesList(expenseTypesOptions, expenseTypeInput)
}


export function displayExpenseTypesOptions(expenseTypeInput) {
    expenseTypesDatalist.style.display = "flex";

    // Add a click listener to the document to handle clicks outside
    document.addEventListener("click", (event) => hideExpenseTypesOptions(event, expenseTypeInput));
}


