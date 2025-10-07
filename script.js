document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const petEl = document.getElementById('pet');
    const messageEl = document.getElementById('message');
    const healthBar = document.getElementById('health-bar'); // NEW
    const hungerBar = document.getElementById('hunger-bar');
    const happinessBar = document.getElementById('happiness-bar');
    const cleanlinessBar = document.getElementById('cleanliness-bar');
    const strengthBar = document.getElementById('strength-bar'); // NEW
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const cleanBtn = document.getElementById('clean-btn');
    const trainBtn = document.getElementById('train-btn'); // NEW

    // Pet State
    let pet = {
        health: 100, // NEW
        hunger: 100,
        happiness: 100,
        cleanliness: 100,
        strength: 10,  // NEW
        isAlive: true,
    };

    // Game Constants
    const STAT_DECAY = 2;
    const ACTION_BOOST = 20;
    const GAME_SPEED = 2000;

    // --- Action Functions ---
    
    function feed() {
        if (!pet.isAlive) return;
        pet.hunger = Math.min(100, pet.hunger + ACTION_BOOST);
        pet.cleanliness = Math.max(0, pet.cleanliness - 5);
        showMessage("Yum! That was delicious! 🍔");
        animatePet();
        updateDisplay();
    }

    function play() {
        if (!pet.isAlive) return;
        pet.happiness = Math.min(100, pet.happiness + ACTION_BOOST);
        pet.hunger = Math.max(0, pet.hunger - 5);
        showMessage("Whee! That was so much fun! 🎮");
        animatePet();
        updateDisplay();
    }

    function clean() {
        if (!pet.isAlive) return;
        pet.cleanliness = Math.min(100, pet.cleanliness + ACTION_BOOST);
        pet.happiness = Math.max(0, pet.happiness - 5);
        showMessage("All clean and shiny! 🧼");
        animatePet();
        updateDisplay();
    }
    
    // NEW: Train function
    function train() {
        if (!pet.isAlive) return;
        pet.strength += 5;
        pet.hunger = Math.max(0, pet.hunger - 10);
        pet.happiness = Math.max(0, pet.happiness - 10);
        showMessage("Workout complete! Feeling stronger! 💪");
        animatePet();
        updateDisplay();
    }

    // --- Game Logic ---

    function updateStats() {
        if (!pet.isAlive) return;

        // Regular stat decay
        pet.hunger = Math.max(0, pet.hunger - STAT_DECAY);
        pet.happiness = Math.max(0, pet.happiness - STAT_DECAY);
        pet.cleanliness = Math.max(0, pet.cleanliness - STAT_DECAY);

        // NEW: Health is affected by other stats
        if (pet.hunger < 25 || pet.cleanliness < 25) {
            pet.health = Math.max(0, pet.health - 5); // Neglect hurts health
        } else if (pet.hunger > 80 && pet.happiness > 80) {
            pet.health = Math.min(100, pet.health + 1); // Good care recovers health
        }

        checkPetState();
        updateDisplay();
    }

    function checkPetState() {
        // NEW: Game over condition now includes health
        if (pet.health === 0 || pet.hunger === 0 || pet.happiness === 0) {
            pet.isAlive = false;
            petEl.textContent = '👻';
            petEl.className = 'pet-dead';
            messageEl.textContent = "Oh no! Webie has run away to the internet cloud...";
            // Disable buttons
            feedBtn.disabled = true;
            playBtn.disabled = true;
            cleanBtn.disabled = true;
            trainBtn.disabled = true;
        } else if (pet.cleanliness < 30) {
            petEl.textContent = '💩';
            petEl.className = 'pet-dirty';
        } else if (pet.health < 40) { // NEW: Low health state
            petEl.textContent = '🤒';
            petEl.className = 'pet-sick';
        } else if (pet.hunger < 50 || pet.happiness < 50) {
            petEl.textContent = '😢';
            petEl.className = 'pet-sad';
        } else {
            petEl.textContent = '😊';
            petEl.className = 'pet-happy';
        }
    }
    
    function updateDisplay() {
        healthBar.value = pet.health; // NEW
        hungerBar.value = pet.hunger;
        happinessBar.value = pet.happiness;
        cleanlinessBar.value = pet.cleanliness;
        strengthBar.value = pet.strength; // NEW
    }

    function showMessage(msg) {
        messageEl.textContent = msg;
    }

    function animatePet() {
        petEl.classList.add('pet-action');
        setTimeout(() => {
            petEl.classList.remove('pet-action');
        }, 500);
    }

    // --- Event Listeners and Game Loop ---

    feedBtn.addEventListener('click', feed);
    playBtn.addEventListener('click', play);
    cleanBtn.addEventListener('click', clean);
    trainBtn.addEventListener('click', train); // NEW

    // Initialize the game
    updateDisplay();
    checkPetState();
    
    // Start the game loop
    setInterval(updateStats, GAME_SPEED);
});