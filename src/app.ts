// Plik ten jest punktem wejścia do aplikacji

// Improt nizbędnych nodułów i funkcji
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { DataSource } from "typeorm";
import authRoutes from "./routes/authRoutes";
import gameRoutes from "./routes/gameRoutes";
import { configureSocket } from "./services/socketService";
import "reflect-metadata";

// Utworzenie instancji aplikacji Express
const app = express();
// Utworzenie instancji serwera HTTP
const server = http.createServer(app);
const io = new Server(server);

app.use(cors()); // umożliwia żądania z innych domen (ważne dla aplikacji frontendowych).
app.use(express.json()); // pozwala na parsowanie ciał żądań JSON.

// Konfiguracja tras
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

// Konfiguracja Socket.io do komunikacji w czasie rzeczywistym
configureSocket(io);

const PORT = process.env.PORT || 3000;

// Tworzenie instancji DataSource

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "tic_tac_toe_user_ntat22gzthwoi", // własne dane dostępowe do bazy danych PostgreSQL
  password: "8VlqW1;ui}Q^j|$Po!r,x&Ky+W` &3H(AL3ALw6&(e(.TUmm", // tylko tu trzeba sprawdzić bo one też są podawane w ormconfif.json
  database: "tic_tac_toe_db",
  entities: ["src/models/**/*.ts"],
  synchronize: true,
  logging: false,
});

// Inicjalizacja połączenia z bazą danych
/*AppDataSource.initialize()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });*/

  AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});

export { app, io, AppDataSource };