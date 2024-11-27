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


export function importExpenses(inputNode) {
    return new Promise((resolve, reject) => {
        const file = inputNode.files[0];

        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result); // Convert JSON text to object
                    resolve(jsonData); // Resolve the promise with jsonData
                } catch (error) {
                    reject("Error parsing JSON:", error); // Reject if there's an error
                }
            };
            
            reader.readAsText(file); // Read the file as text
        } else {
            reject("Please upload a valid JSON file."); // Reject if file type is not JSON
        }
    });
}
