const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");

const colors = ["cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", "gold",];

const user = { id: "", name: "", color: "" }

let websocket;

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();
    
    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:8080");
    websocket.onmessage = precessMessage;
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = {
        userID: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    chatInput.value = "";
});

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function scrollScreen() {
    window.scrollTo({
        top:document.body.scrollHeight,
        behavior: "smooth"
    });
}

function precessMessage({ data }) {
    const { userID, userName, userColor, content } = JSON.parse(data);

    const message = userID == user.id ? createMessageSelfEmenent(content) : createMessageOtherEmenent(content, userName, userColor);

    chatMessages.appendChild(message);
    scrollScreen();
}

function createMessageSelfEmenent(content) {
    const div = document.createElement("div");

    div.classList.add("message--self");
    div.innerHTML = content;

    return div;
}

function createMessageOtherEmenent(content, sender, senderColor) {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    div.classList.add("message--self");
    span.classList.add("message--sender");
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
}
