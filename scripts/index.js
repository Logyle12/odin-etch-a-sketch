// Grid elements
const sketchContainer = document.querySelector('.sketch-container');
const gridContent = document.querySelector('.grid-content'); 

// Define dark and light grid colors
const darkGridColor = 'rgba(0, 0, 0, 0.85)'; 
const lightGridColor = 'rgb(240, 248, 255)';  

// Define dark and light outlines
const darkOutline = '1px solid rgba(88, 88, 88, 0.525)';
const lightOutline = '1px solid rgba(255, 255, 255, 0.42)'; 

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

// Alpha Elements
const alphaSlider = document.querySelector('#alpha-slider');
const alphaInput = document.querySelector('#alpha-input');

// Brush Size Elements
const brushSizeTitle = document.querySelector('#brush-size-title');
const brushSizeSlider = document.querySelector('#brush-size-slider');
const brushSizeInput = document.querySelector('#brush-size-input');

// Column/Row Controls: Add/Remove Buttons 
const addRowButton = document.querySelector('.add-button.row-add');
const removeRowButton = document.querySelector('.remove-button.row-remove');
const addColumnButton = document.querySelector('.add-button.column-add');
const removeColumnButton = document.querySelector('.remove-button.column-remove');

// Column/Row: Number Inputs
const rowInput = document.querySelector('.grid-input.row-input'); 
const columnInput = document.querySelector('.grid-input.column-input'); 

// Color History
const undoStack = [];
const redoStack = [];

// Undo/Redo Controls
const undoButton = document.querySelector('#undo-button');
const redoButton = document.querySelector('#redo-button');

// Editor tools
const editorTools = document.querySelector('.editor-tools');
const drawingTools = document.querySelector('.drawing-tools');
const gridTools = document.querySelector('.grid-tools');
const zoomTools = document.querySelector('.zoom-tools')

// Save Button
const saveButton = document.querySelector('#save-button');

// Color Palettes 
const defaultPalette = [
    '#000000FF', // Black
    '#8B0000CC', // Dark Red
    '#FF4500CC', // Orange Red
    '#FF8C00CC', // Dark Orange
    '#FFD700CC', // Gold
    '#FFFF00CC', // Bright Yellow
    '#ADFF2FCC', // Lime Green
    '#32CD32CC', // Green
    '#00FA9ACC', // Spring Green
    '#00CED1CC', // Dark Turquoise
    '#4682B4CC', // Steel Blue
    '#1E90FFCC', // Dodger Blue
    '#0000FFCC', // Pure Blue
    '#8A2BE2CC', // Blue Violet
    '#9400D3CC', // Dark Violet
    '#9932CCCC', // Dark Orchid
    '#FF00FFCC', // Magenta
    '#FF1493CC', // Deep Pink
    '#FF69B4CC', // Hot Pink
    '#FF6347CC', // Tomato Red
    '#D2691ECC', // Chocolate Brown
    '#CD5C5CCC', // Indian Red
    '#808080CC', // Gray
    '#C0C0C0CC', // Silver
    '#FFFFFFFF', // White
];

const vividShades = [
    '#F44336AA', // Vivid Red
    '#E53935AA', // Bright Red
    '#D32F2FAA', // Dark Red
    '#C62828AA', // Deep Red
    '#B71C1CAA', // Crimson Red
    '#E91E63AA', // Hot Pink
    '#D81B60AA', // Deep Pink
    '#C2185BAA', // Fuchsia Pink
    '#AD1457AA', // Berry Pink
    '#880E4FAA', // Magenta
    '#8E24AAAA', // Amethyst
    '#9C27B0AA', // Purple
    '#7B1FA2AA', // Royal Purple
    '#6A1B9AAA', // Deep Violet
    '#4A148CAA', // Indigo Violet
    '#673AB7AA', // Lavender
    '#5E35B1AA', // Deep Lavender
    '#512DA8AA', // Grape Purple
    '#4527A0AA', // Midnight Purple
    '#311B92AA', // Navy Purple
    '#3F51B5AA', // Blue Purple
    '#3949ABAA', // Indigo Blue
    '#303F9FAA', // Slate Blue
    '#283593AA', // Royal Blue
    '#1A237EAA'  // Deep Navy Blue
];

const softTones = [
    '#1ABC9CAA', // Turquoise Green
    '#16A085AA', // Seafoam Green
    '#2ECC71AA', // Emerald Green
    '#27AE60AA', // Forest Green
    '#3498DBAA', // Sky Blue
    '#2980B9AA', // Deep Sky Blue
    '#9B59B6AA', // Purple Orchid
    '#8E44ADAA', // Deep Lavender
    '#34495EAA', // Blue Gray
    '#2C3E50AA', // Midnight Blue
    '#F1C40FAA', // Sunflower Yellow
    '#F39C12AA', // Golden Orange
    '#E67E22AA', // Pumpkin Orange
    '#D35400AA', // Rust Orange
    '#E74C3CAA', // Vermillion
    '#C0392BAA', // Deep Red Orange
    '#A29BFEAA', // Periwinkle
    '#74B9FFAA', // Soft Sky Blue
    '#81ECEFAA', // Light Aqua
    '#55EFC4AA', // Mint Turquoise
    '#FAB1A0AA', // Coral Pink
    '#FF7675AA', // Soft Coral
    '#F8A5C2AA', // Pink Lavender
    '#D1CCC0AA', // Sandy Beige
    '#E0E0E0AA'  // Soft Pearl Gray
];

const coldPalette = [
    '#020A11FF', // Frostbite Black
    '#030F1AFF', // Icy Shadow
    '#051322FF', // Glacial Depth
    '#07182AFF', // Northern Blue
    '#0D1B2AFF', // Midnight Navy
    '#091C2DFF', // Deep Freeze
    '#0E2136FF', // Midnight Ice
    '#1B263BFF', // Dark Ocean Blue
    '#142F49FF', // Frozen Abyss
    '#193D5BFF', // Arctic Night
    '#2C3E50FF', // Deep Slate Blue
    '#214A6AFF', // Cold Deep Blue
    '#34495EFF', // Blue Gray
    '#285B7AFA', // Winter Sky
    '#31708EFA', // Frozen Lake
    '#4A6A86FF', // Steely Blue
    '#4682B4FA', // Steel Ice
    '#5D82A3FF', // Misty Blue
    '#75A0C1FF', // Ice Blue
    '#89C2D9FA', // Polar Aqua
    '#A6C8E8FF', // Frost Blue
    '#B4D8E6FA', // Ice Mist
    '#D4E3EFFA', // Soft Cyan
    '#D0E4F7FF', // Arctic Blue
    '#E6F0FAFF'  // Glacier White
];

const warmPalette = [
    '#C2B28099', // Sandstone Beige
    '#D1B59999', // Light Tan
    '#E5BAA299', // Pale Peach
    '#F5C6A599', // Warm Peach
    '#FFC1A899', // Soft Coral
    '#F7AD91AA', // Light Terracotta
    '#F39483AA', // Warm Clay
    '#F3746BAA', // Deep Salmon
    '#E95F51AA', // Burnt Coral
    '#DE5141AA', // Rust Red
    '#CC3F30AA', // Red Clay
    '#B32C1DAA', // Deep Rust
    '#991D0CAA', // Brick Red
    '#8A2B06AA', // Mahogany
    '#7B4209AA', // Dark Sepia
    '#996F32AA', // Burnt Umber
    '#A9813BAA', // Honey Brown
    '#B8944EAA', // Tawny Brown
    '#C6A661AA', // Pale Gold
    '#D4B875AA', // Soft Gold
    '#E3CA8BAA', // Light Gold
    '#F0DBA1AA', // Golden Sand
    '#FCE5B6AA', // Pale Cream
    '#FFEDD6AA', // Ivory
    '#FFF8EA99'  // Soft White
];

// Palette Input
const paletteSelect = document.querySelector('#palette-select');

// Color Swatches
const colorSwatches = document.querySelectorAll('.color-swatch');
const swatchesContainer = document.querySelector('.color-swatches');

// Global variables
let fillColor;
let color;
let baseShade = [255, 0, 0];

// Global flags
let darkMode = true;
let showGridLines = true;
let isEraserActive = false;
let isMouseDown = false;
let isGridClicked = false;
let undoInitialized = false;
let isUndo = true;
let isColumn = true;
let previewInterval = 0;

// Helper Functions
// Get elements by selector
function getElements(selector) { 
    const elementsArray = Array.from(document.querySelectorAll(selector)); 
    return elementsArray;
}

// Retrieves the numeric column index from the second class of the column's parent element.
function getColumnIndex(gridCell) {
    const columnIndex = parseInt(gridCell.parentElement.classList[1].match(/([0-9])\d*/g).toString());
    return columnIndex;
}

// Retrieves the numeric row index from the second class of the row element.
function getRowIndex(gridCell) {
    const rowIndex = parseInt(gridCell.classList[2].match(/([0-9])\d*/g).toString());
    return rowIndex;
}

// Clamp a value between min and max, rounding to decimal places
function clampValue(minValue, value, maxValue, decimalPlace=0) {
    // Return undefined if NaN
    if (isNaN(value)) {
        return;
    }

    // Otherwise return clamped & rounded value
    else {
        return parseFloat(Math.max(minValue, Math.min(maxValue, value)).toFixed(decimalPlace));
    }
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

// =======================
// 1. Grid Setup
// =======================

// Create a single grid cell element
function createGridCell() {
    // Create a div element for the grid cell
    const gridCell = document.createElement('div');

    // Add the 'grid' class to the newly created grid cell
    gridCell.classList.add('grid-cell');


    // Set grid cell color based on mode
    if (darkMode) {
        // Set dark grid color for the grid cell
        gridCell.style.backgroundColor = darkGridColor; 

        // Set light outline for the grid cell
        gridCell.style.outline = lightOutline;
    }

    else {
        // Set light grid color for the grid cell
        gridCell.style.backgroundColor = lightGridColor; 

        // Set dark outline for the grid cell
        gridCell.style.outline = darkOutline;
    }

    // Remove the outline if grid lines are not meant to be displayed
    if (!showGridLines) {
        gridCell.style.outline = 'none';
    }

    // Return the newly created grid cell
    return gridCell;
}

// Create a column with the specified number of grid cells
function createColumn(columnIndex, rowCount) {
    // Create a new div element for the column
    const column = document.createElement('div');

    // Add classes for styling and identification
    column.classList.add('column', `column-${columnIndex}`);

    // Populate the column with the specified number of grid cells
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        // Create a new grid cell
        const gridCell = createGridCell();

        // Add a class to identify the row
        gridCell.classList.add(`column-${columnIndex}`, `row-${rowIndex+1}`);

        // Append the grid cell to the column
        column.appendChild(gridCell);
    }

    // Return the completed column
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


// Resizes cells based on current grid dimensions
function setCellDimensions(rows, columns) {
    // Get all grid cells and current content width
    const gridCells = getElements('.grid-cell');
    const gridContentWidth = gridContent.clientWidth; 
    
    // Calculate exact cell width with decimal precision
    const gridCellWidth = Math.round(Math.round((gridContentWidth / columns) * 100) / 100);
     // Keep cells square by matching height to width
    const gridCellHeight = gridCellWidth;

    // Scale container width/height to fit all columns/rows, plus padding
    sketchContainer.style.width = (columns * gridCellWidth) + 20;
    sketchContainer.style.height = (rows * gridCellWidth) + 20;
 
    // Apply dimensions to all grid cells
    gridCells.forEach((gridCell) => {
        gridCell.style.width = gridCellWidth;
        gridCell.style.height = gridCellHeight;
    });
}

// ========================
// 2. Row/Column Controls
// ========================

// Returns total count of rows by checking last column's row index
function getRowCount() {
    // Get all column elements from DOM
    const columnElements = getElements('.column');
    
    // Extract the last column 
    const lastColumnElement = columnElements.pop();
    // Get its last child row
    const lastRowElement = Array.from(lastColumnElement.children).pop();
    
    // Convert row element to index number
    const rowCount = getRowIndex(lastRowElement);

    // Return total number of rows
    return rowCount;
}
 
// Returns total number of columns by counting column elements
function getColumnCount() {
    // Get count of column elements and convert to number
    const columnCount = parseInt(getElements('.column').length);
 
    // Return total number of columns
    return columnCount;
 }

// Adjusts the number of rows in the grid based on the new row count
function updateRows(newRowCount, currentRowCount) {
    // Get all column elements
    const columns = getElements('.column');

    // Parse new column count
    const newColumnCount = parseInt(columnInput.value);

    // Process row count difference
    if (newRowCount >= currentRowCount) {
        // Add new rows for the calculated difference
        for (let rowIndex = currentRowCount + 1; rowIndex < newRowCount + 1; rowIndex++) {
            // Add a new grid cell to each column
            columns.forEach((column, columnIndex) => {

                // Create new grid cell element
                const gridCell = createGridCell();
                
                // Add class to grid cell for the updated row count
                gridCell.classList.add(`column-${columnIndex+1}`, `row-${rowIndex}`);
                
                // Append grid cell to column
                column.appendChild(gridCell);
            }); 
        }

        // Update button states for row controls
        updateButtonState(newRowCount, 64, addRowButton, removeRowButton);
    }

    else {
        // Add new rows for the calculated difference
        for (let rowIndex = currentRowCount; rowIndex > newRowCount; rowIndex--) {
            // Add a new grid cell to each column
            columns.forEach((column) => {
                column.lastElementChild.remove();
            }); 
        }

        // Update row control buttons states
        updateButtonState(newRowCount, 1, removeRowButton, addRowButton);
    }

    // Set cell dimensions based on the updated row count
    setCellDimensions(newRowCount, newColumnCount);

    // Update max brush size
    updateMaxBrushSize();
}

// Updates grid rows based on new input value
function handleRowInput(event) {
    // Current row count before input change
    const currentRowCount = getRowCount();
 
    // Clamp new row count between 1 and 64 based on input value
    const newRowCount = clampValue(1, parseInt(event.target.value), 64);

    // Update row input value with clamped value
    rowInput.value = newRowCount;

    // Get current column count
    const currentColumnCount = getColumnCount();

    // Modify grid rows based on updated values
    updateRows(newRowCount, currentRowCount);

    // Return previous dimension state data [rows, cols]
    return [currentRowCount, currentColumnCount];
}

// Adjusts the number of columns in the grid based on the new column count
function updateColumns(newColumnCount, currentColumnCount, currentRowCount) {
    // Process column count difference
    if (newColumnCount >= currentColumnCount) {
        // Add new rows for the calculated difference
        for (let columnIndex = currentColumnCount + 1; columnIndex < newColumnCount + 1; columnIndex++) {
            // Create a new column for the specified index and row count
            const column = createColumn(columnIndex, currentRowCount);
            
            // Append the new column to the grid content
            gridContent.appendChild(column);
        }
        
        // Update column control buttons states
        updateButtonState(newColumnCount, 64, addColumnButton, removeColumnButton);
    }

    else {
        // Add new rows for the calculated difference
        for (let columnIndex = currentColumnCount; columnIndex > newColumnCount; columnIndex--) {
            // Get all column elements
            const columns = getElements('.column');

            // Remove the last column
            columns[columns.length - 1].remove();
        } 
        
        // Update column control buttons states
        updateButtonState(newColumnCount, 1, removeColumnButton, addColumnButton);
    }

    // Set cell dimensions based on the updated row count
    setCellDimensions(currentRowCount, newColumnCount);

    // Update max brush size
    updateMaxBrushSize();
}

// Updates grid columns based on new input value
function handleColumnInput(event) {
    // Current row count before input change
    const currentColumnCount = getColumnCount();
    
    // Clamp new column count between 1 and 64 based on input value
    const newColumnCount = clampValue(1, parseInt(event.target.value), 64);

    // Update column input value with clamped value
    columnInput.value = newColumnCount;

    // Get all column elements
    const currentRowCount = getRowCount();
    
    updateColumns(newColumnCount, currentColumnCount, currentRowCount);

    // Return previous dimension state data [rows, cols]
    return [currentRowCount, currentColumnCount];
}

// Handles dimension input changes and triggers updates
function handleGridDimensionInput(dimensionInput, callbackFunction) {
    // Listen for input changes
    dimensionInput.addEventListener('input', (event) => {
        // Listen for the 'Enter' key press once
        dimensionInput.addEventListener('keydown', (keyEvent) => {
            // If 'Enter' is pressed
            if (keyEvent.key === 'Enter') {
                // Blur the input
                dimensionInput.blur();
                
                // Call the update function
                const [prevRowCount, prevColumnCount] = callbackFunction(event);

                // Record the state change for undo/redo
                recordStateChange(prevRowCount, prevColumnCount);
            }
        }, { once: true }); // Ensure the event listener is executed only once
    });
}

// Add a row to the grid
function addRow() {
    // Get target row count from input
    const currentRowCount = getRowCount();
    
    // Clamp the row count between 1 and 64
    const updatedRowCount = clampValue(1, currentRowCount + 1, 64);
    
    // Update row input with the clamped row count
    rowInput.value = updatedRowCount;
    
    // Get all column elements
    const columns = getElements('.column');

    // Get current number of columns
    const currentColumnCount = getColumnCount();

    // Add a new grid cell to each column
    columns.forEach((column, columnIndex) => {
        const gridCell = createGridCell();
        
        // Add class to grid cell for the updated row count in each column
        gridCell.classList.add(`column-${columnIndex+1}`, `row-${updatedRowCount}`);
        
        // Append grid cell to column
        column.appendChild(gridCell);
    });

    // Set cell dimensions based on the updated row count
    setCellDimensions(updatedRowCount, currentColumnCount);
    
    // Update button states for row controls
    updateButtonState(updatedRowCount, 64, addRowButton, removeRowButton);
    
    // Update max brush size
    updateMaxBrushSize();

    // Return previous dimension state data [rows, cols]
    return [currentRowCount, currentColumnCount];
}

// Remove the last row from the grid
function removeRow() {
    // Get the current number of rows
    const currentRowCount = getRowCount();
    
    // Decrement row count and clamp to the range 1-64
    const updatedRowCount = clampValue(1, currentRowCount - 1, 64); 
    
    // Update the row input with the new row count
    rowInput.value = updatedRowCount;
    
    // Get all column elements
    const columns = getElements('.column');

    // Get current number of columns
    const currentColumnCount = getColumnCount();

    // Remove the last cell from each column
    columns.forEach((column) => {
        column.lastElementChild.remove();
    });
     
    // Adjust cell dimensions after removing a row
    setCellDimensions(updatedRowCount, currentColumnCount);
    
    // Update row control buttons states
    updateButtonState(updatedRowCount, 1, removeRowButton, addRowButton);
    
    // Update the max brush size
    updateMaxBrushSize();

    // Return previous dimension state data [rows, cols]
    return [currentRowCount , currentColumnCount];
}

// Add a column to the grid
function addColumn() {
    // Get the current number of rows
    const currentRowCount = getRowCount();
    
    // Get the current number of columns
    const currentColumnCount = getColumnCount();
    
    // Increment column count and clamp to the range 1-64
    const updatedColumnCount = clampValue(1, currentColumnCount + 1, 64); 
    
    // Update the column input with the new column count
    columnInput.value = updatedColumnCount;
    
    // Create new column
    const column = createColumn(updatedColumnCount, currentRowCount)

    // Append a new column with grid cells
    gridContent.appendChild(column);

    
    // Adjust cell dimensions after adding a column
    setCellDimensions(currentRowCount, updatedColumnCount);
    
    // Update column control buttons states
    updateButtonState(updatedColumnCount, 64, addColumnButton, removeColumnButton);
    
    // Update the max brush size
    updateMaxBrushSize();

    // Return previous dimension state data [rows, cols]
    return [currentRowCount, currentColumnCount];
}

// Remove the last column from the grid
function removeColumn() {
    // Get the current number of columns
    const currentColumnCount = getColumnCount();

    // Get the current number of rows
    const currentRowCount = getRowCount();
    
    // Decrement column count and clamp to the range 1-64
    const updatedColumnCount = clampValue(1, currentColumnCount - 1, 64); 
    
    // Update the column input with the new column count
    columnInput.value = updatedColumnCount;
    
    // Get all column elements and remove the last one
    const columns = getElements('.column');
    columns[currentColumnCount - 1].remove();
    
    // Adjust cell dimensions after removing a column
    setCellDimensions(currentRowCount, updatedColumnCount);
    
    // Update column control buttons states
    updateButtonState(updatedColumnCount, 1, removeColumnButton, addColumnButton);

    // Update the max brush size
    updateMaxBrushSize();

    // Return previous dimension state data [rows, cols]
    return [currentRowCount, currentColumnCount];
}

// Generalized setup for button event listeners
function setupButtonListeners(addButton, addAction, removeButton, removeAction) {
    // Set up event listener for the "remove" button click
    removeButton.addEventListener('click', () => {
        // Get current and updated counts after removal
        const [prevRowCount, prevColumnCount] = removeAction();
        
        // Record the state change for undo/redo
        recordStateChange(prevRowCount, prevColumnCount);
    });

    // Set up event listener for the "add" button click
    addButton.addEventListener('click', () => {
        // Get current and updated counts after addition
        const [prevRowCount, prevColumnCount] = addAction();
        
        // Record the state change for undo/redo
        recordStateChange(prevRowCount, prevColumnCount);
    });    
}

// =========================
// 3. Undo/Redo Functions
// =========================

// Records grid state changes for undo/redo operations
function recordStateChange(prevRowState, prevColState) {
    // Packages previous dimensions into state snapshot
    const stateChange = [prevRowState, prevColState];
 
    // Adds state to undo history
    undoStack.push(stateChange);
 
    // Logs undo stack for debugging
    console.table(undoStack);
}

// Restores modified cells when columns or rows are added
function restoreModifiedCells(startIndex, endIndex) {
    console.log('Is Column?:', isColumn);
    // Tracks color states of cells that need restoration
    const cellsToRestore = [];

    // Loop over added columns/rows to find modified cells
    for (let index = startIndex + 1; index <= endIndex; index++) {
        // Check each action in undoStack for matching index
        for (const actionState of undoStack) {
            // Extract the column/row index of the affected cells
            const cellIndex = isColumn ? actionState[2] : actionState[3];
            
            // Add matching cell to restore list
            if (cellIndex === index) {
                cellsToRestore.push(actionState); 
            }
        }
    }

    // Apply saved colors to target cells
    for (const actionState of cellsToRestore) {
        // Extract color data
        const [appliedColor, columnIndex, rowIndex] = [actionState[1], actionState[2], actionState[3]]; 

        console.log('Column Index:', columnIndex);
        console.log('Row Index:', rowIndex);

        // Find target cell
        const targetCell = document.querySelector(`.column-${columnIndex}.row-${rowIndex}`);

        // Skip if cell doesn't exist
        if (targetCell == null) {
            continue; 
        } 
       
        // Restore original color
        else {
            targetCell.style.backgroundColor = appliedColor; 
        }
    }

    // Clear the restoration list
    cellsToRestore.length = 0;
}

// Handles transitioning between grid states for undo/redo
function handleGridResizeUndoRedo(activeStack, inactiveStack) {
    // Guards against empty stack operations
    if (activeStack.length === 0) return;

    // Captures current grid dimensions
    const currentDimensions = [getRowCount(), getColumnCount()];
    // Retrieves previous state from history
    const previousDimensions = activeStack.pop();

    // Destructures current grid size
    const [currentRows, currentCols] = currentDimensions;
    // Destructures previous grid size 
    const [previousRows, previousCols] = previousDimensions;

    // Sets target dimensions for transition
    const [newRows, newCols] = [previousRows, previousCols];

    // Updates dimension inputs in UI
    [rowInput.value, columnInput.value] = [newRows, newCols];

    // Stores current state in opposite stack
    inactiveStack.push(currentDimensions);

    // Updates row count if changed
    if (newRows != currentRows) {
        updateRows(newRows, currentRows);

        // Restores cells only if rows were added
        if (currentRows < newRows) {
            isColumn = false;
            restoreModifiedCells(currentRows, newRows);
        }
    }

    // Updates column count if changed
    if (newCols != currentCols) {
        updateColumns(newCols, currentCols, currentRows);

        // Restores cells only if columns were added
        if (currentCols < newCols) {
            isColumn = true;
            restoreModifiedCells(currentCols, newCols);
        }
    }
}

// Reverts/Restores last brush stroke
function handleBrushStrokeUndoRedo(activeStack, inactiveStack) {
    // Guards against empty stack operations
    if (activeStack.length === 0) return;
 
    // Calculates total cells affected by brush size
    const brushRadius = activeStack[activeStack.length - 1][4]; 
    const affectedCellCount = Math.round(Math.pow(brushRadius, 2));
 
    // Processes each cell in the brush's affected area
    for (let iteration = 1; iteration <= affectedCellCount; iteration++) {
        // Extract color (HEX) and position data from history record
        const actionState = activeStack.pop();
        const [originalColor, appliedColor, col, row, radius] = actionState;
        
        // Preserves state for potential redo and updates cell display
        inactiveStack.push(actionState);

        // Map coordinates to target cell and revert its color
        const targetCell = document.querySelector(`.column-${col}.row-${row}`);

        // Revert to original color for undo
        if (isUndo) {
            targetCell.style.backgroundColor = originalColor;   
        }

        // Restore applied color for redo
        else {
            targetCell.style.backgroundColor = appliedColor;  
        }

    }
 
    // Debug view of redo stack
    console.table(inactiveStack);
}

// Handles undo/redo based on grid state or brush stroke
function handleUndoRedo(activeStack, inactiveStack) {
    // Guards against empty stack operations
    if (activeStack.length === 0) return;

    // Get the most recent state from the stack
    const currentState = activeStack[activeStack.length - 1];

    // Check if the state corresponds to a grid resize (2 elements in state)
    if (currentState.length == 2) {
        handleGridResizeUndoRedo(activeStack,inactiveStack);
    }

    // Handle brush stroke actions (state with more than 2 elements)
    else {
        handleBrushStrokeUndoRedo(activeStack, inactiveStack);
    }
}

// Trigger undo operation and process color history
undoButton.addEventListener('click', () => {
    // Set flag to indicate undo action
    isUndo = true;

    // Call handler to process undo using color history stacks
    handleUndoRedo(undoStack, redoStack);
});

// Trigger redo operation and process redo history
redoButton.addEventListener('click', () => {
    // Set flag to indicate redo action
    isUndo = false;

    // Call handler to process redo using redo history stacks
    handleUndoRedo(redoStack, undoStack);
});
 
// =============================
// 4. Core Editor Tool Functions
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
        activeTool.classList.remove(activeToolClass); 
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

    // Marks the matching swatch, if in present palette
    markActiveSwatch();
}

// Retrieves adjacent cells to the selected cell in the grid
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
    
    // If source color doesn't match target, add to stack
    else { 
        console.log('Source Color is Not Target Color'); 
        stack.push(sourceElement);
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
                } 
                
                else {
                    continue;
                }
            }

        }  
    }

    // Process each visited cell to update color and track changes
    for (const gridCell of visitedElements) {
        // Get the cell's current
        const originalCellColor = gridCell.style.backgroundColor;

        // Parse the color into red, green, blue, and alpha components
        const [red, green, blue, alpha] = parseColor(originalCellColor);

        // Convert the RGBA values to a hexadecimal color
        const originalHexColor = rgbAToHexA(red, green, blue, alpha);

        // Get cell position in grid
        const columnIndex = getColumnIndex(gridCell);
        const rowIndex = getRowIndex(gridCell);

        // Change the cell color to selected
        gridCell.style.backgroundColor = color;
        
        // Get updated background color
        const newCellColor = gridCell.style.backgroundColor;

        // Parse updated color to RGBA
        const [cellRed, cellGreen, cellBlue, cellAlpha] = parseColor(newCellColor);

        // Convert updated color to hex
        const newHexColor = rgbAToHexA(cellRed, cellGreen, cellBlue, cellAlpha);

        // Use square root to estimate the spread radius of the flood fill
        const searchRadius = Math.round(Math.sqrt(visitedElements.length) * 100) / 100;

        // Bundle color, position and brush size data for history tracking
        const gridCellData = [originalHexColor, newHexColor, columnIndex, rowIndex, searchRadius];

        // Track cell state for undo/redo functionality
        undoStack.push(gridCellData);
    }

    // Log to console
    console.table(undoStack);

}

// Function to handle flood fill on an event
function floodFill(event) {
    // Get the source element from the event target
    const sourceElement = event.target;
    
    // Call depthFirstSearch on the source element
    depthFirstSearch(sourceElement);
}

// =========================
// 5. Editor Tool Handlers
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
    // Set the cursor style to 'cell'
    gridContent.style.cursor = 'cell';   

    // Set title for brush size
    brushSizeTitle.textContent = 'Brush Size';

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

        // Set title to 'Strength' for eraser intensity control
        brushSizeTitle.textContent = 'Strength';

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
function handleGridLines() {
    // Get all elements with the class 'grid'
    const gridCells = getElements('.grid-cell');

    // If grid lines are currently visible
    if (showGridLines) {
        // Iterate over each grid element
        gridCells.forEach((gridCell) => {
            // Remove the outlines from each grid cell element
            gridCell.style.outline = 'none';
        });

        // Hide grid lines
        showGridLines = false;
    }

    else {
        // Iterate over each grid element
        gridCells.forEach((gridCell) => {
            // Adjust outline for visibility based on theme  
            if (darkMode) {
                // Light outline for contrast 
                gridCell.style.outline = lightOutline;
            }

            else {
                // Dark outline for subtlety  
                gridCell.style.outline = darkOutline;
            }
        });

        // Show grid lines
        showGridLines = true;
    }  
}

// Function to toggle grid line mode between dark and light
function handleGridLineMode() {
    // Get all elements with the class 'grid'
    const gridCells = getElements('.grid-cell');

    if (darkMode) {
        // Iterate over each grid element
        gridCells.forEach((gridCell) => {
            const gridColor = gridCell.style.backgroundColor;

            if (showGridLines) {
                // Set grid outline to dark mode
                gridCell.style.outline = darkOutline;
            }

            // Change grid background from dark to light
            if (gridColor == darkGridColor) {
                gridCell.style.backgroundColor = lightGridColor;
            }
        });

        // Set dark mode to false after changing colors
        darkMode = false;
    }

    else {
        // Iterate over each grid element
        gridCells.forEach((gridCell) => {
            const gridColor = gridCell.style.backgroundColor;

            if (showGridLines) {
                // Set grid outline to light mode
                gridCell.style.outline = lightOutline;
            }

            // Change grid background from light to dark
            if (gridColor == lightGridColor) {
                gridCell.style.backgroundColor = darkGridColor; 
            }
        });

        // Set dark mode to true after changing colors
        darkMode = true;
    }
}

// Handles mouse actions for selecting editor tools
function handleDrawingTools(event) {

    // Deselect the current active tool
    const activeDrawingClass = 'active-drawing-tool'; 
    const activeTool = getActiveTool(drawingTools, activeDrawingClass);
    
    // Get the selected tool element
    const selectedTool = event.target;
    
    // Check if the selected tool is a grid tool or doesn't have the 'tool-icon' class
    if (
        selectedTool.classList.contains('grid-tools') || 
        selectedTool.parentElement.classList.contains('grid-tools') ||
        selectedTool.parentElement.classList.contains('zoom-tools') || 
        selectedTool.parentElement.classList.contains('save-tool') ||  
        selectedTool.parentElement.parentElement.classList.contains('grid-tools') ||
        selectedTool.parentElement.parentElement.classList.contains('zoom-tools') ||
        selectedTool.parentElement.parentElement.classList.contains('save-tool') ||  
        !selectedTool.classList.contains('tool-icon')
    ) {
        return; // Exit function if any condition is true
    }

    // Detach the active tool
    detachActiveTool(activeTool, activeDrawingClass);

    // Clear current tool bindings
    unbindDrawingTools(); 
    
    // Reset eraser state if the selected tool is not the eraser
    if (selectedTool.id != "eraser-tool") {
        isEraserActive = false;
    }

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

// Handle grid tool selection and activation
function handleGridTools(event) {
    // Define active class and get currently active tool
    const activeGridToolClass = 'active-grid-tool'; 
    const activeTool = getActiveTool(gridTools, activeGridToolClass);

    // Get the selected tool element
    const selectedTool = event.target;

    // Check if the selected tool has the 'tool-icon' class
    if (!selectedTool.classList.contains('tool-icon')) {
        return; // Exit function if the tool doesn't have the class
    }

    // If there's an active tool, remove its active class
    if (activeTool != null && activeTool == selectedTool) {
        detachActiveTool(activeTool, activeGridToolClass);
    }

    // If selected tool is not the currently active one
    if (selectedTool.parentElement != activeTool) {
        
        // Handle specific tool activation and update icon
        switch (selectedTool.id) {
            // Toggle grid light mode
            case "grid-line-shade-tool": 
                selectedTool.src = 'assets/icons/light-mode-white.png';
                handleGridLineMode();
                break;
            // Toggle grid lines off
            case "grid-lines-tool":
                selectedTool.src = 'assets/icons/grid-off-white.png';
                handleGridLines();  
                break;
            default:
                break;
        }

        // Mark the selected tool as active
        selectedTool.parentElement.classList.add('active-grid-tool'); 
    }
    // If the selected tool is already active, deactivate it
    else {
        switch (selectedTool.id) {
            // Toggle dark mode grid
            case "grid-line-shade-tool": 
                selectedTool.src = 'assets/icons/dark-mode-white.png';
                handleGridLineMode();
                break;
            // Toggle grid lines on
            case "grid-lines-tool":
                selectedTool.src = 'assets/icons/grid-on-white.png';
                handleGridLines(); 
                break;
            default:
                break;
        }

        // Remove active class from selected tool
        selectedTool.parentElement.classList.remove('active-grid-tool'); 
    }
}

// Handle zoom interactions based on the triggered event
function handleZoom(event) {
    // Identify the tool that triggered the event
    const zoomTool = event.target;

    // Proceed if the interaction involves a zoom control tool
    if (zoomTool.id == 'zoom-in-tool' || zoomTool.id == 'zoom-out-tool') {
        // Extract the current zoom level of the sketch container
        let zoomLevel = parseFloat(getComputedStyle(sketchContainer).zoom);
    
        // Define the incremental zoom factor
        const zoomFactor = 0.05;
    
        // Calculate the new zoom level based on the tool used (zoom in or zoom out)
        const updatedZoom = 
        zoomTool.id === 'zoom-in-tool' 
            ? zoomLevel + zoomFactor 
            : zoomTool.id === 'zoom-out-tool' 
            ? zoomLevel - zoomFactor 
            : zoomLevel;
    
        // Restrict zoom to 0.5-1.65, rounded to 2 decimal places
        zoomLevel = sketchContainer.style.zoom = clampValue(0.5, parseFloat(updatedZoom), 1.65, 2);
    
        // Toggle boundary state at zoom thresholds
        if (zoomLevel === 1.65 || zoomLevel === 0.5) {
            zoomTool.parentElement.classList.add('zoom-threshold');
        } 
        
        // Clear threshold indicator state
        else {
            // Query existing threshold element if present
            const thresholdElement = document.querySelector('.zoom-threshold');

            console.log('Threshold Element:', thresholdElement);

            // Remove threshold class if element exists
            if (thresholdElement !== null) {
                thresholdElement.classList.remove('zoom-threshold');
            }
        }
    }
}

// Triggers image save when save button is clicked
function handleSaveTool() {
    // Export current sketch as image
    saveImage();
}

// Listen for clicks on drawing tools and handle them
drawingTools.addEventListener('click', handleDrawingTools, true);

// Listen for clicks on grid tools and handle them
gridTools.addEventListener('click', handleGridTools, true);

// Listen for clicks on zoom tools and handle them
zoomTools.addEventListener('click', handleZoom, true);

// Listen for clicks on save button and handle it
saveButton.addEventListener('click', handleSaveTool, true);

// ================================
// 6. Editor Tool Event Management
// ================================

// Unbinds drawing tool event listeners
function unbindDrawingTools() {
    // Remove brush preview event listener 
    gridContent.removeEventListener('mouseover', previewBrush);

    // Remove flood fill tool listener
    gridContent.removeEventListener('mousedown', floodFill);

    // Remove color picker tool listener
    gridContent.removeEventListener('mousedown', setPickerColor);

    // Remove brush size listener
    gridContent.removeEventListener('mousedown', handleBrushStroke);
}

// =======================
// 7. Grid Coloring Logic
// =======================

// Function to update opacity value
function updateAlphaValue(event) {
    // Get the current alpha value
    const currentAlpha = parseFloat(alphaInput.value);

    // Get the alpha value from the input
    const alpha = isNaN(currentAlpha) ? currentAlpha : event.target.value;
    
    // Sync all color-related input values and update display
    syncColorValues(alpha);
}

// Sync color values and update display
function syncColorValues(alpha) {
    // Sync slider and input values
    alphaInput.value = alphaSlider.value = alpha;

    // Extract RGB values from the current color
    const [red, green, blue] = parseColor(color);   

    // Update hex input with RGB values and alpha
    hexInput.value = rgbAToHexA(red, green, blue, alpha);

    // Update selected color
    updateColor(red, green, blue, alpha);
}

// Function to update grid color
function updateGridColor() {
    // Add a hover effect to preview the brush
    gridContent.addEventListener('mouseover', previewBrush);

    // Enable coloring on mouse down and drag
    gridContent.addEventListener('mousedown', handleBrushStroke);
    
    // Disable coloring on mouse up
    document.addEventListener('mouseup', () => {
    isMouseDown = false;
    });
}


// Updates the maximum allowed brush size based on row and column input.
function updateMaxBrushSize() { 
    // Get grid dimensions
    const rowCount = getRowCount();
    const columnCount = getColumnCount();

    // Get the larger value from row and column inputs.
    const maxBrushSize = Math.max(rowCount, columnCount);

    // Set slider minimum to 1 unless maxBrushSize is 1.
    brushSizeSlider.min = 1;

    // Update slider and input maximums.
    brushSizeSlider.max = maxBrushSize;
    brushSizeInput.max = maxBrushSize;

    // Sync slider and input minimums.
    brushSizeInput.min = brushSizeSlider.min;
}

// Updates the brush size based on user input and logs the value.
function updateBrushSize(event) {    
    // Get min/max size limits from input attributes
    const minBrushSize = parseInt(brushSizeInput.min);
    const maxBrushSize = parseInt(brushSizeInput.max);

    // Parse the input value from the slider or number input
    const inputValue = parseInt(event.target.value);

    // Parse the brush size from the input value.
    const brushSize = clampValue(minBrushSize, inputValue, maxBrushSize);

    // Skip update if invalid input
    if (isNaN(inputValue)) {
       return;
    }

    // Otherwise sync both input values
    else {
        brushSizeInput.value = brushSizeSlider.value = brushSize;
    }
}

// Function to get the brush size from the slider
function getBrushSize() {
    // Parse the value of the input as an integer
    const brushSize = parseInt(brushSizeInput.value);

    // Return the parsed brush size
    return brushSize;
}

// Get the adjacent ells based on spread radius
function getBrushBounds(gridCell) {
    // Get grid dimensions
    const rowCount = getRowCount();
    const columnCount = getColumnCount();

    // Get brush properties from current selection
    const brushSize = getBrushSize();
    const currentColumnIndex = getColumnIndex(gridCell);
    const currentRowIndex = getRowIndex(gridCell);
    
    // Calculate brush radius (cells from center to edge)
    const brushRadius = Math.floor(brushSize / 2);

    // Calculate brush boundaries using radius 
    let startColumnIndex = currentColumnIndex - brushRadius;
    let startRowIndex = currentRowIndex - brushRadius;
    let endColumnIndex = currentColumnIndex + brushRadius;
    let endRowIndex = currentRowIndex + brushRadius;

    // Adjust starting position for even brush size
    if (brushSize % 2 == 0) { 
        startColumnIndex += 1;
        startRowIndex += 1;
    }

    // Adjust end column index if it exceeds grid boundaries
    if (endColumnIndex > columnCount) {
        const columnShift = endColumnIndex - columnCount;
        endColumnIndex = columnCount;
        startColumnIndex -= columnShift;
    }

    // Adjust end row index if it exceeds grid boundaries
    if (endRowIndex > rowCount) {
        const rowShift = endRowIndex - rowCount;
        endRowIndex = rowCount;
        startRowIndex -= rowShift;
    }

    // Adjust start column index if it goes below grid boundaries
    if (startColumnIndex <= 0) {
        const columnShift = startColumnIndex - 1;
        endColumnIndex += Math.abs(columnShift);
        startColumnIndex = 1;
    }

    // Adjust start row index if it goes below grid boundaries
    if (startRowIndex <= 0) {
        const rowShift = startRowIndex - 1;
        endRowIndex += Math.abs(rowShift);
        startRowIndex = 1;
    }

    // Returns brush bounds adjusted to grid size
    return [startColumnIndex, startRowIndex, endColumnIndex, endRowIndex];
}

// Gets all grid cells within the specified brush boundaries
function getBrushCells(startColumn, startRow, endColumn, endRow) {
    // Initialize array to store cells in brush area
    const brushCells = [];

    // Iterate through each column in bounds
    for (let columnIndex = startColumn; columnIndex <= endColumn; columnIndex++) {
       // Get DOM element for current column
        const column = gridContent.querySelector(`.column-${columnIndex}`);

        // Check each row in current column
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            // Convert row index to zero-based for DOM access
            const row = column.children[rowIndex - 1];
            
            // Skip if row doesn't exist
            if (row === undefined) {
                continue;
            }

            // Add valid cell to collection
            brushCells.push(row);
        }  
    }

    // Return all cells in brush area
    return brushCells;
}

// Gets brush effect data: affected cells and color states
function getBrushColorData(gridCell) {
    // Get the brush boundaries and affected cells
    const [brushStartCol, brushStartRow, brushEndCol, brushEndRow] = getBrushBounds(gridCell);
    const previewCells = getBrushCells(brushStartCol, brushStartRow, brushEndCol, brushEndRow);

    // Arrays to store original and new hex colors
    const originalHexColors = [];
    const newHexColors = [];

    // Loop through each cell in the preview
    for (const previewCell of previewCells) {
        // Get the cell's background color
        const originalCellColor = previewCell.style.backgroundColor;

        // Parse the color into red, green, blue, and alpha components
        const [red, green, blue, alpha] = parseColor(originalCellColor);

        // Convert the RGBA values to a hexadecimal color
        const originalHexColor = rgbAToHexA(red, green, blue, alpha);

        // Save the original color of the cell
        originalHexColors.push(originalHexColor);

        // Change cell color to selected
        previewCell.style.backgroundColor = color;
        
        // Get updated background color
        const newCellColor = previewCell.style.backgroundColor;

        // Parse updated color to RGBA
        const [cellRed, cellGreen, cellBlue, cellAlpha] = parseColor(newCellColor);

        // Convert updated color to hex
        const newHexColor = rgbAToHexA(cellRed, cellGreen, cellBlue, cellAlpha);

        // Store new hex color
        newHexColors.push(newHexColor);
    
    }

    // Check mouse state every 5ms and track color changes for undo/redo
    previewInterval = setInterval(() => {
        previewCells.forEach((previewCell, cellIndex) => {
            // If mouse is clicked, store grid details for undo/redo
            if (isMouseDown || isGridClicked) {
                // Stop interval after applying color change
                clearInterval(previewInterval);
                
                // Get cell position in grid
                const columnIndex = getColumnIndex(previewCell);
                const rowIndex = getRowIndex(previewCell);
                
                // Retrieve the original and updated hex colors for the current cell
                const originalHexColor = originalHexColors[cellIndex];
                const newHexColor = newHexColors[cellIndex];

                // Get the brush size for color application
                const brushSize = getBrushSize();
                
                // Bundle color, position and brush size data for history tracking
                const gridCellData = [originalHexColor, newHexColor, columnIndex, rowIndex, brushSize];
                
                // Only add to history if colors actually changed
                if (originalHexColor !== newHexColor) {
                    // Add to color history array and log for debugging
                    undoStack.push(gridCellData);
                    console.table(undoStack);
                }
            }
        });
    }, 5);


    // Return brush color data
    return [previewCells, originalHexColors, newHexColors];
}

// Handle live brush preview and color application logic
function previewBrush(event) {
    // Reset existing preview interval at start of new brush hover
    clearInterval(previewInterval);

    // Check if the eraser tool is currently active
    if (isEraserActive) {
        if (darkMode) {
            // Set eraser color for dark mode (dark background)
            color = 'rgba(0, 0, 0, 0.85)';
        }
        else {
            // Set eraser color for light mode (light background)
            color = 'rgba(240, 248, 255, 1)';   
        }
    }

    // Store the currently hovered grid cell
    const currentCell = event.target;

    // Get cells to update + their original/preview colors
    const [previewCells, originalHexColors, previewHexColors] = getBrushColorData(currentCell);

    // Do nothing further if the mouse is already pressed
    if (isMouseDown) {
        return;
    }

    // Restore the cell's original color on mouse out
    gridContent.addEventListener('mouseout', () => {

        // Only restore if mouse isn't pressed or grid clicked
        if (!isMouseDown && !isGridClicked) {
            // Loop through each cell in the preview
            for (let cellIndex = 0; cellIndex < previewCells.length; cellIndex++) {
                // Get the preview cell at the current index
                const previewCell = previewCells[cellIndex];

                // Get the original color of the cell before the preview
                const originalColor = originalHexColors[cellIndex];

                // Get the new color of the cell after the preview
                const previewColor = previewHexColors[cellIndex];

                // Extract RGBA values from background color
                const [redHex, greenHex, blueHex, alphaHex] = parseColor(hexInput.style.backgroundColor);

                // Convert RGBA to hex color
                const hexColor = rgbAToHexA(redHex, greenHex, blueHex, alphaHex);

                // If eraser not active, only revert if preview matches selected color
                if (!isEraserActive) {
                    // Revert to original if new color matches selected
                    if (previewColor === hexColor) {
                        previewCell.style.backgroundColor = originalColor;
                    } 
                }

                // If eraser active, always revert to original color
                else {
                    previewCell.style.backgroundColor = originalColor;
                }

            }
        }
    }, { once: true });
}

// Function to apply a specific color to a grid cell
function handleBrushStroke(event) {
    // Prevent the default event behavior (e.g., preventing text selection)
    event.preventDefault();

    // Prune redo history as a new brush stroke begins
    redoStack.length = 0;

    // Flag indicating the mouse button is pressed
    isMouseDown = true;

    // Flag indicating that the grid has been clicked
    isGridClicked = true;

    // Event listener to reset isGridClicked when the mouse leaves the grid
    gridContent.addEventListener('mouseout', () => {
        isGridClicked = false;
    }, { once: true });
}

// Listens for changes to the brush size slider
brushSizeSlider.addEventListener('input', updateBrushSize);

// Listens for changes to the brush size input
brushSizeInput.addEventListener('input', updateBrushSize);

// =======================
// 8. Canvas Setup
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
// 9. Update Pointer Position
// ===========================

function updatePointerPosition() {
    // Get the current hue value from the input as an integer.
    const currentHue = parseInt(hueInput.value);

    // Determine the hue: calculate from RGB values if input is invalid, otherwise use the input hue.
    const hue = isNaN(currentHue) 
                ? rgbAToHslA(redInput.value, greenInput.value, blueInput.value)[0] 
                : currentHue;

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
    updateColorCanvas(hue);
    
    //Update hue, saturation and lightness input fields
    [hueInput.value, saturationInput.value, lightnessInput.value] = [hue, saturation, lightness]; 
}

// ==========================
// 10. Update Slider Position
// ==========================

function updateSliderPosition() {
    // Get HSL values and calculate the X position on the hue slider.
    const [hue, saturation, lightness] = [hueInput.value, saturationInput.value, lightnessInput.value];
    const x = (hue/360) * hueSlider.width;

    // Clamp X to slider bounds, update thumb position, and log values.
    const sliderOffset = clampValue(0, x, hueSlider.width);
    sliderThumb.style.left = `${sliderOffset}px`;

    // Convert HSL to HSV and extract components
    const [hueAngle, saturationHsv, value] = hslToHsv(hue, saturation, lightness);
    
    // Calculate the horizontal position of the drag pointer on the canvas
    const leftOffset = `${Math.round(((saturationHsv/100) * colorCanvas.width) - dragPointer.offsetWidth / 2)}px`;
    
    // Calculate the vertical position of the drag pointer on the canvas
    const topOffset = `${Math.round(((((100 - value)/100) * colorCanvas.height) - dragPointer.offsetWidth / 2))}px`;

    // Position the drag pointer based on calculated offsets
    dragPointer.style.transformOrigin = `top left`;
    dragPointer.style.transform = `translate(${leftOffset}, ${topOffset})`;

    // Convert HSL to RGB with full saturation and lightness, then update the color canvas.
    baseShade = hslAToRgbA(hueInput.value, 100, 50);
    updateColorCanvas(hueAngle);
    
    // Calculate the RGB values based on the current hue, saturation, and lightness
    [redInput.value, greenInput.value, blueInput.value] = hslAToRgbA(hueInput.value, saturationInput.value, lightnessInput.value);
    hexInput.value = rgbAToHexA(redInput.value, greenInput.value, blueInput.value, alphaSlider.value); 
}

// =====================
// 11. Update Hex Color
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
        updateColorCanvas(hueAngle);

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
// 12. Listen on RGB Input
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

// ============================
// 13. Color Palette Functions
// ============================

// Function to get the current active color swatch
function getCurrentColorSwatch() {
    // Selects the element with ID 'active-swatch' (current color swatch)
    const currentColorSwatch = document.querySelector('#active-swatch');

    // Returns the selected color swatch element
    return currentColorSwatch;
}

// Function to update the active swatch color based on user selection
function setSwatchColor(event) {
    // Get the currently active color swatch
    const currentColorSwatch = getCurrentColorSwatch();
    
    // Get the clicked color swatch from the event target
    const colorSwatch = event.target;

    // Check if the clicked element is a color swatch
    const isColorSwatch = colorSwatch.classList.contains('color-swatch');

    // Exit if it's not a color swatch
    if (!isColorSwatch) {
        return;
    }

    // Scrolls the color swatch into view
    colorSwatch.scrollIntoView();

    // If there is an active swatch, remove its active status
    if (currentColorSwatch != null) {
        currentColorSwatch.removeAttribute('id');
    }

    // Set the clicked swatch as the active swatch
    colorSwatch.parentElement.id = 'active-swatch';

    // Extract the selected color from the swatch's background color style
    const selectedColor = event.target.style.backgroundColor;
    // Parse the color into red, green, blue, and alpha components
    const [red, green, blue, alpha] = parseColor(selectedColor);

    // Sync the RGB input values with the selected color
    [redInput.value, greenInput.value, blueInput.value] = [red, green, blue];
    // Sync the alpha slider and input values
    alphaSlider.value = alphaInput.value = alpha;
    // Update the hue input based on the RGB values
    hueInput.value = rgbAToHslA(redInput.value, greenInput.value, blueInput.value)[0]; 

    // Update the pointer position on the color picker interface
    updatePointerPosition();
}

// Updates background colors of swatches based on provided palette
function updateColorPalette(palette) {
    // Scrolls to the top when a new palette is selected
    swatchesContainer.scrollTop = 0;

    // Iterates through nodeList of color swatch elements
    for (let swatchIndex = 0; swatchIndex < colorSwatches.length; swatchIndex++) {
        // Gets current swatch element from nodeList
        const swatch = colorSwatches[swatchIndex];
        // Gets corresponding color from input palette
        const shade = palette[swatchIndex];
        
        // Applies color to swatch background
        swatch.style.backgroundColor = shade;
    }
}

// Marks the active swatch based on the selected color
function markActiveSwatch() {
    // Get the currently active color swatch
    const currentColorSwatch = getCurrentColorSwatch();

    // Deactivate active selection if palette is changed
    if (currentColorSwatch != null) {
        currentColorSwatch.removeAttribute('id');
    }

    // Check if the previously selected color is present in the new palette
    for (const colorSwatch of colorSwatches) {
        // Get the colors of the current swatch
        const shade = colorSwatch.style.backgroundColor;
        
        // Check If the shade matches the selected color
        if (shade == color) {
            // Mark the swatch as active
            colorSwatch.parentElement.id = 'active-swatch';

            // Scrolls the color swatch into view
            colorSwatch.scrollIntoView();

            return; // Exit the loop once the match is found
        }
    }
}

// Handles palette selection changes from UI
function handlePaletteChange(event) {
    // Extracts selected palette value from event
    const selectedPalette = event.target.value;

    // Will store the actual color array
    let selectedShades;
 
    // Maps selection to corresponding color palette
    switch (selectedPalette) {
        // Default color palette
        case "DEFAULT":
            selectedShades = defaultPalette;
            break;
        // Vivid color palette
        case "VIVID":
            selectedShades = vividShades;
            break;
        // Soft tones color palette
        case "SOFT TONES": 
            selectedShades = softTones;
            break;
        // Cold color palette
        case "COLD":
            selectedShades = coldPalette
            break;
        // Warm color palette
        case "WARM":
            selectedShades = warmPalette
            break;
        // If no valid palette is selected, do nothing
        default:
            break;
    }
 
    // Updates UI with new color scheme
    updateColorPalette(selectedShades);

    // Marks the matching swatch, if in present palette
    markActiveSwatch();
} 

// Listens for palette selection change to update color scheme
paletteSelect.addEventListener('change', handlePaletteChange);

// Listens for swatch click to set the selected color
swatchesContainer.addEventListener('click', setSwatchColor);

// =============================
// 14. Update Base Canvas Color
// =============================

function updateColorCanvas(colorAngle) {
    // Convert the hue to RGB with full saturation and lightness for preview
    baseShade = hslAToRgbA(colorAngle, 100, 50);
    // console.log('Base Shade:', baseShade);

    // Create an HSL string for the current hue at 100% saturation and 50% lightness
    fillColor = `hsl(${colorAngle}, ${100}%, ${50}%)`;

    // Update the color preview canvas with the selected color
    setupColorCanvas();

    // Convert HSL to RGB, log the HSL values, and extract RGB components;
    const [red, green, blue] = [redInput.value, greenInput.value, blueInput.value];
    // console.log(`hsl(${colorAngle}, ${saturation}, ${lightness})`);

    // Extract alpha value
    const alpha = alphaSlider.value;

    // Update the selected color using the current RGB values
    updateColor(red, green, blue, alpha);
}

// =============================
// 15. Selected Color Functions
// =============================

function getMouseCoordinates(event) {
    // Get the X and Y coordinates of the mouse event relative to the canvas
    const x = event.offsetX;
    const y = event.offsetY;  

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

    // Update the hexInput color preview
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
    // console.log('Perceived Brightness:', perceivedBrightness);

    // Adjust text color based on perceived brightness.
    if (perceivedBrightness > 128) {
        // Lighter background: Use darker text colors for better contrast
        hexInput.style.color = 'rgba(0, 0, 0, 0.85)';
        hexLabel.style.color = 'rgba(20, 17, 13, 0.85)';
    } else {
        // Darker background: Use lighter text colors for better contrast
        hexInput.style.color = 'rgba(231, 231, 231, 0.85)';
        hexLabel.style.color = 'rgba(185, 188, 192, 0.905)';
    }
}

// =======================  
// 16. Color Picker Setup
// =======================

// Sets up color picker interaction with mouse events
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

// Initializes the color picker with the current fill color
function InitializeColorPicker() {
    // Parse the fill color into RGBA components
    const parsedFillColor = parseColor(fillColor);
    const [red, green, blue, alpha] = parsedFillColor;

    // Log the parsed RGBA values for debugging
    // console.log('Fill Color:', red, green, blue, alpha);

    // Update input values for red, green, blue, and alpha
    [redInput.value, greenInput.value, blueInput.value] = [red, green, blue];
    alphaSlider.value = alphaInput.value = alpha;

    // Adjust the pointer position on the canvas
    updatePointerPosition();

    // Update max brush size
    updateMaxBrushSize();
}

// ============================== 
// 17. Convert Hex Values to RGB
// ==============================

// Extracts RGB and alpha components from a HEX color code
function getHexCode(hexCode) {
    // Extract pairs of hex values from the input string.
    const [hexRed, hexBlue, hexGreen, hexAlpha] = hexCode.match(/([A-F]{2}|[A-F][0-9]|[0-9][A-F]|[0-9]{2})/gi);
    return [hexRed, hexBlue, hexGreen, hexAlpha]
}

// Converts HEX color code to RGBA values
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
// 18. Convert RGB Values to Hex
// ==============================

// Converts RGBA to a HEX color code
function rgbAToHexA(red, green, blue, alpha=1) {
    // Retrieved alpha value normalized to 3 decimal places
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
// 19. Convert RGB Values to HSL
// =============================

// Converts RGBA to HSLA, calculating hue and saturation based on chroma
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
// 20. Convert HSL Values to RGB
// ==============================

// Converts HSLA to RGBA with chroma-based color mixing.
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
// 21. Convert HSL Values to HSV
// ==============================

// Converts HSL to HSV while preserving hue.
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
// 22. Hue Slider Setup
// =========================

// Renders a hue spectrum gradient onto the slider for color selection
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
// 23. Update Hue Color
// =========================

// Updates hue selection based on user input and synchronizes related color values
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
    const [hue] = [hueInput.value]
    updateColorCanvas(hue);
}

// =========================
// 23. Save Image Functions
// =========================

// Transforms DOM-based sketch into a precision-mapped canvas rendering
function renderSketchAsCanvas() {
    // Set up our canvas playground
    const sketchCanvas = document.createElement('canvas');
    const sketchContext = sketchCanvas.getContext('2d');

    // Tag canvas with unique identifier for future reference
    sketchCanvas.id = 'sketch-canvas';

    // Figure out how many rows and columns we're dealing with
    const columns = getColumnCount();
    const rows = getRowCount();

    // Extract grid content dimensions
    const gridContentWidth = gridContent.clientWidth;
    const gridContentHeight = gridContent.clientHeight;

    // Set canvas dimensions
    const canvasWidth = gridContentWidth * 2;
    const canvasHeight = gridContentHeight * 2;
 
    // Calculate exact cell sizes, accounting for subpixels
    const gridCellWidth = Math.round(Math.round((canvasWidth / columns) * 100) / 100);
    const gridCellHeight = Math.round(Math.round((canvasHeight / rows) * 100) / 100);
 
    // Set canvas dimensions in one clean shot
    [sketchCanvas.width, sketchCanvas.height] = [canvasWidth, canvasHeight];

    // Add a white base to ensure transparent colors blend correctly,
    sketchContext.fillStyle = 'white';
    sketchContext.fillRect(0, 0, sketchCanvas.width, sketchCanvas.height);
 
    // Work through each column from left to right
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        // Find where this column starts on the x-axis
        const x = gridCellWidth * columnIndex;
 
        // For each column, move down row by row
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            // Find where this row sits on the y-axis
            const y = gridCellHeight * rowIndex;
 
            // Grab the matching grid cell's color
            const gridCell = gridContent.querySelector(`.column-${columnIndex+1}.row-${rowIndex+1}`);
            const cellColor = gridCell.style.backgroundColor;
 
            // Paint this cell onto our canvas with the same color
            sketchContext.fillStyle = cellColor;
            sketchContext.fillRect(x, y, gridCellWidth, gridCellHeight);
        }
    }
 
    // Pop our finished canvas into the overlay
    const canvasOverlay = document.querySelector('.canvas-overlay');
    canvasOverlay.appendChild(sketchCanvas);
}

// Handles exporting the current sketch as a downloadable PNG file
function saveImage() {
    // Ensure sketch is converted to canvas format before saving
    renderSketchAsCanvas();

    // Target the specific canvas element containing our sketch
    const sketchCanvas = document.querySelector('#sketch-canvas');

    // Create temporary link element to trigger the download
    const exportLink = document.createElement('a');
    exportLink.download = 'sketch.png';

    // Convert canvas to blob, maintaining transparency
    // See why blob > dataURL: https://stackoverflow.com/questions/59020799/
    sketchCanvas.toBlob((blob) => {
        // Create temporary URL pointing to our image data
        const imageUrl = URL.createObjectURL(blob);

        // Attach generated URL to our download trigger
        exportLink.href = imageUrl;

        // Programmatically trigger the download
        exportLink.click();

        // Log URL for debugging purposes
        console.log(imageUrl);
    });

    // Clean up the generated URL to prevent memory leaks
    // Warning: This may execute before blob creation due to async nature
    URL.revokeObjectURL(exportLink.href);

    // Remove temporary download element from DOM
    exportLink.remove();

    // Remove canvas element from DOM
    sketchCanvas.remove();
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
handleGridDimensionInput(rowInput, handleRowInput);
handleGridDimensionInput(columnInput, handleColumnInput);
updateColorPalette(defaultPalette);
