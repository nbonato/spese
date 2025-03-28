import { groupExpensesMonthly, sumPropertyArray } from './overviews.js';



document.addEventListener("DOMContentLoaded", () => {
    // By default, only showing current month
    let grouped = groupExpensesMonthly(JSON.parse(localStorage.getItem("expenses")), 0) 
    const categorised = Object.groupBy(grouped, ({ type }) => type.trim());
    // Iterate over each category and sum the property
    // First, create an array of [category, total] pairs and sort it by total
    const sortedCategories = Object.entries(categorised).map(([category, expensesArray]) => {
        const total = sumPropertyArray(expensesArray);
        return [category, total];
    }).sort((a, b) => b[1] - a[1]);  // Sort in descending order by total (b[1] - a[1])
    console.log(sortedCategories)

    // Extract labels and values
    const categories = sortedCategories.map(item => item[0]); // Category names
    const values = sortedCategories.map(item => item[1]); // Corresponding amounts

    // Create pie chart
    const ctx = document.getElementById("myPieChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [{
                data: values,
                borderwidth: 1,
                backgroundColor: ["red", "blue", "green", "orange", "purple", "yellow"]
            }]
        },
        options: {
            cutout: "50%", // <-- Adjusts the hole size (50% = default, 70% = more hole)
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
});
