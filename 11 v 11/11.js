let cardIndex = 0; // Tracks the current card being added
const maxPlayers = 11; // Maximum number of players
const cardHeight = 60; // Height of each card including some margin
const cardWidth = 60; // Width of each card including some margin
const playerGap = 20; // Vertical gap between players
const columnGap = 80; // Horizontal gap between columns
const container = document.getElementById('container'); // Get the container element where the cards will be placed
const card = document.getElementById('card'); // Get the base card template for cloning later

// Container's dimensions
const containerWidth = container.offsetWidth; // Width of the container
const containerHeight = container.offsetHeight; // Height of the container

// Predefined positions for the 4-4-2 formation
const columns = [
    { players: 1 },   // Goalkeeper
    { players: 4 },   // Defenders
    { players: 4 },   // Midfielders
    { players: 2 },   // Strikers
];

// Calculate horizontal positions for each column based on the number of columns and container width
columns.forEach((column, i) => {
    column.left = i * (cardWidth + columnGap) + 
                  (containerWidth - (columns.length * (cardWidth + columnGap) - columnGap)) / 2;
});

// Function to add a new player card to the field
function placeCard() {
    if (cardIndex >= maxPlayers) {
        alert("Player Max Reached"); // Alert when maximum players are added
        return;
    }

    let column, positionInColumn;

    // Determine which column the current player goes into (Goalkeeper, Defenders, Midfielders, or Strikers)
    if (cardIndex === 0) { 
        column = 0; // Goalkeeper column
        positionInColumn = 0; // First player in this column
    } else {
        const adjustedIndex = cardIndex - 1;
        if (adjustedIndex < 4) {
            column = 1; // Defenders
            positionInColumn = adjustedIndex;
        } else if (adjustedIndex < 8) {
            column = 2; // Midfielders
            positionInColumn = adjustedIndex - 4;
        } else {
            column = 3; // Strikers
            positionInColumn = adjustedIndex - 8;
        }
    }

    // Clone the base card and add it to the field
    const newCard = card.cloneNode(true);
    newCard.classList.add('card'); // Ensure the card has the correct class for styling and dragging

    // Calculate vertical positions for the card based on the column and the number of players in that column
    const columnPlayers = columns[column].players;
    const totalHeight = columnPlayers * cardHeight + (columnPlayers - 1) * playerGap;
    const startTop = (containerHeight - totalHeight) / 2; // Start top position so players are vertically centered

    // Position the card horizontally and vertically based on the column and position in the column
    newCard.style.left = `${columns[column].left}px`;
    newCard.style.top = `${startTop + positionInColumn * (cardHeight + playerGap)}px`;
    newCard.style.transform = 'translate(-50%, -50%)'; // Center the card within the space
    newCard.style.position = 'absolute'; // Ensure position is absolute for dragging

    // Create and style the editable label for the player
    const label = document.createElement('input');
    label.type = 'text'; // Make it a text input for editing the label
    label.value = `Player ${cardIndex + 1}`; // Set default label as "Player X"
    label.style.position = 'absolute';
    label.style.bottom = '-20px'; // Position the label below the card
    label.style.width = '120px'; // Increase the width of the label for better visibility
    label.style.left = '50%'; // Center the label horizontally
    label.style.transform = 'translateX(-50%)'; // Adjust to align the center of the label with the card
    label.style.textAlign = 'center'; // Center the text within the input
    label.style.fontSize = '12px'; // Set the font size
    label.style.border = 'none'; // Remove border
    label.style.outline = 'none'; // Remove outline when clicked
    label.style.background = 'transparent'; // Transparent background
    label.style.color = 'white'; // White text color
    label.style.cursor = 'pointer'; // Change cursor to pointer for interactivity

    // Make label editable on click (focus event)
    label.addEventListener('focus', () => {
        label.style.background = 'black'; // Highlight editable area when focused
    });

    // Remove highlight when editing ends (blur event)
    label.addEventListener('blur', () => {
        label.style.background = 'transparent'; // Remove highlight after editing
    });

    // Append the label to the card and add dragging functionality
    newCard.appendChild(label);
    newCard.addEventListener('mousedown', mouseDown); // Add event listener for dragging
    container.appendChild(newCard); // Add the card to the container
    cardIndex++; // Increment the card index for the next player
}

// Create the "Add Player" button and position it at the top left of the container
const placeButton = document.createElement('button');
placeButton.textContent = 'Add Player'; // Button text
placeButton.style.position = 'absolute';
placeButton.style.top = '10px';
placeButton.style.left = '10px';
placeButton.addEventListener('click', placeCard); // Add event listener to place a card when clicked
container.appendChild(placeButton); // Append the button to the container

let activeCard = null; // To track the card being dragged
let startX = 0, startY = 0, newX = 0, newY = 0;

// Function to handle the mouse down event (start dragging)
function mouseDown(e) {
    activeCard = e.target.closest('.card'); // Ensure we're dragging the card element
    if (!activeCard) return; // If no card is clicked, return

    startX = e.clientX; // Capture the initial mouse position
    startY = e.clientY;

    // Add event listeners for mouse movement and mouse release
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

// Function to handle the mouse move event (dragging the card)
function mouseMove(e) {
    if (!activeCard) return; // If no card is being dragged, return

    newX = startX - e.clientX; // Calculate how far the mouse has moved horizontally
    newY = startY - e.clientY; // Calculate how far the mouse has moved vertically

    startX = e.clientX; // Update the initial mouse position
    startY = e.clientY;

    // Update the card's position based on the mouse movement
    activeCard.style.top = (activeCard.offsetTop - newY) + 'px';
    activeCard.style.left = (activeCard.offsetLeft - newX) + 'px';
}

// Function to handle the mouse up event (stop dragging)
function mouseUp() {
    document.removeEventListener('mousemove', mouseMove); // Remove mouse move event listener
    document.removeEventListener('mouseup', mouseUp); // Remove mouse up event listener
    activeCard = null; // Reset active card
}
