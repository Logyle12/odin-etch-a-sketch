// Calculate the total number of grid cells (16 rows and 16 columns)
const totalGridCells = Math.pow(16, 2); // 16^2 = 256
console.log(`Number of Grids: ${totalGridCells}`); // Log the number of grids to the console

// Select the element with the ID 'grid-content' from the DOM
const gridContent = document.querySelector('#grid-content'); // Renamed back to gridContent
// Get the width of the grid content area
const gridContentWidth = `${gridContent.clientWidth}`;
console.log(`Grid Content Width: ${gridContentWidth}px`); // Log the content width

// Calculate the width and height for each grid cell based on the total number of grids
const gridCellDimensions = `${gridContentWidth / Math.sqrt(totalGridCells)}px`; // Each grid will be a square
console.log(`Grid Width: ${gridCellDimensions}`); // Log the calculated grid cell dimensions

// Loop to create and append grid cells to the grid content
for (let gridIndex = 0; gridIndex < totalGridCells; gridIndex++) {
    // Create a new 'div' element for each grid cell
    const grid = document.createElement('div');
    // Add the 'grid' class to the new grid cell
    grid.classList.add('grid');
    // Set the width and height of the grid cell
    grid.style["width"] = gridCellDimensions;
    grid.style["height"] = gridCellDimensions;
    console.log("Add Grid"); // Log the addition of a grid cell
    // Append the new grid cell to the grid content
    gridContent.appendChild(grid);
}
