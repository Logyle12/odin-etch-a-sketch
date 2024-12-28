// Grid elements
const gridContent = document.querySelector('.grid-content'); 

// Initialize references for DOM elements
const colorCanvas = document.querySelector('#color-canvas');
const colorContext = colorCanvas.getContext('2d');
const dragPointer = document.querySelector('#drag-pointer');

// RGB and HSL inputs
const redInput = document.querySelector('#red-input');
const greenInput = document.querySelector('#green-input');
const blueInput = document.querySelector('#blue-input');
const hueInput = document.querySelector('#hue-input');
const saturationInput = document.querySelector('#saturation-input');
const lightnessInput = document.querySelector('#lightness-input');

// Hex Input
const hexInput = document.querySelector('#hex-input');
const hexLabel = document.querySelector('.color-label.hex-label');

// Hue Slider
const hueSlider = document.querySelector('#hue-slider');
const hueSliderContext = hueSlider.getContext('2d');
const sliderThumb = document.querySelector('.hue-slider-thumb');

// Alpha Slider
const alphaSlider = document.querySelector('#alpha-slider');
const alphaInput = document.querySelector('#alpha-input');

// Brush Size Slider
const brushSizeSlider = document.querySelector('#brush-size-slider');
const brushSizeInput = document.querySelector('#brush-size-input');

// Column/row controls: add/remove buttons 
const addRowButton = document.querySelector('.add-button.row-add');
const removeRowButton = document.querySelector('.remove-button.row-remove');
const addColumnButton = document.querySelector('.add-button.column-add');
const removeColumnButton = document.querySelector('.remove-button.column-remove');

//Column/row: number inputs
const rowInput = document.querySelector('.number-input.row-input'); 
const columnInput = document.querySelector('.number-input.column-input'); 

//Editor tools
const editorTools = document.querySelector('.editor-tools');
const drawingTools = document.querySelector('.drawing-tools');
const gridTools = document.querySelector('.grid-tools');

// Global variables
let fillColor;
let color;
let baseShade = [255, 0, 0];

// Global flags
let showGridLines = true;
let isEraserActive = false;
let isMouseDown = false;
let isGridClicked = false;

// Helper Functions
// Get elements by selector
function getElements(selector) { 
    return document.querySelectorAll(selector); 
}

// Retrieves the numeric row index from the second class of the row element.
function getRowIndex(gridCell) {
    const rowIndex = parseInt(gridCell.classList[1].match(/([0-9])\d*/g).toString());
    return rowIndex;
}

// Retrieves the numeric column index from the second class of the column's parent element.
function getColumnIndex(gridCell) {
    const columnIndex = parseInt(gridCell.parentElement.classList[1].match(/([0-9])\d*/g).toString());
    return columnIndex;
}

// Clamp a value between min and max, rounding to decimal places
function clampValue(minValue, value, maxValue, decimalPlace=0) {
    return parseFloat(Math.max(minValue, Math.min(maxValue, value)).toFixed(decimalPlace));
}

// Check if x is between min and max
function between(x, min, max) {
    return x >= min && x < max;
}

// Convert a single hex value to a decimal (base 10) number.
// Function to convert a hexadecimal value to a decimal number
function toDecimal(hexValue) {  
    // Check if the input is defined
    if (hexValue !== undefined) {  
        // Check if the input is a 2-character hex string
        if (hexValue.length == 2) {  
            // Convert the hex value to a decimal number (base 10)
            const decimalNumber = parseInt(hexValue, 16).toString(10); 
            
            // Log the converted decimal number for debugging
            console.log('Decimal Number:', decimalNumber);  
    
            // Return the converted decimal number
            return decimalNumber; 
        }    
    }
    
    // Exit the function if the input is not valid
    return;  
}

// Update button state based on count and limit
function updateButtonState(currentCount, limit, disableButton, enableButton) {
    if (currentCount == limit) {
        // Disable button at limit
        disableButton.style.pointerEvents = 'none';
        return;
    } else {
        // Enable button when below limit
        enableButton.style.pointerEvents = 'auto';
    }
}

// Function to normalize alpha value to consistent precision
function normalizeAlpha(alpha) {
    // Convert to float and round to 3 decimal places
    return parseFloat(parseFloat(alpha).toFixed(3));
}

// Function to parse color string into RGBA components
function parseColor(colorString) {
    // Extract numeric values (r, g, b, a)
    const [red, green, blue, alpha=1] = colorString.match(/\d+\.?\d*/g);

    // Return the color components
    return [parseInt(red), parseInt(green), parseInt(blue), parseFloat(alpha)];
}

// Function to construct an RGB color string from input values
function getBrushColor() {
    // Extract red, green, blue and alpha values from their respective input elements
    const [red, green, blue, alpha] = [redInput.value, greenInput.value, blueInput.value, alphaSlider.value];

    // Return color values
    return [red, green, blue, alpha];
}

// Updates the maximum value for brush size sliders based on row and column input.
function updateBrushSizeMax() { 
    // Set the slider max to the larger of row or column input values.
    brushSizeSlider.max = Math.max(parseInt(rowInput.value), parseInt(columnInput.value));
    
    // Ensure the input max matches the slider max.
    brushSizeInput.max = brushSizeSlider.max;
}

// Updates the brush size based on user input and logs the value.
function updateBrushSize(event) {
    // Parse the brush size from the input value.
    const brushSize = parseInt(event.target.value);
    
    // Log the new brush size to the console for debugging.
    console.log('Brush Size', brushSize);
    
    // Update the brush size input element with the new value.
    brushSizeInput.value = brushSize;
}

// Function to get the brush size from the slider
function getBrushSize() {
    // Parse the value of the input as an integer
    const brushSize = parseInt(brushSizeSlider.value);

    // Return the parsed brush size
    return brushSize;
}

function adjustBrushSize(event) {
    // Get brush size
    const brushSize = getBrushSize();
    console.log('Brush Size:', brushSize);

    // Get current column index
    const currentColumnIndex = getColumnIndex(event.target);
    console.log('Current Column Index:', currentColumnIndex);

    // Get current row index
    const currentRowIndex = getRowIndex(event.target);
    console.log('Current Row Index:', currentRowIndex);

    const startColumnIndex = currentColumnIndex - 1;
    const endColumnIndex = currentColumnIndex + 1;

    const startRowIndex = currentRowIndex - 1;
    const endRowIndex = currentRowIndex + 1;

    // Iterate through each column within the brush size
    for (let columnIndex = 0; columnIndex < brushSize; columnIndex++) {
        // Get adjacent column index
        const adjacentColumnIndex = currentColumnIndex + columnIndex;

        // Get adjacent column
        const column = gridContent.querySelector(`.column-${adjacentColumnIndex}`);

        // Iterate through each row within the brush size
        for (let rowIndex = 0; rowIndex < brushSize; rowIndex++) {
            // Get adjacent row index
            const adjacentRowIndex = currentRowIndex + rowIndex;

            // Get adjacent row
            const row = column.children[adjacentRowIndex - 1];

            // Apply selected color to the grid
            row.style.backgroundColor = color;
        } 
    }
}

// function adjustBrushSize(event) {
//     // Get adjacent cells
//     const [topCell, bottomCell, leftCell, rightCell] = getAdjacencyList(event.target);

//     // Set brush size
//     const brushSize = getBrushSize();

//     console.log('brush Size:', brushSize);

//     // Calculate bounds for cells
//     function calculateBounds(cell, getIndex, size, maxSize, isSubtract = false) {
//         const cellIndex = getIndex(cell);   
//         // Adjust index based on whether we need to subtract or add
//         const adjustment = Math.floor(size / 2);
//         const adjustedIndex = isSubtract ? (cellIndex - adjustment + 1) : (cellIndex + adjustment - 1);
//         return clampValue(1, adjustedIndex, maxSize);
//     }

//     // Calculate row and column bounds using the same logic
//     function getBounds(cellData, getIndex, size, maxSize) {
//         return [
//             calculateBounds(cellData[0], getIndex, size, maxSize, true),
//             calculateBounds(cellData[1], getIndex, size, maxSize)
//         ];
//     }

//     const [startRow, endRow] = getBounds([topCell, bottomCell], getRowIndex, brushSize, rowInput.value);
//     const [startColumn, endColumn] = getBounds([leftCell, rightCell], getColumnIndex, brushSize, columnInput.value);

//     // Loop through the grid and apply color
//     for (let columnIndex = startColumn; columnIndex < endColumn+1; columnIndex++) {
//         // Break if column exceeds the user-defined input
//         if (columnIndex > parseInt(columnInput.value)) break;

//         const column = gridContent.querySelector(`.column-${columnIndex}`);

//         for (let rowIndex = startRow; rowIndex < endRow+1; rowIndex++) {
//             // Break if row exceeds the user-defined input
//             if (rowIndex > parseInt(rowInput.value)) break;

//             const row = column.children[rowIndex - 1];
//             row.style.backgroundColor = color;  
//         }
//     }
// }

brushSizeSlider.addEventListener('input', updateBrushSize);
gridContent.addEventListener('mousedown', adjustBrushSize);

// =======================
// 1. Grid Setup
// =======================

// Create a single grid cell element
function createGridCell() {
    // Create a div element for the grid cell
    const grid = document.createElement('div');

    // Add the 'grid' class to the newly created grid cell
    grid.classList.add('grid');

    // Set default background color for the grid cell
    grid.style.backgroundColor = 'rgba(240, 248, 255, 1)';

    // Remove the outline if grid lines are not meant to be displayed
    if (!showGridLines) {
        grid.style.outline = 'none';
    }

    // Return the newly created grid cell
    return grid;
}

// Create a column with the specified number of grid cells
function createColumn(columnIndex, rowCount) {
    const column = document.createElement('div');
        column.classList.add('column', `column-${columnIndex}`);
        
    // Populate the column with the specified number of grid cells
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const grid = createGridCell();
        grid.classList.add(`row-${rowIndex+1}`);
        column.appendChild(grid);
    }
    
    return column; 
}

// Generate the entire grid layout with the specified number of rows and columns
function createGrid(rowCount, columnCount) {
    // Set the row and column input values
    rowInput.value = rowCount; 
    columnInput.value = columnCount;
    
    // Create and append columns to the grid container
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        gridContent.appendChild(createColumn(columnIndex + 1, rowCount));
    }
    
    // Adjust the dimensions of each cell to fit the grid container
    setCellDimensions(rowCount, columnCount);

    // Initialize the brush tool for the grid
    handleBrush();
}

// Adjust the size of each grid cell based on the number of rows and columns
function setCellDimensions(rows, columns) {
    const grids = getElements('.grid');
    const gridContentWidth = gridContent.clientWidth; 
    const gridContentHeight = gridContent.clientHeight;
    
    // Calculate cell dimensions as a fraction of the container size
    const gridCellWidth = `${gridContentWidth / columns}px`;
    const gridCellHeight = `${gridContentHeight / rows}px`;
    
    // Apply calculated dimensions to each grid cell
    grids.forEach((grid) => {
        grid.style.width = gridCellWidth;
        grid.style.height = gridCellHeight;
    });
}

// ========================
// 2. Row/Column Controls
// ========================

// Add a row to the grid
function addRow() {
    // Get the current number of rows and increment it, clamped to a maximum of 64
    const currentRows = parseInt(rowInput.value);
    const updatedRows = clampValue(1, currentRows + 1, 64);
    rowInput.value = updatedRows;
    
    // Append a new cell to each column in the grid
    const columns = getElements('.column');
    columns.forEach((column) => {
        const grid = createGridCell()
        grid.classList.add(`row-${updatedRows}`);
        column.appendChild(grid);
    });
    
    // Adjust cell dimensions after adding a row
    setCellDimensions(updatedRows, columns.length);
    
    // Update button states for row controls
    updateButtonState(updatedRows, 64, addRowButton, removeRowButton);
    
    // Update max brush size
    updateBrushSizeMax();
}

// Remove the last row from the grid
function removeRow() {
    // Get the current number of rows and decrement it, clamped to a maximum of 1
    const currentRows = parseInt(rowInput.value);
    const updatedRows = clampValue(1, currentRows - 1, 64); 
    rowInput.value = updatedRows;
    
    // Remove the last cell from each column in the grid
    const columns = getElements('.column');
    columns.forEach((column) => {
        column.lastElementChild.remove();
    });
    
    // Adjust cell dimensions after removing a row
    setCellDimensions(updatedRows, columns.length);
    
    // Update button states for row controls
    updateButtonState(updatedRows, 1, removeRowButton, addRowButton);

    // Update max brush size
    updateBrushSizeMax();
}

// Add a column to the grid
function addColumn() {
    // Get the current number of columns and increment it, clamped to a maximum of 64.
    const currentRows = parseInt(rowInput.value);
    const currentColumns = parseInt(columnInput.value);
    const updatedColumns = clampValue(1, currentColumns + 1, 64); 
    columnInput.value = updatedColumns;
    
    // Create and append a new column with grid cells
    gridContent.appendChild(createColumn(updatedColumns, currentRows));
    
    // Adjust cell dimensions after adding a column
    setCellDimensions(currentRows, updatedColumns);
    
    // Update button states for column controls
    updateButtonState(updatedColumns, 64, addColumnButton, removeColumnButton);

    // Update max brush size
    updateBrushSizeMax();
}

// Remove the last column from the grid
function removeColumn() {
    // Get the current number of columns and decrement it, clamped to a minimum of 1
    const currentColumns = parseInt(columnInput.value);
    const updatedColumns = clampValue(1, currentColumns - 1, 64); 
    columnInput.value = updatedColumns;
    
    // Remove the last column from the grid
    const columns = getElements('.column');
    columns[columns.length - 1].remove();
    
    // Adjust cell dimensions after removing a column
    setCellDimensions(parseInt(rowInput.value), updatedColumns);
    
    // Update button states for column controls
    updateButtonState(updatedColumns, 1, removeColumnButton, addColumnButton);

    // Update max brush size
    updateBrushSizeMax();
}

// Generalized setup for button event listeners
function setupButtonListeners(addButton, addAction, removeButton, removeAction) {
    // Attach the action to the "remove" button
    removeButton.addEventListener('click', removeAction);

    // Attach the action to the "add" button
    addButton.addEventListener('click', addAction);    
}

// =============================
// 3. Core Editor Tool Functions
// =============================

// Gets the currently active tool from the editor
function getActiveTool(toolGroup, activeClass) {
    // Find the tool with the specified class
    const activeTool = toolGroup.querySelector(`.${activeClass}`); 
    return activeTool; 
}

// Remove active class from the tool
function detachActiveTool(activeTool, activeToolClass) {
    // If tool is active remove class
    if (activeTool != null) {
        console.log("Active Tool: ", activeTool);
        activeTool.classList.remove(activeToolClass); 
    }
}

// Checks if selected tool is part of the tool group
function isValidTool(selectedTool, toolGroup) {
    // If selected tool is not the group itself
    if (selectedTool != toolGroup) {
        return toolGroup.contains(selectedTool);
    }
}

// Function to handle color selection in the picker
function setPickerColor(event) {
    // Prevent the default event behavior
    event.preventDefault();

    // Get the color of the clicked element (in RGBA format)
    const brushColor = parseColor(event.target.style.backgroundColor);

    // Update the color based on the selected brush color
    updateColor(brushColor[0], brushColor[1], brushColor[2], brushColor[3]);

    // Log the selected color
    console.log(`Selected Color: ${color}`);

    // Extract RGBA values from the color string
    const [red, green, blue, alpha] = parseColor(color);

    // Convert the RGB color to HSL and update the hue input
    const [hue] = rgbAToHslA(red, green, blue, alpha);
    hueInput.value = hue;

    // Log individual color components
    console.log(`Red: ${red}`);
    console.log(`Green: ${green}`);
    console.log(`Blue: ${blue}`);
    console.log(`Alpha: ${alpha}`);

    // Update input fields with the selected RGB values
    [redInput.value, greenInput.value, blueInput.value] = [red, green, blue];

    // Sync the alpha slider and input with the alpha value
    alphaSlider.value = alphaInput.value = alpha;

    // Update the pointer position in the color picker UI
    updatePointerPosition();
}

function getAdjacencyList(selectedCell) {    
    // Extract column index from parent column's classes
    const columnIndex = getColumnIndex(selectedCell) - 1; 
    
    // Extract row index from selected cell's classes
    const rowIndex = getRowIndex(selectedCell) - 1; 
    
    // Get all columns
    const columns = getElements('.column'); 
    
    // Helper function to safely access array elements
    function getValueAtIndex(array, index, defaultValue) {
        if (array[index] === undefined) {
            return defaultValue;
        }
        else {
            return array[index];
        }
    }
    
    // Determine adjacent columns
    const currentColumn = getValueAtIndex(columns, columnIndex, selectedCell);
    const leftColumn = getValueAtIndex(columns, columnIndex - 1, selectedCell);
    const rightColumn = getValueAtIndex(columns, columnIndex + 1, selectedCell);
    
    // Determine adjacent cells
    const topCell = getValueAtIndex(currentColumn.children, rowIndex - 1, selectedCell);    
    const bottomCell = getValueAtIndex(currentColumn.children, rowIndex + 1, selectedCell);    
    const leftCell = getValueAtIndex(leftColumn.children, rowIndex, selectedCell);  
    const rightCell = getValueAtIndex(rightColumn.children, rowIndex, selectedCell); 
    
    return [topCell, bottomCell, leftCell, rightCell];
}


// Function to perform depth-first search
function depthFirstSearch(sourceElement) {
    // Initialize stack and visited elements list
    const stack = [];
    const visitedElements = [];
    
    // Store the source element's background color
    const sourceColor = sourceElement.style.backgroundColor; 
    console.log(`Source Color: ${sourceColor}`);
    console.log(`Color: ${color}`);
        
    // Check if the source color matches the target color (Base Case)
    if (sourceColor == color) {
        console.log('Source Color is Target Color');
        return;
    } 
    
    else { 
        console.log('Source Color is Not Target Color'); 
        stack.push(sourceElement);
        sourceElement.style.backgroundColor = color;
    }
    
    
    // Process elements in the stack
    while (stack.length != 0) {
        
        // Pop the top element from the stack        
        const currentPosition = stack.pop();
        
        // Check if element is visited
        if (!(visitedElements.includes(currentPosition))) {
            
            visitedElements.push(currentPosition);
            
            // Retrieve adjacency list for the current position
            const adjacencyList = getAdjacencyList(currentPosition); 
            
            // Iterate through neighbors in the adjacency list
            for (const neighbor of adjacencyList) {
                // Get the neighbor's background color
                const candidateColor = neighbor.style.backgroundColor;
                
                // If the neighbor's color matches the source color, process it
                if (candidateColor == sourceColor) {
                    stack.push(neighbor);
                    neighbor.style.backgroundColor = color;
                } 
                
                else {
                    continue;
                }
            }
        }  
    }
}

// Function to handle flood fill on an event
function floodFill(event) {
    // Get the source element from the event target
    const sourceElement = event.target;
    
    // Call depthFirstSearch on the source element
    depthFirstSearch(sourceElement);
}

// =========================
// 4. Editor Tool Handlers
// =========================

// Function to handle the fill tool
function handleFill() {    
    // Change the cursor style to 'cell'
    gridContent.style.cursor = 'cell';

    // Get the RGBA color from input values
    const [red, green, blue, alpha] = getBrushColor();

    // Set the global color to the selected RGBA values
    updateColor(red, green, blue, alpha);

    // Add event listener for the flood fill action
    gridContent.addEventListener('mousedown', floodFill);
}

// Function to handle the brush tool
function handleBrush() {
    // Add a hover effect to preview the brush
    gridContent.addEventListener('mouseover', previewBrush);

    // Get the RGBA color from input values
    const [red, green, blue, alpha] = getBrushColor();

    // Set the global color to the selected RGBA values
    updateColor(red, green, blue, alpha);

    // Update the grid to reflect the current brush color settings
    updateGridColor();
}

// Handles the functionality of the eraser tool
function handleEraser() {
    // Activate the eraser
    if (!isEraserActive) {
        // Mark the eraser as active
        isEraserActive = true;

        // Update the grid to reflect the eraser color
        updateGridColor();

        // Change the cursor to crosshair
        gridContent.style.cursor = 'crosshair';
    } 
    
    console.log('Eraser Status: ', isEraserActive);
}

// Function to handle the color picker tool
function handleColorPicker() {
    isColorPickerActive = true;
    // Set the cursor style to 'pointer'
    gridContent.style.cursor = 'pointer';
    
    // Add event listener for picking a color from the grid
    gridContent.addEventListener('mousedown', setPickerColor);
}

// Function to handle grid styling
function handleGrid() {
    // Get all elements with the class 'grid'
    const grids = getElements('.grid');
    const gridOutline = '1px solid rgba(88, 88, 88, 0.525)';

    if (showGridLines) {
        // Iterate over each grid element
        grids.forEach((grid) => {
            // Remove the border styling from each grid element
            grid.style.outline = 'none';
        });

        showGridLines = false;
    }

    else {
        // Iterate over each grid element
        grids.forEach((grid) => {
            // Remove the border styling from each grid element
            grid.style.outline = gridOutline;
        });

        showGridLines = true;
    }
    
}

// Handles mouse actions for selecting editor tools
function handleDrawingTools(event) {

    // Deselect the current active tool
    const activeDrawingClass = 'active-drawing-tool'; 
    const activeTool = getActiveTool(drawingTools, activeDrawingClass);
    detachActiveTool(activeTool, activeDrawingClass);
    
    // Get the selected tool element
    const selectedTool = event.target;
    const isDrawingTool = isValidTool(selectedTool, drawingTools);

    // Clear current tool bindings
    unbindDrawingTools(); 
    
    // Reset eraser state if the selected tool is not the eraser
    if (selectedTool.id != "eraser-tool") {
        isEraserActive = false;
    }

    if (isDrawingTool) {
        console.log(selectedTool, "is in drawing tools.");
        // Check if the selected tool is different from the currently active tool
        if (selectedTool.parentElement != activeTool) {
            
            // Switch based on the selected tool's ID
            switch (selectedTool.id) {
                // Activate fill tool
                case "fill-tool":
                    handleFill(); 
                    break;
                // Activate brush tool
                case "brush-tool":
                    handleBrush(); 
                    break;
                // Activate eraser tool
                case "eraser-tool":
                    handleEraser(); 
                    break;
                // Activate color picker tool
                case "color-picker-tool":
                    handleColorPicker(); 
                    break;
                // Default: No action for unrecognized tool
                default:
                    break; 
            }
        
            // Mark the selected tool as active
            selectedTool.parentElement.classList.add(activeDrawingClass); 
        }     
    }

    else {
        return;
    }
}

function handleGridTools(event) {
    // Deselect the current active tool
    const activeTool = getActiveTool(gridTools, activeClass);
    const activeClass = 'active-grid-tool'; 
    activeTool.classList.remove(activeClass); 

    // Get the selected tool element
    const selectedTool = event.target;
    console.log(selectedTool.id);

    if (selectedTool.parentElement != activeTool) {
        
        switch (selectedTool.id) {
            // Activate tool size adjustment tool
            case "grid-line-shade-tool": 
                selectedTool.src = 'assets/icons/bright-mode.png'
                break;
            // Activate grid toggle tool
            case "grid-lines-tool":
                selectedTool.src = 'assets/icons/grid-off.png';
                handleGrid();
                break;
            default:
                break;
        }

        // Mark the selected tool as active
        selectedTool.parentElement.classList.add('active-grid-tool'); 
    }

    else {

        switch (selectedTool.id) {
            // Activate tool size adjustment tool
            case "grid-line-shade-tool": 
                selectedTool.src = 'assets/icons/night-mode.png'
                break;
            // Activate grid toggle tool
            case "grid-lines-tool":
                selectedTool.src = 'assets/icons/grid-on.png';
                handleGrid();
                break;
            default:
                break;
        }

        // Mark the selected tool as active
        selectedTool.parentElement.classList.remove('active-grid-tool'); 
    }
}

drawingTools.addEventListener('click', handleDrawingTools);
gridTools.addEventListener('click', handleGridTools);

// ================================
// 5. Editor Tool Event Management
// ================================

// Unbinds drawing tool event listeners
function unbindDrawingTools() {
    // Remove grid event listener for 'mousedown'
    gridContent.removeEventListener('mousedown', applyBrush);

    // Remove brush preview event listener 
    gridContent.removeEventListener('mouseover', previewBrush);

    // Remove flood fill tool listener
    gridContent.removeEventListener('mousedown', floodFill);

    // Remove color picker tool listener
    gridContent.removeEventListener('mousedown', setPickerColor);

    // Remove sizing tool listener
    gridContent.removeEventListener('mousedown', applyBrushArea);
}

// =======================
// 6. Grid Coloring Logic
// =======================

function previewBrush(event) {
    // Get the current background color of the target grid element
    const targetElementStyles = window.getComputedStyle(event.target);
    const targetElementColor = targetElementStyles.backgroundColor;

    // Extract RGBA values and convert to hex
    const [rTarget, gTarget, bTarget, aTarget] = parseColor(targetElementColor);
    const targetElementHex = rgbAToHexA(rTarget, gTarget, bTarget, aTarget);

    // Return if the color is already applied
    if (targetElementHex === hexInput.value) {
        return;
    }

    // Get the current background color of the cell
    const cellBackgroundColor = event.target.style.backgroundColor;
    const [rCell, gCell, bCell, aCell] = parseColor(cellBackgroundColor);
    const cellHexColor = rgbAToHexA(rCell, gCell, bCell, aCell);

    // Change the background color of the cell
    event.target.style.backgroundColor = color;

    // Do nothing if the mouse is down
    if (isMouseDown) {
        return;
    }

    // Revert to the original color when mouse leaves the target, if not drawing
    gridContent.addEventListener('mouseout', () => {
        // Check if not drawing and revert the background color
        if (!isMouseDown && !isGridClicked && cellHexColor === targetElementHex) {
            event.target.style.backgroundColor = targetElementColor;
        }
    }, { once: true });
}

// Function to apply color to a grid cell
function applyBrush(event) {
    // Prevent the default event behavior (e.g., preventing text selection)
    event.preventDefault();

    if (isEraserActive) {
        // Set the eraser color (white)
        color = 'rgba(240, 248, 255, 1)';
    }

    const [red, green, blue, alpha] = getBrushColor();
    const brushColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

    // Set the background color of the target cell to the current color
    event.target.style.backgroundColor = brushColor; 
       
    // // Log the target element (the grid cell) to the console for debugging
    // console.log(event.target);

    // // Log the ID of the target element to the console for identification
    // console.log(event.target.id);

    // Flag indicating the mouse button is pressed
    isMouseDown = true;

    // Flag indicating that the grid has been clicked
    isGridClicked = true;

    // Event listener to reset isGridClicked when the mouse leaves the grid
    gridContent.addEventListener('mouseout', () => {
        isGridClicked = false;
    }, { once: true });

    // Add event listener to continue applying color on mouseover
    gridContent.addEventListener('mouseover', applyBrush, { once: true });

}

// Function to update opacity value
function updateAlphaValue(event) {
    // Get the current alpha value
    const currentAlpha = parseFloat(alphaInput.value);
    console.log('Current Alpha:', currentAlpha);

    // Get the alpha value from the input
    const alpha = isNaN(currentAlpha) ? currentAlpha : event.target.value;
    console.log('Alpha:', alpha);

    // Sync slider and input values
    alphaInput.value = alphaSlider.value = alpha;

    // Extract RGB values from the current color
    const [red, green, blue] = parseColor(color);   

    // Update hex input with RGB values and alpha
    hexInput.value = rgbAToHexA(red, green, blue, alpha);

    // Update selected color
    updateColor(red, green, blue, alpha);

    // Log the updated color for debugging
    console.log('Color:', color);
}

function updateGridColor() {
    // Set the cursor style to 'cell'
    gridContent.style.cursor = 'cell';   
    
    // Enable coloring on mouse down and drag
    gridContent.addEventListener('mousedown', applyBrush);
    
    // Disable coloring on mouse up
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        gridContent.removeEventListener('mouseover', applyBrush);
    });
}

// =======================
// 7. Canvas Setup
// =======================

function setFillColor(baseColor) {
    // Set the base fill color for the canvas
    fillColor = baseColor;
}

function setupColorCanvas() {
    // Fill the canvas with the base color
    colorContext.fillStyle = fillColor;
    colorContext.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

    // Create a white-to-transparent horizontal gradient
    const horizontalGradient = colorContext.createLinearGradient(0, 0, colorCanvas.width, 0);
    horizontalGradient.addColorStop(0, "rgba(255,255,255,1)");
    horizontalGradient.addColorStop(1, "rgba(255,255,255,0)");

    // Create a black-to-transparent vertical gradient
    const verticalGradient = colorContext.createLinearGradient(0, 0, 0, colorCanvas.height);
    verticalGradient.addColorStop(0, "rgba(0,0,0,0)");
    verticalGradient.addColorStop(1, "rgba(0,0,0,1)");

    // Apply both gradients to the canvas
    [horizontalGradient, verticalGradient].forEach((gradient) => {
        colorContext.fillStyle = gradient;
        colorContext.fillRect(0, 0, colorCanvas.width, colorCanvas.height);
    });
}

// ===========================
// 8. Update Pointer Position
// ===========================

function updatePointerPosition() {

    // Get the current hue value from the input as an integer.
    const currentHue = parseInt(hueInput.value);

    // Determine the hue: calculate from RGB values if input is invalid, otherwise use the input hue.
    const hue = isNaN(currentHue) ? rgbAToHslA(redInput.value, greenInput.value, blueInput.value)[0] : currentHue;

    // Convert RGB to Hex and HSL
    hexInput.value = rgbAToHexA(redInput.value, greenInput.value, blueInput.value, alphaSlider.value);
    const [_, saturation, lightness] = rgbAToHslA(redInput.value, greenInput.value, blueInput.value);
    
    // Convert HSL to HSV and extract components
    const [hueAngle, saturationHsv, value] = hslToHsv(hue, saturation, lightness);
    
    // Calculate the horizontal position of the drag pointer on the canvas
    const leftOffset = `${Math.round(((saturationHsv/100) * colorCanvas.width) - dragPointer.offsetWidth / 2)}px`;
    
    // Calculate the vertical position of the drag pointer on the canvas
    const topOffset = `${Math.round(((((100 - value)/100) * colorCanvas.height) - dragPointer.offsetWidth / 2))}px`;
    
    // Position the drag pointer based on calculated offsets
    dragPointer.style.transformOrigin = `top left`;
    dragPointer.style.transform = `translate(${leftOffset}, ${topOffset})`;
    
    // Position the slider thumb based on the hue angle
    const sliderOffset = Math.round((parseInt(hueAngle) / 360) * hueSlider.width);
    sliderThumb.style.left = `${sliderOffset}px`;
    
    // Upstate the color canvas base on hue,saturation and lightness
    updateColorCanvas(hue, saturation, lightness);
    
    //Update hue, saturation and lightness input fields
    [hueInput.value, saturationInput.value, lightnessInput.value] = [hue, saturation, lightness];   
}

// ==========================
// 9. Update Slider Position
// ==========================

function updateSliderPosition() {
    // Get HSL values and calculate the X position on the hue slider.
    const [hue, saturation, lightness] = [hueInput.value, saturationInput.value, lightnessInput.value];
    const x = (hue/360) * hueSlider.width;

    // Clamp X to slider bounds, update thumb position, and log values.
    const sliderOffset = clampValue(0, x, hueSlider.width);
    sliderThumb.style.left = `${sliderOffset}px`;
    // console.log(`X (Update Slider): ${x}`);
    // console.log(`Slider Offset: ${sliderOffset}`);

    // Convert HSL to HSV and extract components
    const [hueAngle, saturationHsv, value] = hslToHsv(hue, saturation, lightness);
    
    // Calculate the horizontal position of the drag pointer on the canvas
    const leftOffset = `${Math.round(((saturationHsv/100) * colorCanvas.width) - dragPointer.offsetWidth / 2)}px`;
    // console.log(`X: ${leftOffset}`);
    
    // Calculate the vertical position of the drag pointer on the canvas
    const topOffset = `${Math.round(((((100 - value)/100) * colorCanvas.height) - dragPointer.offsetWidth / 2))}px`;
    // console.log(`Y: ${topOffset}`);

    // Position the drag pointer based on calculated offsets
    dragPointer.style.transformOrigin = `top left`;
    dragPointer.style.transform = `translate(${leftOffset}, ${topOffset})`;

    // Convert HSL to RGB with full saturation and lightness, then update the color canvas.
    baseShade = hslAToRgbA(hueInput.value, 100, 50);
    updateColorCanvas(hueAngle, saturation, lightness);
    
    // Calculate the RGB values based on the current hue, saturation, and lightness
    [redInput.value, greenInput.value, blueInput.value] = hslAToRgbA(hueInput.value, saturationInput.value, lightnessInput.value);
    hexInput.value = rgbAToHexA(redInput.value, greenInput.value, blueInput.value, alphaSlider.value);  
}

// =====================
// 10. Update Hex Color
// =====================

function updateHexColor() {
    // Extract RGB components from the hex color input and update RGB fields
    const [red, green, blue] = hexAToRgbA(hexInput.value);
    [redInput.value, greenInput.value, blueInput.value] = [red, green, blue];

    if (hexInput.value.length === 7) {
        // Update slider and input with the alpha value
        alphaSlider.value = alphaInput.value = 1; 
       
        // Convert RGB values to HSL components and update HSL fields
        const [hue, saturation, lightness] = rgbAToHslA(redInput.value, greenInput.value, blueInput.value);
        [hueInput.value, saturationInput.value, lightnessInput.value] = [hue, saturation, lightness];
        
        // Convert HSL to HSV and extract components
        const [hueAngle, saturationHsv, value] = hslToHsv(hue, saturation, lightness);
        
        // Calculate the horizontal position of the drag pointer on the canvas
        const leftOffset = `${Math.round(((saturationHsv / 100) * colorCanvas.width) - (dragPointer.offsetWidth / 2))}px`;

        // Calculate the vertical position of the drag pointer on the canvas
        const topOffset = `${Math.round((((100 - value) / 100) * colorCanvas.height) - (dragPointer.offsetWidth / 2))}px`;

        // Position the drag pointer based on calculated offsets
        dragPointer.style.transformOrigin = 'top left';
        dragPointer.style.transform = `translate(${leftOffset}, ${topOffset})`;

        // Position the slider thumb based on the hue angle
        const sliderOffset = Math.round((parseInt(hueAngle) / 360) * hueSlider.width);
        sliderThumb.style.left = `${sliderOffset}px`;

        // Update the color canvas with the new HSL values
        updateColorCanvas(hueAngle, saturation, lightness);

        // Update selected color
        updateColor(red, green, blue);
    }

    // Check if the input is a 9-character hex color code
    if (hexInput.value.length === 9) {  
        // Extract the alpha (last two hex characters)
        const alphaHex = getHexCode(hexInput.value).pop();
        
        // Convert hex alpha to decimal
        const alphaDecimal = toDecimal(alphaHex);  
        
        if (alphaDecimal === undefined) {
            return;
        }
        
        // Normalize to 0-1 range and round to 3 decimals
        const alpha = parseFloat((alphaDecimal / 255).toFixed(3));
        console.log('Alpha:', alpha); 
        
        // Update slider and input with the alpha value
        alphaSlider.value = alphaInput.value = alpha; 

        // Update selected color
        updateColor(red, green, blue, alpha);
    }
}

// ========================
// 11. Listen on RGB Input
// ========================

function setupColorInputListeners() {
    // Hex input listener
    hexInput.addEventListener('input', () => {
        // Update hex color based on the input value
        updateHexColor();
    });
    
    // Red input listener
    redInput.addEventListener('input', () => {
        // Clamp red value between 0 and 255, allowing up to 3 digits
        redInput.value = clampValue(0, redInput.value.slice(0, 3), 255);

        // Update hue slider position based on the input value
        updatePointerPosition();
    });  

    // Green input listener
    greenInput.addEventListener('input', () => {
        // Clamp green value between 0 and 255, allowing up to 3 digits
        greenInput.value = clampValue(0, greenInput.value.slice(0, 3), 255);

        // Update hue slider position based on the input value
        updatePointerPosition();
    }); 

    // Blue input listener
    blueInput.addEventListener('input', () => {
        // Clamp blue value between 0 and 255, allowing up to 3 digits
        blueInput.value = clampValue(0, blueInput.value.slice(0, 3), 255);

        // Update hue slider position based on the input value
        updatePointerPosition();
    }); 
    
    // Hue input listener
    hueInput.addEventListener('input', () => {
        // Clamp hue value between 0 and 360, allowing up to 3 digits
        hueInput.value = clampValue(0, hueInput.value.slice(0, 3), 360);

        // Update hue slider position based on the input value
        updateSliderPosition();
    }); 

    // Saturation input listener to handle input changes
    saturationInput.addEventListener('input', () => {
        // Convert the saturation input value to a floating-point number
        const saturation = parseFloat(saturationInput.value);

        // If saturation is not an integer, limit the input length to 4 characters
        if (!Number.isInteger(saturation)) {
            if (saturationInput.value.length > 4) {
                saturationInput.value = clampValue(0, saturationInput.value.slice(0, 4), 100, 2);
            }
        }
        
        // If saturation is an integer, limit the input length to 3 characters
        else {
            if (saturationInput.value.length > 3) {
                saturationInput.value = clampValue(0, saturationInput.value.slice(0, 4), 100, 2);
            }
        }

        // Update hue slider position based on the input value
        updateSliderPosition();
    });
    
    // Lightness input listener to handle input changes
    lightnessInput.addEventListener('input', () => {
        // Convert the lightness input value to a floating-point number
        const lightness = parseFloat(lightnessInput.value);

        // If lightness is not an integer, limit the input length to 4 characters
        if (!Number.isInteger(lightness)) {
            if (lightnessInput.value.length > 4) {
                lightnessInput.value = clampValue(0, lightnessInput.value.slice(0, 4), 100, 2);
            }
        }

        // If lightness is an integer, limit the input length to 3 characters
        else {
            if (lightnessInput.value.length > 3) {
                lightnessInput.value = clampValue(0, lightnessInput.value.slice(0, 4), 100, 2);
            }
        }

        // Update hue slider position based on the input value
        updateSliderPosition();
    });

    // Alpha input listener
    alphaInput.addEventListener('input', (event) => {
        // Check input when there are at least 3 characters
        if (alphaInput.value.length >= 3) {

            // Convert the alpha input value to a floating-point number
            const alpha = parseFloat(alphaInput.value);

            // If alpha is not an integer, limit the input length to 5 characters
            if (!Number.isInteger(alpha)) {
                if (alphaInput.value.length > 5) {
                    alphaInput.value = clampValue(0, alphaInput.value.slice(0, 5), 1, 3);
                }
            }

            // If alpha is an integer, limit the input length to 1 character
            else {
                alphaInput.value = clampValue(0, alphaInput.value.slice(0, 1), 1, 1);
            } 
            
            // Update alpha slider position
            updateAlphaValue(event);
        } 
    });

    // Alpha slider listener
    alphaSlider.addEventListener('input', updateAlphaValue);
}

// ===========================
// 12. Update Base Canvas Color
// ===========================

function updateColorCanvas(colorAngle, saturation, lightness) {
    // Convert the hue to RGB with full saturation and lightness for preview
    baseShade = hslAToRgbA(colorAngle, 100, 50);
    console.log('Base Shade:', baseShade);

    // Create an HSL string for the current hue at 100% saturation and 50% lightness
    fillColor = `hsl(${colorAngle}, ${100}%, ${50}%)`;

    // Update the color preview canvas with the selected color
    setupColorCanvas();

    // Convert HSL to RGB, log the HSL values, and extract RGB components
    const selectedColor = hslAToRgbA(colorAngle, saturation, lightness);
    const [red, green, blue] = selectedColor;
    console.log(`hsl(${colorAngle}, ${saturation}, ${lightness})`);

    // Extract alpha value
    const alpha = alphaSlider.value;

    // Update the selected color using the current RGB values
    updateColor(red, green, blue, alpha);
}

// =============================
// 13. Selected Color Functions
// =============================

function getMouseCoordinates(event) {
    // Get the X and Y coordinates of the mouse event relative to the canvas
    const x = event.offsetX;
    const y = event.offsetY;  

    // Log mouse coordinates
    console.log(`X: ${x}px`);
    console.log(`Y: ${y}px`);

    return [x, y];
}

function calculateRGB(x, y) {
    // Calculate gradient factors
    const whiteFactor = 1 - (x / colorCanvas.width);
    console.log(`White Factor: ${whiteFactor}`);

    const blackFactor = y / colorCanvas.height;
    console.log(`Black Factor: ${blackFactor}`);

    // Base color components 
    const [baseRed, baseGreen, baseBlue] = [baseShade[0], baseShade[1], baseShade[2]];

    // Apply horizontal gradient
    const adjustedRed = baseRed + (whiteFactor * (255 - baseRed));
    const adjustedGreen = baseGreen + (whiteFactor * (255 - baseGreen));
    const adjustedBlue = baseBlue + (whiteFactor * (255 - baseBlue));
    
    // Apply vertical gradient
    const finalRed = clampValue(0, adjustedRed * (1 - blackFactor), 255);
    const finalGreen = clampValue(0, adjustedGreen * (1 - blackFactor), 255);
    const finalBlue = clampValue(0, adjustedBlue * (1 - blackFactor), 255);

    return [finalRed, finalGreen, finalBlue];
}

function setBrushColor(event) {
    // Get mouse coordinates on canvas
    const [x, y] = getMouseCoordinates(event);

    // Calculate RGB values based on coordinates
    const [red, green, blue] = calculateRGB(x, y);

    // Get alpha value
    const alpha = alphaSlider.value;

    // Update selected color
    updateColor(red, green, blue, alpha);
    console.log(color);

    // Update RGB input fields and pointer position
    [redInput.value, greenInput.value, blueInput.value] = [red, green, blue]
    updatePointerPosition();
}

function updateColor(red, green, blue, ...alpha) {
    // Normalize the alpha value if provided
    const normalizedAlpha = normalizeAlpha(alpha);

    // Check if alpha value is provided and less than 1
    if (normalizedAlpha.toString().length > 0 && normalizedAlpha < 1) {
        // Use RGBA format if alpha is provided and less than 1
        color = `rgba(${red}, ${green}, ${blue}, ${normalizedAlpha})`;
    } else {
        // Use RGB format if alpha is not provided or equals 1
        color = `rgb(${red}, ${green}, ${blue})`;
    }

    updateColorPreview();
}

function updateColorPreview() {
    // Set hex input background color to the current color.
    hexInput.style.backgroundColor = color;

    // Get RGB values from the inputs.
    const [red, green, blue] = [
        parseInt(redInput.value),
        parseInt(greenInput.value),
        parseInt(blueInput.value)
    ];

    // Get alpha value from the input.
    const alpha = parseFloat(alphaSlider.value);

    // Function to calculate the blended color based on alpha.
    // The alpha value adjusts the transparency of the color.
    const blendedColor = (colorChannel, alphaChannel) => {
        return ((1 - alphaChannel) * 255) + (alphaChannel * colorChannel);
    };

    // Calculate blended RGB values based on alpha.
    const [blendedRed, blendedGreen, blendedBlue] = [
        blendedColor(red, alpha),
        blendedColor(green, alpha),
        blendedColor(blue, alpha)
    ];

    // Calculate the perceived brightness using the weighted formula.
    // Reference: https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
    const perceivedBrightness = (0.299 * blendedRed) + (0.587 * blendedGreen) + (0.144 * blendedBlue);
    console.log('Perceived Brightness:', perceivedBrightness);

    // Adjust text color based on perceived brightness.
    if (perceivedBrightness > 128) {
        // Lighter background: Use darker text colors for better contrast
        hexInput.style.color = 'rgba(0, 0, 0, 0.85)';
        hexLabel.style.color = 'rgba(20, 17, 13, 0.85)';
    } else {
        // Darker background: Use lighter text colors for better contrast
        hexInput.style.color = 'rgba(231, 231, 231, 0.85)';
        hexLabel.style.color = 'rgba(185, 188, 192, 0.705)';
    }
}

// =======================  
// 14. Color Picker Setup
// =======================

function setupColorPicker(targetElement, callbackFunction) {
    // Adds a mousedown event to capture color at the clicked position
    targetElement.addEventListener('mousedown', (event) => {
        // Logs when mouse is pressed down
        console.log('MOUSE DOWN'); 

        // Updates color based on mouse position
        callbackFunction(event);

        // Tracks mouse movement to update color
        targetElement.addEventListener('mousemove', callbackFunction);

        // Removes mousemove event listener when mouse button is released
        document.addEventListener('mouseup', () => {
            targetElement.removeEventListener('mousemove', callbackFunction);
        });
    });
}

function InitializeColorPicker() {
    // Parse the fill color into RGBA components
    const parsedFillColor = parseColor(fillColor);
    const [red, green, blue, alpha] = parsedFillColor;

    // Log the parsed RGBA values for debugging
    console.log('Fill Color:', red, green, blue, alpha);

    // Update input values for red, green, blue, and alpha
    [redInput.value, greenInput.value, blueInput.value] = [red, green, blue];
    alphaSlider.value = alphaInput.value = alpha;

    // Adjust the pointer position on the canvas
    updatePointerPosition();
}

// ============================== 
// 15. Convert Hex Values to RGB
// ==============================

function getHexCode(hexCode) {
    // Extract pairs of hex values from the input string.
    const [hexRed, hexBlue, hexGreen, hexAlpha] = hexCode.match(/([A-F]{2}|[A-F][0-9]|[0-9][A-F]|[0-9]{2})/gi);
    return [hexRed, hexBlue, hexGreen, hexAlpha]
}

function hexAToRgbA(hexCode) {
    // Destructure the hex values into red, green, and blue components.
    const [hexRed, hexBlue, hexGreen, hexAlpha] = getHexCode(hexCode);
    console.log('Alpha:', hexAlpha);
    
    // Convert hex components to decimal RGB values.
    const [red, green, blue, alpha] = [toDecimal(hexRed), toDecimal(hexBlue), toDecimal(hexGreen), toDecimal(hexAlpha)];

    // Return the RGB values as an array.
    return [red, green, blue, alpha];
}

// ============================== 
// 16. Convert RGB Values to Hex
// ==============================

function rgbAToHexA(red, green, blue, alpha=1) {

    const normalizedAlpha = normalizeAlpha(alpha);

    // Convert RGBA values to hexadecimal (base 16) strings
    const toHex = (value) => {
       const hexValue = Math.round(parseFloat(value)).toString(16).slice(0, 2).padStart(2, "0");
       return hexValue;

    };

     // Combine the hex values into a single string, prefixed with '#'
     let hexCode = `#${toHex(red)}${toHex(green)}${toHex(blue)}`; 

    // If alpha is less than 1, add its corresponding hex value to the string
    if (normalizedAlpha < 1) {
        hexCode += `${toHex(normalizedAlpha*255)}`;
    }

    // Return the resulting hex color code

    return hexCode;
}

// =============================
// 17. Convert RGB Values to HSL
// =============================

function rgbAToHslA(red, green, blue, alpha=1) {
    // Normalize the RGB values to the range [0, 1]
    red /= 255;
    green /= 255;
    blue /= 255;

    // Calculate the maximum and minimum RGB values
    const maxValue = Math.max(red, green, blue);
    const minValue = Math.min(red, green, blue);

    // Calculate chroma (difference between max and min values)
    const chroma = maxValue - minValue;

    // Declare HSL variables for color manipulation
    let hue, saturation, lightness;

    // Calculate the lightness as the average of the max and min RGB values, then convert to a percentage [0, 100]
    lightness = parseFloat((((maxValue + minValue) / 2) * 100).toFixed(1));

    // Calculate the saturation based on lightness, ensuring valid percentage [0, 100]
    if (chroma === 0) {
        // No saturation if chroma is zero
        saturation = 0; 
    } else {
        if ((lightness / 100) <= 0.5) {
            saturation = parseFloat(((chroma / (2 * (lightness / 100))) * 100).toFixed(1));
        } else {
            saturation = parseFloat(((chroma / (2 * (1 - lightness / 100))) * 100).toFixed(1));
        }
    }

    // Calculate the hue based on the largest RGB component or default to zero if chroma is zero
    if (chroma === 0) {
        // No hue if chroma is zero
        hue = 0; 
    } else if (red === maxValue) {
        // Hue for red dominance
        hue = Math.round(60 * ((green - blue) / chroma)); 
    } else if (green === maxValue) {
        // Hue for green dominance
        hue = Math.round(60 * ((blue - red) / chroma) + 120); 
    } else {
        // Hue for blue dominance
        hue = Math.round(60 * ((red - green) / chroma) + 240);
    }

    if (hue < 0) {
        hue += 360;
    }

    // Clamp the values to their valid ranges and return them
    [hue, saturation, lightness] = [clampValue(0, hue, 360), clampValue(0, saturation, 100, 1), clampValue(0, lightness, 100, 1)];

    return [hue, saturation, lightness, alpha];
}


// ==============================
// 18. Convert HSL Values to RGB
// ==============================

function hslAToRgbA(hueValue, saturationValue, lightnessValue, alpha=1) {
    // Normalize saturation and lightness to [0, 1]
    saturationValue /= 100;
    lightnessValue /= 100;

    // Calculate the chroma (color intensity)
    const chroma = (1 - Math.abs(2 * lightnessValue - 1)) * saturationValue;

    // Determine hue segment (6 sections of the color wheel)
    const hueSegment = (hueValue / 60) % 6;
    
    // Compute the intermediate x component for color mixing
    const xComponent = chroma * (1 - Math.abs(hueSegment % 2 - 1));

    // Declare raw RGB variables for intermediate color values.
    let redRaw, greenRaw, blueRaw;

    // Assign RGB values based on hue segment
    if (between(hueSegment, 0, 1)) {
        [redRaw, greenRaw, blueRaw] = [chroma, xComponent, 0];
    } else if (between(hueSegment, 1, 2)) {
        [redRaw, greenRaw, blueRaw] = [xComponent, chroma, 0];
    } else if (between(hueSegment, 2, 3)) {
        [redRaw, greenRaw, blueRaw] = [0, chroma, xComponent];
    } else if (between(hueSegment, 3, 4)) {
        [redRaw, greenRaw, blueRaw] = [0, xComponent, chroma];
    } else if (between(hueSegment, 4, 5)) {
        [redRaw, greenRaw, blueRaw] = [xComponent, 0, chroma];
    } else if (between(hueSegment, 5, 6)) {
        [redRaw, greenRaw, blueRaw] = [chroma, 0, xComponent];
    } else {
        [redRaw, greenRaw, blueRaw] = [0, 0, 0]; // Default case (should not occur)
    }

    // Calculate the match value to adjust for lightness
    const match = lightnessValue - (chroma / 2);

    // Final RGB values adjusted and clamped to [0, 255]
    const red = clampValue(0, (redRaw + match) * 255, 255);
    const green = clampValue(0, (greenRaw + match) * 255, 255);
    const blue = clampValue(0, (blueRaw + match) * 255, 255);

    // Return final RGB values
    return [red, green, blue, alpha];
}

// ==============================
// 19. Convert HSL Values to HSV
// ==============================

function hslToHsv(hueValue, saturationValue, lightnessValue) {
    // Normalize saturation and lightness to [0, 1]
    saturationValue /= 100;
    lightnessValue /= 100;

    // Compute Value (V) as lightness + saturation
    let value = (lightnessValue) + (saturationValue * Math.min(lightnessValue, 1 - lightnessValue));
    // console.log(`Value: ${value}`);
    let saturationValueHsV;

    // Calculate Saturation (S) in HSV based on lightness and value
    if (value === 0) {
        saturationValueHsV = 0;
        // console.log("Value is 0");
    } else if (lightnessValue <= 0.5) {
        saturationValueHsV = 2 * (1 - lightnessValue / value);
        // console.log("Lightness is less than 0.5");
    } else {
        saturationValueHsV = (2 * saturationValue * (1 - lightnessValue)) / value;
        // console.log("Lightness is greater than 0.5");
    }

    // Convert to percentages and return as [H, S, V]
    return [hueValue, saturationValueHsV * 100, value * 100];
}

// =========================
// 20. Hue Slider Setup
// =========================

function setupHueSlider() {

    // Create a linear gradient for the slider that represents the color spectrum
    const hueGradient = hueSliderContext.createLinearGradient(0, 0, hueSlider.width, 0);
    hueGradient.addColorStop(0, 'rgba(255,0,0,1)');       // Red
    hueGradient.addColorStop(0.17, 'rgba(255,255,0,1)');  // Yellow
    hueGradient.addColorStop(0.34, 'rgba(0,255,0,1)');    // Green
    hueGradient.addColorStop(0.51, 'rgba(0,255,255,1)');  // Cyan
    hueGradient.addColorStop(0.68, 'rgba(0,0,255,1)');    // Blue
    hueGradient.addColorStop(0.85, 'rgba(255,0,255,1)');  // Magenta
    hueGradient.addColorStop(1, 'rgba(255,0,0,1)');       // Red (loops back to red)

    // Fill the slider with the gradient
    hueSliderContext.fillStyle = hueGradient;
    hueSliderContext.fillRect(0, 0, hueSlider.width, hueSlider.height);
}

// =========================
// 21. Update Hue Color
// =========================

function updateHue(event) {
    // Get the X coordinate of the click event relative to the hue slider
    const x = event.offsetX + 1;
    
    // Calculate the hue value based on the click position and slider width
    const hueValue = clampValue(0, (x / hueSlider.offsetWidth) * 360, 360);
    console.log(`Hue Value: ${hueValue}`);
    hueInput.value = Math.round(hueValue);

    // Convert the hue to RGB with full saturation and lightness for preview
    baseShade = hslAToRgbA(hueInput.value, 100, 50);
    console.log(baseShade);

    // Adjust the slider thumb position to center it at the clicked point
    const leftOffset = clampValue(0, x, hueSlider.width);
    console.log(`X: ${x}`);
    console.log(`Left Offset: ${leftOffset}px`);
    sliderThumb.style.left = `${leftOffset}px`;

    // Calculate the RGB values based on the current hue, saturation, and lightness
    [redInput.value, greenInput.value, blueInput.value] = hslAToRgbA(hueInput.value, saturationInput.value, lightnessInput.value);

    // Convert RGB values to HEX (function handles display/update)
    hexInput.value = rgbAToHexA(redInput.value, greenInput.value, blueInput.value, alphaSlider.value);
    
    // Update base color
    const [hue, saturation, lightness] = [hueInput.value, saturationInput.value, lightnessInput.value]
    updateColorCanvas(hue, saturation, lightness);
}

// =======================
// Initialization
// =======================
createGrid(8, 8);
setFillColor('rgba(255, 0, 0, 1)');
setupColorCanvas();
setupHueSlider();
setupColorPicker(colorCanvas, setBrushColor);
setupColorPicker(hueSlider, updateHue);
InitializeColorPicker();
setupColorInputListeners();
setupButtonListeners(addRowButton, addRow, removeRowButton, removeRow);
setupButtonListeners(addColumnButton, addColumn, removeColumnButton, removeColumn);