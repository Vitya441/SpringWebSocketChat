'use strict';

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput  = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

var stopmClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim(); // name - поле ввода input
    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden'); // убираем скрытие

        var socket = new SockJS('/ws');
        stopmClient = Stomp.over(socket);
        stopmClient.connect({}, onConnected, onError);
    }
    event.preventDefault(); // отключение поведения по умолчанию
}

function onConnected() {
    // subcribe to the public topic
    stopmClient.subscribe('/topic/public', onMessageReceived);

    // tell username to the server
    stopmClient.send('/app/chat.addUser',
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );
    connectingElement.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server, please refresh this page and try again!';
    connectingElement.style.color = 'red'; // в css прописано .connecting
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if (messageContent && stopmClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stopmClient.send(
            "/app/chat.sendMessage",
            {},
            JSON.stringify(chatMessage)
        );
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index]; // colors - массив цветов
}



usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);

