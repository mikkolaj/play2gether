var socket = io.connect('http://localhost:8000');
// Query DOM
const jwtOBJ = document.getElementById('jwt'),
    conversation = document.getElementById('conversation'),
    message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    join = document.getElementById('join'),
    btn = document.getElementById('send'),
    output = document.getElementById('output');

console.log(message.value, jwt.value, join.value, conversation.value);
// Emit events
join.addEventListener('click', function () {
    const room = conversation.value;
    const jwt = jwtOBJ.value;
    console.log(room, jwt);
    socket.emit('subscribe', {
        room,
        jwt
    });
    join.innerHTML = 'connected';
});

btn.addEventListener('click', function () {
    const room = conversation.value;
    const jwt = jwtOBJ.value;
    socket.emit('send', {
        message: message.value,
        jwt,
        room,
        handle: handle.value
    });
    message.value = "";
});

// Listen for events
socket.on('chat', function (data) {
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});