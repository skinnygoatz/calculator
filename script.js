// Screen Info
const screen = document.querySelector(".screen");
const screenInfo = document.querySelector(".screenInfo");

// Buttons
const buttons = document.querySelectorAll("button");

// Add click event to all buttons
styleButtons(buttons);

// Current value
let current_string = "";
let lastOperation = "";

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

    for (let i = 0; i < listOfBtns.length; i++)
    {
        let current = listOfBtns[i];
        let b = current.innerHTML;

        // Add click event
        current.addEventListener('click', e => {updateScreen(e.currentTarget.innerText)});

        // Hover effects
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
        
        // "0" button sized differently, every other buttons the same size
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

function updateScreen(calculatorInput)
{
    // Zero case: prevent a string of zeros
    // If input is 0 and string is empty return
    if ((calculatorInput === "0" && current_string.length == 0))
    {
        console.log("Can't place a zero in front of another zero");
        return;
    }
    
    // If operation is pressed while string is empty
    if (current_string.length == 0 && isOperation(calculatorInput))
    {
        current_string = 0;
        current_string += calculatorInput;
        screenInfo.innerHTML = current_string;
        return;
    }

    // If value is an operation update it accordingly
    // Update operation will check if the last value in string is also an operation
    // If yes swap if not continue on
    if (isOperation(calculatorInput) && updateOperation(calculatorInput))
    {
        return;
    }

    // -----------------
    // Succuessful input
    // -----------------

    // Valid input update correctly
    // Number is operation has been pressed
    handleCalculatorInput(calculatorInput);
}

// Check is either %, ÷, ×, -, +, . were pressed
// True if pressed
// False if not
function isOperation(value)
{
    if (current_string.length > 0 && current_string[current_string.length - 1] == '.')
    {
        console.log("No more decimal points allow");
        return false;
    }
    const ops = ['%', '÷', '×', '-', '+'];
    for (let i = 0; i < ops.length; i++)
    {
        if (value === ops[i])
        {
            return true;
        }
    }
    return false;
}

// Updates the operation if another one is pressed
// Ex: 9 x 9 x, (presses +) => 9 x 9 +
// Returns: True if changed
// False if not
function updateOperation(value)
{
    let last_index = current_string.length - 1;
    let last_char = current_string[last_index];
    if (current_string.length > 0 && isOperation(value) && isOperation(last_char))
    {
        let temp = current_string.split("");
        temp[last_index] = value;
        
        current_string = temp.join("");
        screenInfo.innerHTML = current_string;
        return true;
    }
    return false;
}

// Takes in a button value and performs the proper action
function handleCalculatorInput(value)
{
    if ((value in [0,1,2,3,4,5,6,7,8,9]) || isOperation(value))
    {
        current_string += value;
        screenInfo.innerHTML = current_string;
    }
    else if (value == "AC")
    {
        current_string = "";
        screenInfo.innerHTML = 0;
    }
    else if ((value == "C") && (current_string.length > 0))
    {
        deletePrev(current_string);
    }
    else if (value == '.' && isValidDecimal(value))
    {
        current_string += value;
        screenInfo.innerHTML = current_string;
    }
    else if (value == "=" && current_string.length > 0 && (!(isOperation(current_string[current_string.length - 1]))))
    {
        // must not be empty characters and be a valid input no operation spam (prevents automatic 0 if no value is placed)
        handle_mult_div_mod();
    }   
}


// User entered a decimal check if it be placed (Ex: 9. is ok 9.9. is not)
function isValidDecimal(value)
{
    // String is empty and first click is decimal
    if (current_string.length == 0)
    {
        current_string = "0";
        return true;
    }

    // Operation is the last value in string so cant place decimal
    if (current_string.length > 0 && isOperation(current_string[current_string.length - 1]))
    {
        console.log("Operation is in the way");
        return false;
    }

    // Checks if current number has a decimal or not
    let i = current_string.length - 1;
    while (i >= 0 && !(isOperation(current_string[i])))
    {
        console.log("Valve:", current_string[i]);
        if (current_string[i] === '.')
        {
            return false;
        }
        i -= 1
    }
    
    return true;
}
// Delete the last value in string
// Returns an empty string if there were only 1 character
// Else returns the string with the last value removed
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

function handle_mult_div_mod()
{
    // Runs only is there exist a multiple or divide exist
    while (current_string.includes('×') || current_string.includes('÷'))
    {
        let multIndex = current_string.search('×');
        let divIndex = current_string.search('÷');
        let modIndex = current_string.search('%');

        if (multIndex >= 0 && (multIndex < divIndex || divIndex < 0) && (multIndex < modIndex || modIndex < 0)) 
        {
            evaluate(multIndex, mult);
        } 
        else if (divIndex >= 0 && (divIndex < multIndex || multIndex < 0) && (divIndex < modIndex || modIndex < 0)) 
        {
            evaluate(divIndex, div);
        } 
        else if (modIndex >= 0 && (modIndex < multIndex || multIndex < 0) && (modIndex < divIndex || divIndex < 0)) 
        {
            evaluate(modIndex, mod);
        }
    }
    handle_add_sub();
}
// Do a single *, /, % operation. Ex: 2+3*5 (3*5)will be done
function evaluate(index, type)
{
    let len = current_string.length;
    let leftIndex = index - 1;

    while (leftIndex >= 0 && (!(isOperation(current_string[leftIndex]))))
    {
        leftIndex -= 1;
    }
    // First half of string
    let firstHalf = current_string.slice(0, leftIndex + 1);
    
    let rightIndex = index + 1;
    while (rightIndex < len && (!(isOperation(current_string[rightIndex]))))
    {
        rightIndex += 1;
    }
    // Second half of string
    let secondHalf = current_string.slice(rightIndex, len);
    
    console.log("Current string:", current_string);
    console.log("Fist half:", firstHalf);
    console.log("Second half:", secondHalf);

    let finalResult = "";
    let num1 = Number(current_string.slice(leftIndex + 1, index));
    let num2 = Number(current_string.slice(index + 1, rightIndex));
    console.log("Number 1:", num1);
    console.log("Number 2:", num2);
    let newValue = (type(num1, num2)).toString();

    // add function
    if (newValue.includes('.'))
    {
        newValue = round_the_result(newValue);
    }

    finalResult = firstHalf + newValue + secondHalf;
    console.log("Final:", finalResult);
    current_string = finalResult;
}

// Sets up string to be caluated
// Splits up the numbers and operations into an array
function handle_add_sub()
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

    console.log(values);
    console.log(operations);

    // Only * and / operations everything is complete
    if (values.length == 1 && operations.length == 0)
    {
        console.log("Updating screen to:", current_string);
        screenInfo.innerHTML = current_string;
        current_string += lastOperation;
    }
    else
    {
        getResult(values, operations);
    }
}

// Get the result given the numbers and operations array
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
        values.push(result);
    }

    result = values.pop().toString();

    if (result.includes('.'))
    {
        result = round_the_result(result);
    }
    
    // Update the current string and screen to the result
    current_string = result;
    screenInfo.innerHTML = current_string;
    current_string += lastOperation;
}

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
    lastOperation = "÷";
    return a / b;
}

function mod(a, b)
{
    lastOperation = "%";
    return a % b;
}

