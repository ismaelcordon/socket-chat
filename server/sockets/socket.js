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
        client.join(data.sala);

        users.addPerson(client.id, data.name);
        client.to(data.room).emit('listPerson', users.getPersonsByRoom(data.room));
        callback(users.getPersonsByRoom(data.room));
    });

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id);
        console.log(person)
        let message = createMessage(person.name, data.message);
        client.to(person.room).emit('createMessage', message);
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