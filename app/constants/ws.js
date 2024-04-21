import config from '#app/config.js';

const { userId } = config;

const { location, WebSocket, Set, setInterval, setTimeout } = globalThis;

let reconnectAttempts = 0;
const reconnectWait = 500;
const reconnectMaxWait = 8000;
const subscriptions = new Set();
const sendQueue = [];
const createWs = () => {
  const _ws = new WebSocket(location.href.replace('http', 'ws'));

  _ws.addEventListener('open', () => {
    let data;
    send({ type: 'setUserId', args: { id: userId } });
    while ((data = sendQueue.shift())) send(data);
  });

  _ws.addEventListener('message', message => {
    const data = JSON.parse(message.data);
    subscriptions.forEach(cb => cb(data));
  });

  _ws.addEventListener('close', () => {
    setTimeout(() => {
      ws = createWs();
    }, Math.min(reconnectWait * 2 ** reconnectAttempts++, reconnectMaxWait));
  });

  return _ws;
};

let ws = createWs();

// Heartbeat
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) ws.send('');
}, 30000);

const send = data => {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
  else sendQueue.push(data);
};

const subscribe = cb => {
  subscriptions.add(cb);
  return () => subscriptions.delete(cb);
};

export default { send, subscribe };
