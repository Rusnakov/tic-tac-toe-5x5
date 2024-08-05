import { Request, Response } from "express";

export const startGame = (req: Request, res:Response) => {
    // Logika rozpoczęcia nowej gry
    res.json({ message: "Nowa gra rozpoczęta"});
};

export const makeMove = (req: Request, res: Response) => {
    // Logika wykonania ruchu
    res.json({ message: "Ruch wykonany"});
};

export const getGameState = (req: Request, res: Response) => {
    // Logika pobierania stanu gry
    res.json({ message: "Stan gry" });
} ;