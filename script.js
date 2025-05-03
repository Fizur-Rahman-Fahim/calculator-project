let input = document.getElementById("inputbox");
let buttons = document.querySelectorAll(".calculator button"); // Only select calculator buttons
let historyList = document.getElementById("historyList");
let clearHistoryBtn = document.getElementById("clearHistory");

let string = "";
let calculations = [];

// Add clear history functionality
clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
    calculations = [];
    saveHistory();
});

// Load history from localStorage when page loads
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        calculations = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculations));
}

// Update history display
function updateHistoryDisplay() {
    historyList.innerHTML = "";
    calculations.forEach(calc => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-expression">${calc.expression}</div>
            <div class="history-result">${calc.result}</div>
        `;
        historyList.prepend(historyItem);
    });
}

let array = Array.from(buttons);
array.forEach(button => {
    button.addEventListener("click", (e) => {
        if (e.target.innerHTML == "=") {
            try {
                let expression = string.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
                let result = eval(expression);

                // Add to history
                calculations.push({
                    expression: string,
                    result: result
                });
                if (calculations.length > 10) {
                    calculations.shift(); // Keep only last 10 calculations
                }
                saveHistory();
                updateHistoryDisplay();

                string = result;
                input.value = string;
            } catch {
                input.value = "Error!";
                setTimeout(() => {
                    input.value = string;
                }, 2000);
            }
        }
        else if (e.target.innerHTML == "AC") {
            string = "";
            input.value = string;
        }
        else if (e.target.innerHTML == "DEL") {
            string = string.slice(0, -1);
            input.value = string;
        }
        else {
            string += e.target.innerHTML;
            input.value = string;
        }

    });
});

// Load history when page loads
loadHistory();
