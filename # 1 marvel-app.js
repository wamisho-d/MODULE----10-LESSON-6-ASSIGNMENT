// Import the md5 library (install using npm or CDN if necessary)
// Example for browser environment: <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
import md5 from 'md5'; // Use if running in a Node.js or module-based environment

// Marvel API Configuration
const API_PUBLIC_KEY = 'your-public-key-here'; // Replace with your actual public key
const API_PRIVATE_KEY = 'your-private-key-here'; // Replace with your actual private key
const BASE_URL = 'https://gateway.marvel.com:443/v1/public/characters';

/**
 * Generate authentication parameters for Marvel API
 * @returns {Object} ts, apikey, and hash values
 */
function generateAuthParams() {
    const ts = Date.now().toString(); // Current timestamp
    const hash = md5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY); // Generate MD5 hash
    return { ts, apikey: API_PUBLIC_KEY, hash };
}

/**
 * Fetch Marvel characters from the API
 * @param {number} limit - Number of characters to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Array} Array of character data
 */
async function fetchMarvelCharacters(limit = 10, offset = 0) {
    try {
        const { ts, apikey, hash } = generateAuthParams(); // Generate auth params
        const url = `${BASE_URL}?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${apikey}&hash=${hash}`;

        const response = await fetch(url); // Fetch data from API
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json(); // Parse JSON response
        return data.data.results; // Return character array
    } catch (error) {
        console.error('Error fetching Marvel characters:', error);
        return [];
    }
}

/**
 * Update UI with fetched characters
 */
async function updateUIWithCharacters() {
    const container = document.getElementById('characters-container'); // UI container
    container.innerHTML = ''; // Clear existing content

    const characters = await fetchMarvelCharacters(); // Fetch characters

    if (characters.length > 0) {
        characters.forEach((character) => {
            // Create a card for each character
            const card = document.createElement('div');
            card.className = 'character-card';

            // Character name
            const name = document.createElement('h3');
            name.textContent = character.name;

            // Character thumbnail
            const img = document.createElement('img');
            img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            img.alt = `${character.name} thumbnail`;

            // Character description
            const description = document.createElement('p');
            description.textContent = character.description || 'No description available.';

            // Append elements to the card
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(description);

            // Append card to the container
            container.appendChild(card);
        });
    } else {
        container.innerHTML = '<p>No characters found.</p>'; // Fallback message
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-characters');
    fetchButton.addEventListener('click', updateUIWithCharacters); // Attach click event
});
