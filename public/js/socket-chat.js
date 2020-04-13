var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('name') || !params.has('room')){
    window.location = 'index.html';
    throw new console.error('Name and room are necessary');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('user connected to server');

    socket.emit('enterToChat', user, function(resp){
        console.log('Users connected: ', resp);
    });
});

socket.on('disconnect', function() {
    console.log('Connection lost');
});

socket.on('createMessage', function(message) {
    console.log('Servidor:', message);
});

// When an user enters or leaves the chat
socket.on('listPerson', function(persons){
    console.log(persons);
})

// Private messages
socket.on('privateMessage', function(message){
    console.log('private message: ', message);
})