// Initialize expenses if not present
export function initializeExpenses() {
    if (!localStorage.getItem("expenses")) {
        localStorage.setItem("expenses", JSON.stringify([]));
    }
}

// Clear all data in localStorage
export function clearExpenses() {
    localStorage.removeItem("expenses");
}

// Export expenses data as a downloadable JSON file
export function exportExpenses() {
    const expenses = localStorage.getItem("expenses");
    const blob = new Blob([expenses], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "expenses.json";
    downloadLink.click();

    URL.revokeObjectURL(url);
}
