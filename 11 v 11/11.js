//CONSTANTS


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


//COLUMN POSITIONING

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
    label.style.fontFamily = "Homenaje";
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

// Create the "Add Player" button
const placeButton = document.createElement('button');
placeButton.textContent = 'Add Player'; // Button text

// Apply initial styles to the button
placeButton.style.position = 'absolute'; // Position it relative to the container
placeButton.style.padding = '10px 20px'; // Add some padding for better appearance
placeButton.style.backgroundColor = '#007BFF'; // Set background color
placeButton.style.color = 'white'; // Set text color
placeButton.style.border = 'none'; // Remove border
placeButton.style.borderRadius = '5px'; // Add rounded corners
placeButton.style.cursor = 'pointer'; // Change cursor to pointer
placeButton.style.fontSize = '14px'; // Set font size

function positionButton() {
    const containerRect = container.getBoundingClientRect(); // Get the container's position and dimensions
    const scrollTop = window.scrollY || document.documentElement.scrollTop; // Get current page scroll position

    // Position the button 50px above the container, adjusting for any page scroll
    placeButton.style.top = `${containerRect.top + scrollTop - 50}px`; // Adjust for scroll
    placeButton.style.left = `${containerRect.left}px`; // Align horizontally with the container
}



// Position the button initially and on window resize
positionButton();
window.addEventListener('resize', positionButton);

// Add event listener to place a card when clicked
placeButton.addEventListener('click', placeCard);

// Append the button to the body
document.body.appendChild(placeButton);




// DRAGGING FUNCTION



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

function mouseMove(e) {
    if (!activeCard) return; // If no card is being dragged, return

    // Calculate the new position based on mouse movement
    newX = startX - e.clientX; // Horizontal movement
    newY = startY - e.clientY; // Vertical movement

    startX = e.clientX; // Update the initial mouse position
    startY = e.clientY;

    // Get the container's boundaries
    const containerRect = container.getBoundingClientRect();
    const cardRect = activeCard.getBoundingClientRect();

    // Calculate the new position with boundary checks
    let newLeft = activeCard.offsetLeft - newX;
    let newTop = activeCard.offsetTop - newY;

    // Constrain horizontal movement
    if (cardRect.left <= containerRect.left && newX > 0) {
        newLeft = activeCard.offsetLeft; // Prevent moving further left
    }
    if (cardRect.right >= containerRect.right && newX < 0) {
        newLeft = activeCard.offsetLeft; // Prevent moving further right
    }

    // Constrain vertical movement
    if (cardRect.top <= containerRect.top && newY > 0) {
        newTop = activeCard.offsetTop; // Prevent moving further up
    }
    if (cardRect.bottom >= containerRect.bottom && newY < 0) {
        newTop = activeCard.offsetTop; // Prevent moving further down
    }

    // Apply the constrained position
    activeCard.style.left = `${newLeft}px`;
    activeCard.style.top = `${newTop}px`;
}


// Function to handle the mouse up event (stop dragging)
function mouseUp() {
    document.removeEventListener('mousemove', mouseMove); // Remove mouse move event listener
    document.removeEventListener('mouseup', mouseUp); // Remove mouse up event listener
    activeCard = null; // Reset active card
}



// TOOLS


// Create the tools div
const toolsDiv = document.createElement('div');
toolsDiv.id = 'toolsDiv'; // Assign an ID for easier styling and access

// Style the tools div
toolsDiv.style.position = 'absolute'; // Position it relative to the container
toolsDiv.style.width = `${container.offsetWidth}px`; // Match the container's width
toolsDiv.style.height = '60px'; // Set a fixed height
toolsDiv.style.borderRadius = '10px'; // Add rounded corners
toolsDiv.style.backgroundColor = '#f0f0f0'; // Light gray background
toolsDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Add a subtle shadow
toolsDiv.style.display = 'flex'; // Use flexbox for layout
toolsDiv.style.alignItems = 'center'; // Center items vertically
toolsDiv.style.justifyContent = 'center'; // Center items horizontally

function positionToolsDiv() {
    const containerRect = container.getBoundingClientRect();
    const screenPadding = 20; // Padding between the div and the bottom of the screen
    const bottomSpace = window.innerHeight - containerRect.bottom;

    // Position the toolsDiv below the container
    if (bottomSpace > 100) {
        toolsDiv.style.top = `${containerRect.bottom + 20}px`; // Position below the container with spacing
    } else {
        toolsDiv.style.top = `${window.innerHeight - toolsDiv.offsetHeight - screenPadding}px`; // Align closer to the bottom with padding
    }

    // Align horizontally using offsetLeft
    toolsDiv.style.left = `${container.offsetLeft}px`;
}



// Position the tools div initially and on window resize
positionToolsDiv();
window.addEventListener('resize', positionToolsDiv);

// Append the tools div to the body
document.body.appendChild(toolsDiv);

// Add a placeholder for tools
const placeholder = document.createElement('span');
placeholder.textContent = ''; // Placeholder text
placeholder.style.color = '#888'; // Light gray text color
placeholder.style.fontSize = '14px'; // Font size
toolsDiv.appendChild(placeholder);


//BALL

// Add "Add Ball" button to toolsDiv
const addBallButton = document.createElement('button');
addBallButton.textContent = 'Add Ball';
addBallButton.style.padding = '10px 20px';
addBallButton.style.backgroundColor = '#FFC107';
addBallButton.style.color = 'black';
addBallButton.style.border = 'none';
addBallButton.style.borderRadius = '5px';
addBallButton.style.cursor = 'pointer';
addBallButton.style.marginRight = '10px';
toolsDiv.appendChild(addBallButton);

// Add event listener for adding a ball
addBallButton.addEventListener('click', () => {
    // Create a new ball element
    const ball = document.createElement('div');
    ball.style.width = '30px'; // Set ball diameter
    ball.style.height = '30px';
    ball.style.borderRadius = '50%';
    ball.style.backgroundColor = 'white';
    ball.style.position = 'absolute';
    ball.style.left = `${container.offsetWidth / 2 - 15}px`; // Center the ball horizontally
    ball.style.top = `${container.offsetHeight / 2 - 15}px`; // Center the ball vertically
    ball.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)'; // Add shadow for a realistic look
    ball.classList.add('ball'); // Add a class for future styling or interactions

    // Add dragging functionality to the ball
    ball.addEventListener('mousedown', (e) => {
        let startX = e.clientX;
        let startY = e.clientY;

        const moveBall = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            ball.style.left = `${ball.offsetLeft + deltaX}px`;
            ball.style.top = `${ball.offsetTop + deltaY}px`;

            startX = e.clientX;
            startY = e.clientY;
        };

        const stopBall = () => {
            document.removeEventListener('mousemove', moveBall);
            document.removeEventListener('mouseup', stopBall);
        };

        document.addEventListener('mousemove', moveBall);
        document.addEventListener('mouseup', stopBall);
    });

    // Append the ball to the container
    container.appendChild(ball);
});



// LINE

// Add "Draw Line" button to toolsDiv
const drawLineButton = document.createElement('button');
drawLineButton.textContent = 'Draw Line';
drawLineButton.style.padding = '10px 20px';
drawLineButton.style.backgroundColor = '#28A745';
drawLineButton.style.color = 'white';
drawLineButton.style.border = 'none';
drawLineButton.style.borderRadius = '5px';
drawLineButton.style.cursor = 'pointer';
drawLineButton.style.marginRight = '10px';
toolsDiv.appendChild(drawLineButton);

// Line drawing state variables
let isDrawing = false;
let activeLine = null;

// Toggle line drawing mode
drawLineButton.addEventListener('click', () => {
    isDrawing = !isDrawing;
    drawLineButton.style.backgroundColor = isDrawing ? '#DC3545' : '#28A745';
    drawLineButton.textContent = isDrawing ? 'Cancel Line' : 'Draw Line';
});

// Start drawing a line
container.addEventListener('mousedown', (e) => {
    if (!isDrawing) return;

    // Create the line
    activeLine = document.createElement('div');
    activeLine.style.position = 'absolute';
    activeLine.style.backgroundColor = 'black';
    activeLine.style.height = '2px';
    activeLine.style.left = `${e.offsetX}px`;
    activeLine.style.top = `${e.offsetY}px`;
    activeLine.style.width = '0px';
    activeLine.style.transformOrigin = '0 50%';
    activeLine.classList.add('draggable-line');
    
    // Create rotation handle
    const rotationHandle = document.createElement('div');
    rotationHandle.style.position = 'absolute';
    rotationHandle.style.width = '10px';
    rotationHandle.style.height = '10px';
    rotationHandle.style.backgroundColor = 'blue';
    rotationHandle.style.borderRadius = '50%';
    rotationHandle.style.cursor = 'grab';
    rotationHandle.style.transform = 'translate(-50%, -50%)';
    rotationHandle.style.display = 'none'; // Hidden during drawing
    rotationHandle.classList.add('rotation-handle');
    activeLine.appendChild(rotationHandle);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.style.position = 'absolute';
    deleteButton.style.width = '20px';
    deleteButton.style.height = '20px';
    deleteButton.style.backgroundColor = 'red';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '50%';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.transform = 'translate(-50%, -50%)';
    deleteButton.style.display = 'none'; // Initially hidden
    deleteButton.classList.add('delete-button');
    activeLine.appendChild(deleteButton);

    container.appendChild(activeLine);

    // Store initial position
    activeLine.startX = e.offsetX;
    activeLine.startY = e.offsetY;

    // Add listeners for resizing
    document.addEventListener('mousemove', resizeLine);
    document.addEventListener('mouseup', stopDrawing);

    // Setup rotation and delete functionality
    setupRotation(rotationHandle, activeLine);
    setupDelete(deleteButton, activeLine);
});

// Resize the line
function resizeLine(e) {
    if (!activeLine) return;

    const deltaX = e.offsetX - activeLine.startX;
    const deltaY = e.offsetY - activeLine.startY;
    const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    activeLine.style.width = `${length}px`;
    activeLine.style.transform = `rotate(${Math.atan2(deltaY, deltaX)}rad)`;
}

// Stop drawing and enable rotation after deselection
function stopDrawing() {
    if (!activeLine) return;

    // Make draggable
    activeLine.addEventListener('mousedown', dragLine);

    // Show rotation handle after deselecting
    const rotationHandle = activeLine.querySelector('.rotation-handle');
    if (rotationHandle) rotationHandle.style.display = 'block';

    document.removeEventListener('mousemove', resizeLine);
    document.removeEventListener('mouseup', stopDrawing);

    activeLine = null;
}

// Drag line
function dragLine(e) {
    const line = e.target.closest('.draggable-line');
    if (!line) return;

    let startX = e.clientX;
    let startY = e.clientY;

    // Show the delete button when the line is clicked
    const deleteButton = line.querySelector('.delete-button');
    if (deleteButton) deleteButton.style.display = 'block';

    function moveLine(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        line.style.left = `${line.offsetLeft + deltaX}px`;
        line.style.top = `${line.offsetTop + deltaY}px`;

        startX = e.clientX;
        startY = e.clientY;
    }

    function releaseLine() {
        document.removeEventListener('mousemove', moveLine);
        document.removeEventListener('mouseup', releaseLine);
    }

    document.addEventListener('mousemove', moveLine);
    document.addEventListener('mouseup', releaseLine);
}

// Setup rotation functionality (only after deselection)
function setupRotation(handle, line) {
    handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();

        const rect = line.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotateLine(e) {
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX);

            line.style.transform = `rotate(${angle}rad)`;
        }

        function stopRotation() {
            document.removeEventListener('mousemove', rotateLine);
            document.removeEventListener('mouseup', stopRotation);
        }

        document.addEventListener('mousemove', rotateLine);
        document.addEventListener('mouseup', stopRotation);
    });
}

// Setup delete functionality
function setupDelete(deleteButton, line) {
    deleteButton.addEventListener('click', () => {
        line.remove(); // Remove the line from the DOM
    });

    // Hide delete button when clicking outside the line
    document.addEventListener('click', (e) => {
        if (!line.contains(e.target)) {
            deleteButton.style.display = 'none';
        }
    })}

//FORMATION

    // Add dropdown for formation selection
const formationDropdown = document.createElement('select');
formationDropdown.style.padding = '10px';
formationDropdown.style.borderRadius = '5px';
formationDropdown.style.marginRight = '10px';
formationDropdown.style.fontSize = '14px';
toolsDiv.appendChild(formationDropdown);

// Add formation options
const formations = {
    '4-4-2': [1, 4, 4, 2],
    '4-3-3': [1, 4, 3, 3], // Example new formation
    '3-5-2': [1, 3, 5, 2], // Add more formations as needed


};

Object.keys(formations).forEach(formation => {
    const option = document.createElement('option');
    option.value = formation;
    option.textContent = formation;
    formationDropdown.appendChild(option);
});

// Rearrange players based on the selected formation
formationDropdown.addEventListener('change', () => {
    const selectedFormation = formationDropdown.value;
    const newColumns = formations[selectedFormation];

    // Update column players count
    newColumns.forEach((playerCount, index) => {
        if (columns[index]) {
            columns[index].players = playerCount;
        }
    });

    // Reposition players
    repositionPlayers(newColumns);
});

function repositionPlayers(newFormation) {
    const allCards = container.querySelectorAll('.card');
    let cardCounter = 0;

    newFormation.forEach((playerCount, columnIndex) => {
        const columnPlayers = playerCount;
        const totalHeight = columnPlayers * cardHeight + (columnPlayers - 1) * playerGap;
        const startTop = (containerHeight - totalHeight) / 2;

        for (let i = 0; i < columnPlayers; i++) {
            if (cardCounter >= allCards.length) return;

            const card = allCards[cardCounter];
            card.style.left = `${columns[columnIndex].left}px`;
            card.style.top = `${startTop + i * (cardHeight + playerGap)}px`;

            cardCounter++;
        }
    });
}


