// Calculate the total number of grid cells (16 rows and 16 columns)
const totalGridCells = Math.pow(16, 2); // 16^2 = 256
console.log(`Number of Grids: ${totalGridCells}`); // Log the number of grids to the console

// Select the element with the ID 'grid-content' from the DOM
const gridContent = document.querySelector('#grid-content'); // Renamed back to gridContent
// Get the width of the grid content area
const gridContentWidth = gridContent.clientWidth;
console.log(`Grid Content Width: ${gridContentWidth}px`); // Log the content width


