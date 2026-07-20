import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  autoConnect: false,
});

export const connectToShop = (shopId) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit('joinRoom', `shop_${shopId}`);
};

export default socket;
