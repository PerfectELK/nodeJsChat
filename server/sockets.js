"use strict";

const MessageModel = require('./models/messajes.model');

module.exports = io =>{

    io.on('connection', (socket) => {
        socket.emit('connected',"You are connected!");
        socket.join('all');
        socket.on('msg',(content) => {

            const message = {
                date: new Date(),
                content: content,
                username: socket.id,
            };

            MessageModel.create(message, (err, res) => {
                if(err) return console.error("MessageModel", err);

                socket.emit('message',message);
                socket.to('all').emit('message',message);
            });


        });

        socket.on('receiveHistory',() => {
            MessageModel
                .find({})
                .sort({date:-1})
                .limit(50)
                .sort({date:1})
                .lean()
                .exec((err,messages) => {
                    if(!err){
                        socket.emit('history',messages);
                    }

            });
        })
    });

}
