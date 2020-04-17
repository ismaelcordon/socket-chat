// File to modify html with jQuery

var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');

// jQuery references
var divUsers = $('#divUsers');
var formSend = $('#formSend');
var txtMessage = $('#txtMessage');
var divChatBox = $('#divChatBox');

// Functions to render Users
function renderUsers(persons) {
    console.log(persons);

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat of <span> '+ params.get('room') +' </span></a>';
    html += '</li>';

    for(var i = 0; i < persons.length; i++) {
        html += '<li>';
        html += '<a data-id="'+ persons[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ persons[i].name +' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsers.html(html);
}

// Functions to render Messages
function renderMessages(message, me) {

    console.log(message);

    var html = '';
    var date = new Date(message.date);
    console.log(date);
    var hour = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';
    if(message.name === 'admin') {
        adminClass = 'danger';
    }

    if (me) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name +'</h5>';
        html += '        <div class="box bg-light-inverse">' + message.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if(message.name != 'admin'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+ message.name +'</h5>';
        html += '       <div class="box bg-light-'+ adminClass +'">' + message.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }

    divChatBox.append(html);
}

// Function that scrolls when a message arrives
function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


// Listeners
divUsers.on('click', 'a', function(){
    var id = $(this).data('id');
    if(id){
        console.log(id);
    }
});

formSend.on('submit', function(e){
    e.preventDefault();
    if(txtMessage.val().trim().length === 0){
        return;
    }

    socket.emit('createMessage', {
        name: name,
        message: txtMessage.val()
    }, function(message){
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
});