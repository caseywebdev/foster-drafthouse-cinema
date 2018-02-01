var _ = require('underscore');
var config = require('./config');
var express = require('express');
var socketIo = require('socket.io');

var app = express();

app.use(express.static('public'));

var server = app.listen(80);

var io = socketIo(server);

var votes = {};

var update = function () { io.emit('votes', votes); };

var sum = function (vote) {
  return _.reduce(vote, function (sum, n) { return sum + n; }, 0);
};

io.sockets.on('connection', function (socket) {
  update();

  socket.on('name', function (name) {
    socket.emit('name', socket.name = name);
  });

  socket.on('vote', function (id) {
    var name = socket.name;
    if (!name) return;
    if (!votes[name]) votes[name] = {};
    if (!votes[name][id]) votes[name][id] = 0;
    ++votes[name][id];
    if (sum(votes[name]) > config.votesAllowed) delete votes[name][id];
    if (!_.size(votes[name])) delete votes[name];
    update();
  });

  socket.on('clear', function (name) {
    if (!name) return;
    delete votes[name];
    update();
  });
});

process.on('SIGTERM', _.bind(process.exit, process, 0));
