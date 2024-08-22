import { captureRejectionSymbol } from "events";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface Room {
  id: string;
  players: string[];
  board: (string | null)[];
  currentTurn: string;
}

interface GameMove {
  roomId: string;
  playerId: string;
  position: number;
}

const rooms: Map<string, Room> = new Map();

export const configureSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("createRoom", (callback: (roomId: string) => void) => {
      const roomId = uuidv4();
      const room: Room = {
        id: roomId,
        players: [socket.id],
        board: Array(9).fill(null),
        currentTurn: socket.id,
      };
      rooms.set(roomId, room);
      socket.join(roomId);
      callback(roomId);
      console.log(`Room created: ${roomId}`);
    });

    socket.on(
      "joinRoom",
      (roomId: string, callback: (succes: boolean) => void) => {
        const room = rooms.get(roomId);
        if (room && room.players.length < 2) {
          room.players.push(socket.id);
          socket.join(roomId);
          io.to(roomId).emit("playerJoined", { playerId: socket.id, roomId });
          callback(true);
          console.log(`Player ${socket.id} joined room ${roomId}`);
        } else {
          callback(false);
          console.log(`Failed to join room ${roomId}`);
        }
      }
    );

    socket.on("makeMove", (move: GameMove) => {
      const room = rooms.get(move.roomId);
      if (
        room &&
        room.currentTurn === move.playerId &&
        room.board[move.position] === null
      ) {
        const playerIndex = room.players.indexOf(move.playerId);
        const symbol = playerIndex === 0 ? "X" : "O";
        room.board[move.position] = symbol;
        room.currentTurn = room.players[(playerIndex + 1) % 2];

        io.to(move.roomId).emit("gameUpdate", {
          board: room.board,
          currentTurn: room.currentTurn,
        });

        const winner = checkWinner(room.board);
        if (winner) {
          io.to(move.roomId).emit("gameOver", { winner: move.playerId });
          console.log(
            "Game over in room ${move.roomId}. Winner: ${move.playerId}"
          );
        } else if (room.board.every((cell) => cell !== null)) {
          io.to(move.roomId).emit("gameOver", { winner: "draw" });
          console.log(`Game over in room ${move.roomId}. It's a draw.`);
        }
      }
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        if (room.players.includes(socket.id)) {
          room.players = room.players.filter((id) => id !== socket.id);
          if (room.players.length === 0) {
            rooms.delete(roomId);
            console.log(`Player ${socket.id} left room ${roomId}`);
          }
        }
      });
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

function checkWinner(board: (string | null)[]): boolean {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //Columns
    [0, 4, 8],
    [2, 4, 6], //Diagonal
  ];

  return winningCombinations.some((combination) => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}
