// Mapping object
const fieldMapping = {
    name: "expenseName",
    type: "expenseType",
    amount: "expenseAmount",
    date: "expenseDate"
};

export function updateExpense(event, expense, index, expenses, expenseTypesOptions) {
    const expenseForm = expenseModal.querySelector("form")
    for (const key in expense) {
        if (expense.hasOwnProperty(key) && fieldMapping[key]) {
            const input = expenseForm.querySelector(`[name="${fieldMapping[key]}"]`);
            if (input) {
                input.value = expense[key]; // Set the value of the input field
            }
        }
    }
    expenseModal.show()

    expenseModal.querySelector(".confirm")
        .addEventListener("click", 
            () => {
                event.preventDefault()
                convertFormToExpense(expenseForm, expenses, expenseTypesOptions, index)
            })
}


export function convertFormToExpense(expenseForm, expenses, expenseTypesOptions, index = false) {
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
    }

    // Fetch existing expenses from localStorage
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (index) {
        // With index, I replace a specific expense
        expenses[index] = expense
    } else {
        // Add the new expense
        expenses.push(expense);
    }
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.reset()
}
