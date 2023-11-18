// Screen Info
const screen = document.querySelector(".screen");
const screenInfo = document.querySelector(".screenInfo");

// Buttons
const buttons = document.querySelectorAll("button");

// Add click event to all buttons
styleButtons(buttons);

// Holds current equation
let current_string = "";
// Holds last operation pressed
let lastOperation = "";
// Set to 0 if no error found
let error = 0;

const body = document.querySelector("body");
body.addEventListener("keydown", function(event)
{
    event.preventDefault();
    if (event.key in [0,1,2,3,4,5,6,7,8,9])
    {
        updateScreen(event.key);
    }
    else if (isOperation(event.key))
    {
        updateScreen(event.key);
    }
    else if (event.key === '*')
    {
        updateScreen('×');
    }
    else if (event.key === '/')
    {
        updateScreen('÷');
    }
    else if (event.key === '.')
    {
        updateScreen('.');
    }
    else if (event.key === '=' || event.key === "Enter")
    {
        updateScreen('=');
    }
    else if (event.key === "Backspace")
    {
        updateScreen('C');
    }
});

// -----------------------------
//          FUNCTIONS
// -----------------------------

// Style buttons and adds mouseover, mouseout, click events
function styleButtons(listOfBtns)
{
    const operators = ["AC", "C", "%", "÷", "×", "-", "+", "="];

    // Loops through every button
    for (let i = 0; i < listOfBtns.length; i++)
    {
        let current = listOfBtns[i];
        let b = current.innerHTML;

        // Add click event
        current.addEventListener('click', e => {updateScreen(e.currentTarget.innerText)});

        // Hover effects (colors)
        if (operators.includes(b))
        {
            current.style.backgroundColor = "red";
            current.style.color = "white";
            listOfBtns[i].addEventListener('mouseover', () => {listOfBtns[i].style.backgroundColor = '#e60004';});
            listOfBtns[i].addEventListener('mouseout', () => {listOfBtns[i].style.backgroundColor = '#ff0004';});
        }
        else
        {
            current.style.backgroundColor = "white";
            current.style.color = "black";
            listOfBtns[i].addEventListener('mouseover', () => {listOfBtns[i].style.backgroundColor = '#e6e6e6';});
            listOfBtns[i].addEventListener('mouseout', () => {listOfBtns[i].style.backgroundColor = '#ffffff';});
        }
        
        // "0" button sized differently, every other buttons is the same size
        if (current.innerHTML == "0")
        {
            current.style.flexGrow = "0.7";
        }
        else
        {
            current.style.width = "70px";
            current.style.height = "70px";
        }

        current.style.fontSize = "30px";
        current.style.borderRadius = "30px";
        current.style.border = "2px solid black";
    }
}

// Called when button is used
// Takes in the input
function updateScreen(calculatorInput)
{
    // On startup prevents a string of zeros
    if ((calculatorInput === "0" && current_string.length == 0))
    {
        return;
    }
    
    // On startup if operation is pressed before any numbers
    if (current_string.length == 0 && isOperation(calculatorInput))
    {
        current_string = 0;
        current_string += calculatorInput;
        screenInfo.innerHTML = current_string;
        return;
    }

    // Overrides operation 
    if (isOperation(calculatorInput) && updateOperation(calculatorInput))
    {
        return;
    }

    // Valid input handle accordingly 
    handleCalculatorInput(calculatorInput);
}

// True [%, ÷, ×, -, +, .] 
// False otherwise
function isOperation(value)
{
    const ops = ['%', '÷', '×', '-', '+'];
    if (ops.includes(value))
    {
        return true;
    }
    return false;
}

// Takes in an operation and overrides the previous one
// Ex: 9 x 9 x, (presses +) => 9 x 9 +
// Returns: True if changed | False otherwise
function updateOperation(calculatorInput)
{
    let last_index = current_string.length - 1;
    let last_char = current_string[last_index];

    if (current_string.length > 0 && isOperation(calculatorInput) && isOperation(last_char))
    {
        let temp = current_string.split("");
        temp[last_index] = calculatorInput;
        
        current_string = temp.join("");
        screenInfo.innerHTML = current_string;
        return true;
    }
    return false;
}


// Takes the button input and performs the proper action
function handleCalculatorInput(value)
{
    // If a number or operation => add it to string, update the screen
    if ((value in [0,1,2,3,4,5,6,7,8,9]) || isOperation(value))
    {
        current_string += value;
        screenInfo.innerHTML = current_string;
    }
    // If equal => reset everything
    else if (value == "AC")
    {
        error = 0;
        current_string = "";
        screenInfo.innerHTML = 0;
        buttons_on();
    }
    // If C and string isn't empty => delete the last most from string 
    else if ((value == "C") && (current_string.length > 0))
    {
        deletePrev(current_string);
    }
    // If . and placement is valid => add it to string, update the screen
    else if (value == '.' && isValidDecimal(value))
    {
        current_string += value;
        screenInfo.innerHTML = current_string;
    }
    // If = and string isn't empty and a valid equation => start calculation 
    else if (value == "=" && current_string.length > 0 && (!(isOperation(current_string[current_string.length - 1]))))
    {
        // Handle multiplication and division first
        handle_mult_div();
    }   
}

// Takes in a decimal point
// Check if it can be placed (Ex: 9, (press .) => 9. is ok. 9.9, (press .) => 9.9. is not)
// True if can place | False otherwise
function isValidDecimal(value)
{
    // String is empty => decimal is allowed
    if (current_string.length == 0)
    {
        current_string = "0";
        return true;
    }

    // Operation is the last most char in string => decimal is NOT allowed
    if (current_string.length > 0 && isOperation(current_string[current_string.length - 1]))
    {
        return false;
    }

    // Checks if current number contains a decimal
    // If a decmail is found before an operation return false
    let i = current_string.length - 1;
    while (i >= 0 && !(isOperation(current_string[i])))
    {
        if (current_string[i] === '.')
        {
            return false;
        }
        i -= 1
    }
    
    return true;
}

// Takes in the current string
// Delete the last char in the current string
function deletePrev(string)
{
    if (string.length == 1)
    {
        current_string = "";
        screenInfo.innerHTML = "0";
    }
    else
    {
        new_string = string.slice(0, -1);
        current_string = new_string;
        screenInfo.innerHTML = current_string;
    }
}

// Evalutes the current string
// Calculates multiplication and division from left to right
function handle_mult_div()
{
    // Continues looping until all multiplication and division are completed
    while (current_string.includes('×') || current_string.includes('÷'))
    {
        let multIndex = current_string.search('×');
        let divIndex = current_string.search('÷');

        if (multIndex >= 0 && (multIndex < divIndex || divIndex < 0)) 
        {
            evaluate(multIndex, mult);
        } 
        else if (divIndex >= 0 && (divIndex < multIndex || multIndex < 0)) 
        {
            evaluate(divIndex, div);

            // Divide by 0 error
            if (error == 1)
            {
                errorAlert();
                return;
            }
        } 
    }
    // Once all multiplication and division are completed finish the rest of the equation
    handle_add_sub_mod();
}

// Index = index of mult/div symbol
// Type = mult/div functions
// A single multiplication/division will be done. Ex: 2+3*5 (3*5) will be done
function evaluate(index, type)
{
    let len = current_string.length;
    let leftIndex = index - 1;

    while (leftIndex >= 0 && (!(isOperation(current_string[leftIndex]))))
    {
        leftIndex -= 1;
    }
    // Left side of the equation
    let firstHalf = current_string.slice(0, leftIndex + 1);
    
    let rightIndex = index + 1;
    while (rightIndex < len && (!(isOperation(current_string[rightIndex]))))
    {
        rightIndex += 1;
    }
    // Right side of the equation
    let secondHalf = current_string.slice(rightIndex, len);
    
    let num1 = Number(current_string.slice(leftIndex + 1, index));
    let num2 = Number(current_string.slice(index + 1, rightIndex));
   
    // Calculate result and change to string 
    let newValue = (type(num1, num2)).toString();

    // If divide by 0 error
    if (error == 1)
    {
        return;
    }

    // Rounds result if needed
    if (newValue.includes('.'))
    {
        newValue = round_the_result(newValue);
    }

    let finalResult = firstHalf + newValue + secondHalf;
    // Update current string
    current_string = finalResult;
}

// Evalutes the current string
// Prepares string to be calculated left to right
// Puts numbers and operations into separate arrays
function handle_add_sub_mod()
{
    // Separate numbers and operations
    let values = [];
    let operations = [];

    let current_value = "";
    for (let i = 0; i < current_string.length; i++)
    {
        if (current_string[i] in [0,1,2,3,4,5,6,7,8,9])
        {
            current_value += current_string[i];
        }
        else if (current_string[i] === '.')
        {
            current_value += current_string[i];
        }
        else
        {
            values.push(current_value);
            operations.push(current_string[i]);
            current_value = "";
        }
    }
    values.push(current_value);

    // No operations to handle (No addition, subtraction, or modular)
    if (operations.length == 0)
    {
        screenInfo.innerHTML = current_string;
        current_string += lastOperation;
    }
    else
    {
        getResult(values, operations);
    }
}

// Takes in 2 arrays
// Values = numbers in equation
// Operations = operations in equation
// Calculates in a stack format 
function getResult(values, operations)
{
    let result = 0;
    let num1, num2, op;
    values = values.reverse();
    operations = operations.reverse();

    while (values.length > 0 && operations.length > 0)
    {
        num1 = Number(values.pop());
        num2 = Number(values.pop());
        op = operations.pop();

        console.log(num1, num2, op);
        
        if (op === "+")
        {
            result = add(num1, num2);
        }
        else if (op === "-")
        {
            result = sub(num1, num2);
        }
        else if (op === "%")
        {
            result = mod(num1, num2);

            // Mod by 0 error
            if (error == 1)
            {
                errorAlert();
                return;
            }
        }
        values.push(result);
    }

    result = values.pop().toString();

    // Round result if needed
    if (result.includes('.'))
    {
        result = round_the_result(result);
    }
    
    // Update the current string and screen to the result
    current_string = result;
    screenInfo.innerHTML = current_string;
    current_string += lastOperation;
}


// Takes in a decimal point value
// Keeps no more than 3 digits after the decimal 
function round_the_result(value)
{
    console.log("Before round:", value);
    let num_decimal_places = 3;
    let roundedNum = Number(value).toFixed(num_decimal_places).toString();

    let lastIndex = roundedNum.length - 1;
    while (roundedNum[lastIndex] == '0')
    {
        num_decimal_places -= 1;
        roundedNum = Number(roundedNum).toFixed(num_decimal_places).toString();
        lastIndex -= 1;
        console.log("ROUNDING:",roundedNum);
    }

    console.log("After round:", roundedNum);
    return roundedNum;
}

// Displays error message on screen 
function errorAlert()
{
    // Display error message to screen
    screenInfo.innerHTML = "Error";

    // Disable all keys

    // Disable all buttons (except AC) 
    buttons_off();
}

// Shuts off all buttons (except AC)
function buttons_off()
{  
    for (let i = 0; i < buttons.length; i++)
    {
        if (buttons[i].innerHTML != "AC")
        {
            buttons[i].disabled = true;
        }
    }

}
// Turns all all buttons
function buttons_on()
{
    for (let i = 0; i < buttons.length; i++)
    {   
        buttons[i].disabled = false;
    }
}

function add(a, b)
{
    lastOperation = "+";
    return a + b;
}

function sub(a, b)
{
    lastOperation = "-";
    return a - b;
}

function mult(a, b)
{
    lastOperation = "×";
    return a * b;
}

function div(a, b)
{
    if (b == 0)
    {
        error = 1;
    }
    lastOperation = "÷";
    return a / b;
}

function mod(a, b)
{
    if (b == 0)
    {
        error = 1;
    }
    lastOperation = "%";
    return a % b;
}

