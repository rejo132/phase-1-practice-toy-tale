// index.js

const addBtn = document.querySelector("#new-toy-btn");
const formContainer = document.querySelector("#toy-form-container");
const toyCollection = document.getElementById("toy-collection");
const addToyForm = document.getElementById("add-toy-form");
const baseUrl = "http://localhost:3000/toys";

let addToy = false;

// Provided form toggle code
addBtn.addEventListener("click", () => {
  addToy = !addToy;
  formContainer.style.display = addToy ? "block" : "none";
});

// Fetch all toys on page load
document.addEventListener("DOMContentLoaded", () => {
  fetch(baseUrl)
    .then(response => response.json())
    .then(toys => toys.forEach(renderToy))
    .catch(error => console.error("Error fetching toys:", error));
});

// Render a single toy card
function renderToy(toy) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" alt="${toy.name}">
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(card);

  // Add event listener for like button
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => increaseLikes(toy, card));
}

// Add a new toy
addToyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  const newToy = {
    name,
    image,
    likes: 0
  };

  fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy);
      addToyForm.reset(); // Clear form
      formContainer.style.display = "none"; // Hide form
      addToy = false;
    })
    .catch(error => console.error("Error adding toy:", error));
});

// Increase toy likes
function increaseLikes(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`${baseUrl}/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // Update local toy object
      card.querySelector("p").textContent = `${updatedToy.likes} Likes`; // Update DOM
    })
    .catch(error => console.error("Error updating likes:", error));
}