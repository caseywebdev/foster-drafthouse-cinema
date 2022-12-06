import fs from 'node:fs';
import http from 'node:http';

import { WebSocketServer } from 'ws';

import actorNames from 'api/constants/actor-names.js';

const { clearInterval, clearTimeout, setInterval, setTimeout } = globalThis;

const server = http.createServer((request, response) => {
  const maybeBr = request.headers['accept-encoding']
    ?.split(/\s*,\s*/)
    .includes('br')
    ? '.br'
    : '';
  if (maybeBr) response.setHeader('Content-Encoding', 'br');
  fs.createReadStream(`dist/index.html${maybeBr}`).pipe(response);
});

const wss = new WebSocketServer({ server });

const state = {
  usersById: {}
};

const broadcast = () =>
  wss.clients.forEach(ws => ws.send(JSON.stringify(state)));

wss.on('connection', ws => {
  let user;

  const actions = {
    load: () => {},

    setEmperorName: ({ emperorName }) => {
      user.emperorName = emperorName;
    },

    setUserId: ({ id }) => {
      user = state.usersById[id] ??= { id, votes: [] };
      user.name ??= actorNames[Math.floor(Math.random() * actorNames.length)];
    },

    setUserName: ({ name }) => {
      user.name = name?.trim();
    },

    resetUserVotes: ({ id }) => {
      const user = state.usersById[id];
      if (user) user.votes = [];
    },

    vote: ({ id }) => {
      if (user.votes.length < 5) return user.votes.push(id);

      if (user.votes.includes(id)) {
        user.votes = user.votes.filter(_id => _id !== id);
      }
    }
  };

  ws.on('error', er => console.error(er));

  const pingIntervalId = setInterval(() => ws.ping(), 30000);
  let heartbeatTimeoutId;
  const heartbeat = () => {
    clearTimeout(heartbeatTimeoutId);
    heartbeatTimeoutId = setTimeout(() => ws.terminate(), 35000);
  };
  heartbeat();
  ws.on('pong', heartbeat);

  ws.on('message', async message => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      // noop
    }
    if (!data) return;

    const action = actions[data.type];
    if (!action || (!user && data.type !== 'setUserId')) return;

    action(data.args || {});

    broadcast();
  });

  ws.on('close', async () => {
    clearInterval(pingIntervalId);
    clearTimeout(heartbeatTimeoutId);
  });
});

server.listen(80);
