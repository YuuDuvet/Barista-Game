const drinksMenu = {
  "Honey Coffee": ["Coffee", "Honey"],
  "Ginger Milk": ["Milk", "Ginger"],
  "Cinnamon Coffee": ["Coffee", "Cinnamon"],
  "Honey Cinnamon Milk": ["Milk", "Honey", "Cinnamon"],
};

const customers = [
  { name: "Freya", img: "customer1.png", favoriteDrink: "Honey Coffee", attempts: 0 },
  { name: "Lua", img: "customer2.png", favoriteDrink: "Ginger Milk", attempts: 0 },
  { name: "Bailey", img: "customer3.png", favoriteDrink: "Cinnamon Coffee", attempts: 0 },
  { name: "Riona", img: "customer4.png", favoriteDrink: "Honey Cinnamon Milk", attempts: 0 },
  { name: "Aqua", img: "customer4.png", favoriteDrink: "Honey Cinnamon Milk", attempts: 0 },
];

let selectedIngredients = [];
let currentCustomer = null;
let trashCount = 0;
const maxTrashCount = 5;
const maxAttempts = 3; // After 3 incorrect attempts, customer leaves

// Start with a random customer
nextCustomer();

document.getElementById("next-dialogue-button").onclick = nextDialogue;

function nextCustomer() {
  // Select a random customer who hasn't left
  const availableCustomers = customers.filter(c => c.attempts < maxAttempts);

  if (availableCustomers.length === 0) {
    document.getElementById("dialogue-text").innerText = 
      "All the customers have left. Game over!";
    document.getElementById("right-panel").style.display = "none";
    return;
  }

  currentCustomer = availableCustomers[Math.floor(Math.random() * availableCustomers.length)];

  // Update customer image and name
  document.getElementById("customer-img").src = currentCustomer.img;
  document.getElementById("character-name").innerText = currentCustomer.name;

  // Set initial dialogue to ask for the drink
  document.getElementById("dialogue-text").innerText = 
    `Hi! I'd like a ${currentCustomer.favoriteDrink}, please.`;

  // Reset ingredients and cup fill for the next customer
  selectedIngredients = [];
  updateCupFill();
  document.getElementById("feedback").innerText = "";
}

function nextDialogue() {
  const dialogues = [
    "I'm really looking forward to this drink!",
    "Hope you make it just right!",
    "Surprise me with your barista skills!",
    "I really need this today.",
    "Don't forget to add some sugar!",
    "I'm a fan of this place!",
    "I'm feeling a bit tired today.",
    "I'm not sure if I'll like this.",
    "I'm feeling a bit hungry. Ughhh~",
    "I'm feeling a bit thirsty. I need a drink.",
  ];

  // Pick a random dialogue from the list
  const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
  document.getElementById("dialogue-text").innerText = randomDialogue;

  document.getElementById("next-dialogue-button").disabled = true;

  // Show the coffee-making interface after dialogue progresses
  document.getElementById("right-panel").style.display = "block";
}

function addIngredient(ingredient) {
  if (selectedIngredients.length < 3) {
    selectedIngredients.push(ingredient);
    updateCupFill();
  } else {
    alert("You can only add up to 3 ingredients!");
  }
}

function updateCupFill() {
  const fill = (selectedIngredients.length / 3) * 100;
  document.getElementById("cup-fill").style.height = `${fill}%`;
}

function brewDrink() {
  if (selectedIngredients.length === 0) {
    alert("Add some ingredients first!");
    return;
  }

  const expectedIngredients = drinksMenu[currentCustomer.favoriteDrink];
  const isCorrectOrder = checkOrder(expectedIngredients, selectedIngredients);

  if (isCorrectOrder) {
    document.getElementById("feedback").innerText = 
      `Perfect! ${currentCustomer.name} says: "That's exactly what I wanted!"`;
    setTimeout(nextCustomer, 2000);
  } else {
    currentCustomer.attempts++;

    if (currentCustomer.attempts >= maxAttempts) {
      document.getElementById("feedback").innerText = 
        `${currentCustomer.name} says: "That's it! I'm never coming back!"`;
      setTimeout(nextCustomer, 2000);
      return;
    }

    const missingIngredients = expectedIngredients.filter(
      (ing) => !selectedIngredients.includes(ing)
    );
    const extraIngredients = selectedIngredients.filter(
      (ing) => !expectedIngredients.includes(ing)
    );

    let feedbackMessage = `${currentCustomer.name} says: "Hmm... this isn't right."`;

    if (missingIngredients.length > 0) {
      feedbackMessage += ` Missing: ${missingIngredients.join(", ")}.`;
    }
    if (extraIngredients.length > 0) {
      feedbackMessage += ` Extra: ${extraIngredients.join(", ")}.`;
    }

    document.getElementById("feedback").innerText = feedbackMessage;
  }

  // Reset for the next order
  selectedIngredients = [];
  updateCupFill();
}

function checkOrder(expected, ingredients) {
  // Sort both arrays for easier comparison
  const sortedExpected = [...expected].sort();
  const sortedIngredients = [...ingredients].sort();

  // Check if both arrays are identical
  return JSON.stringify(sortedExpected) === JSON.stringify(sortedIngredients);
}

function trashDrink() {
  if (trashCount >= maxTrashCount) {
    alert("No more trash attempts left! Be more careful.");
    return;
  }

  trashCount++;
  document.getElementById("trash-counter").innerText = 
    `Trash Attempts Left: ${maxTrashCount - trashCount}`;

  // Reset the current drink
  selectedIngredients = [];
  updateCupFill();
  document.getElementById("feedback").innerText = 
    "You trashed the drink.";
}

// Start page
function startGame() {
  window.location.href = "Game.html";
}
