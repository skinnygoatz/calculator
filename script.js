// Screen Info
const screen = document.querySelector(".screen");
const screenInfo = document.querySelector(".screenInfo");

// Buttons
const buttons = document.querySelectorAll("button");

// Add click event to all buttons
addEventToButtons(buttons);

// Current value
let current_string = "";

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

// Add click events too every button
function addEventToButtons(listOfBtns)
{
    for (let i = 0; i < listOfBtns.length; i++)
    {
        listOfBtns[i].addEventListener('click', e => {updateScreen(listOfBtns[i].innerText)});
    }

}

function updateScreen(value)
{
    // Zero case: prevent a string of zeros
    // If input is 0 and string is empty return
    if ((value === "0" && current_string.length == 0))
    {
        return;
    }
    
    // If operation is pressed while string is empty
    if (current_string.length == 0 && isOperation(value))
    {
        current_string = 0;
        current_string += value;
        screenInfo.innerHTML = current_string;
        return;
    }

    // If value is an operation update it accordingly
    // Update operation will check if the last value in string is also an operation
    // If yes swap if not continue on
    if (isOperation(value) && updateOperation(value))
    {
        return;
    }

    // -----------------
    // Succuessful input
    // -----------------

    // Valid input update correctly
    // Number is operation has been pressed
    handleCalculatorInput(value);
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
        getAnswer();
        separate();
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

function getAnswer()
{
    // Runs only is there exist a multiple
    if (current_string.includes('×'))
    {
        let multIndex = current_string.search('×');
        let len = current_string.length;
        // Index where x is
        let leftIndex = multIndex - 1;

        while (leftIndex >= 0 && (!(isOperation(current_string[leftIndex]))))
        {
            leftIndex -= 1;
        }
        // First half of string
        let firstHalf = current_string.slice(0, leftIndex + 1);
        
        let rightIndex = multIndex + 1;
        while (rightIndex < len && (!(isOperation(current_string[rightIndex]))))
        {
            rightIndex += 1;
        }
        let secondHalf = current_string.slice(rightIndex, len);
        
        console.log("Current string:", current_string);
        console.log("Fist half:", firstHalf);
        console.log("Second half:", secondHalf);

        if (firstHalf.length == 0 && secondHalf.length == 0)
        {
            console.log("Only one single operation being done");
            return;
        }

        let finalResult = "";
        let num1 = Number(current_string.slice(leftIndex + 1, multIndex));
        let num2 = Number(current_string.slice(multIndex + 1, rightIndex));
        console.log("Number 1:", num1);
        console.log("Number 2:", num2);
        // caluate result with number 1 and 2

    }

}
// Sets up string to be caluated
// Splits up the numbers and operations into an array
function separate()
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

    if (values.length == 0 || operations.length == 0)
    {
        return;
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
    let error = 0;
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
        else if (op === "×")
        {
            result = mult(num1, num2);
        }
        else if (op === "÷")
        {   
            if (num2 == 0)
            {
                error = 1;
                break;
            }
            result = div(num1, num2);
        }
        else
        {
            if (num2 == 0)
            {
                error = 1;
                break;
            }
            result = mod(num1, num2);
        }
        values.push(result);
    }

    if (error == 1)
    {
        current_string = "";
        screenInfo.innerHTML = "Error";
        return;
    }
   
    result = values.pop().toString();
    
    if (result.includes('.'))
    {
        console.log("Result before round", result);
        rounded_result = Number(result);
        result = rounded_result.toFixed(2).toString();
        console.log("After", result);
    }

    // Update the current string and screen to the result
    current_string = result;
    screenInfo.innerHTML = current_string;
    current_string += op;
}

function add(a, b)
{
    return a + b;
}

function sub(a, b)
{
    return a - b;
}

function mult(a, b)
{
    return a * b;
}

function div(a, b)
{
    return a / b;
}

function mod(a, b)
{
    return a % b;
}

