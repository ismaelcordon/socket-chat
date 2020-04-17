const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utilities/utilities');

const users = new Users();


io.on('connection', (client) => {

    client.on('enterToChat', (data, callback) => {

        if(!data.name || !data.room){
            return resp({
                error: true,
                message: 'The name is required'
            });
        }

        // Connect user to room
        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);
        client.to(data.room).emit('listPerson', users.getPersonsByRoom(data.room));
        client.broadcast.to(data.room).emit('createMessage', createMessage('admin', `${data.name} joined the chat`));
        callback(users.getPersonsByRoom(data.room));
    });

    client.on('createMessage', (data, callback) => {
        let person = users.getPerson(client.id);
        console.log(person)
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);

        callback(message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);

        client.to(deletedPerson.room).emit('createMessage', createMessage('admin', `${deletedPerson.name} leaves the chat`));
        client.to(deletedPerson.room).emit('listPerson', users.getPersonsByRoom(deletedPerson.room));
    });

    // Private Messages
    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.for).emit('privateMessage', createMessage(person.name, data.message));
    })

});