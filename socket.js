import { io } from 'socket.io-client'

const url = `${window.location.hostname}:5000`
export const socket = io(url)