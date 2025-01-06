const squadNameInput = document.getElementById('squad-name'); // Input field for squad name
const playerNameInput = document.getElementById('player-name'); // Input field for player name
const addPlayerButton = document.getElementById('add-player'); // Button to add a player
const saveSquadButton = document.getElementById('save-squad'); // Button to save the squad
const squadList = document.getElementById('squad-list'); // Container for saved squads

let currentPlayers = []; // Array to store players for the current squad
let squadDiv; // Div to display the current squad

// Load squads from localStorage on page load
document.addEventListener('DOMContentLoaded', loadSquadsFromLocalStorage);

// Create and display the squad div when the user enters a squad name
squadNameInput.addEventListener('input', () => {
    const squadName = squadNameInput.value.trim(); // Get the squad name
    if (!squadDiv) { // Create the squad div if it doesn't already exist
        squadDiv = document.createElement('div');
        squadDiv.className = 'squad-item';
        squadList.appendChild(squadDiv); // Add the squad div to the squad list
    }
    // Update the squad name in the div
    squadDiv.innerHTML = `
        <strong>Squad Name:</strong> ${squadName}
        <div class="player-list">
            <strong>Players:</strong>
            ${currentPlayers.map(player => `<span>${player}</span>`).join('')}
        </div>
    `;
});

// Add a player to the current squad and update the squad div
addPlayerButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim(); // Get the player name
    if (!playerName) { // Check if the player name is empty
        alert('Please enter a player name.');
        return;
    }
    currentPlayers.push(playerName); // Add the player to the array
    playerNameInput.value = ''; // Clear the input field

    // Update the players list in the squad div
    if (squadDiv) {
        const playerListDiv = squadDiv.querySelector('.player-list');
        playerListDiv.innerHTML = `
            <strong>Players:</strong>
            ${currentPlayers.map(player => `<span>${player}</span>`).join('')}
        `;
    }
});

// Save the squad and store it in localStorage
saveSquadButton.addEventListener('click', () => {
    const squadName = squadNameInput.value.trim(); // Get the squad name
    if (!squadName) { // Check if the squad name is empty
        alert('Please enter a squad name.');
        return;
    }
    if (currentPlayers.length === 0) { // Check if there are players in the squad
        alert('Please add at least one player to the squad.');
        return;
    }

    // Save the squad to localStorage
    const squads = JSON.parse(localStorage.getItem('squads')) || [];
    squads.push({ squadName, players: currentPlayers });
    localStorage.setItem('squads', JSON.stringify(squads));

    // Finalize the current squad div and reset for the next squad
    squadDiv = null; // Allow a new squad div to be created
    squadNameInput.value = ''; // Clear the squad name input
    currentPlayers = []; // Reset the current players array

    // Refresh the displayed squad list
    loadSquadsFromLocalStorage();
});

// Load squads from localStorage and display them
function loadSquadsFromLocalStorage() {
    const squads = JSON.parse(localStorage.getItem('squads')) || []; // Get squads from localStorage
    squadList.innerHTML = ''; // Clear the squad list
    squads.forEach(({ squadName, players }) => {
        const squadItem = document.createElement('div');
        squadItem.className = 'squad-item';
        squadItem.innerHTML = `
            <strong>Squad Name:</strong> ${squadName}
            <div class="player-list">
                <strong>Players:</strong>
                ${players.map(player => `<span>${player}</span>`).join('')}
            </div>
        `;
        squadList.appendChild(squadItem);
    });
}

function deleteSquad(event) {
    const squadIndex = event.target.getAttribute('data-index');
    const squads = JSON.parse(localStorage.getItem('squads')) || [];
    squads.splice(squadIndex, 1); // Remove the squad from the array
    localStorage.setItem('squads', JSON.stringify(squads)); // Update localStorage
    loadSquadsFromLocalStorage(); // Refresh the squad list
}