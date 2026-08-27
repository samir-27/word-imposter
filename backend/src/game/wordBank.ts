// backend/src/game/wordBank.ts
import { WordPair } from "../types/socket.js";

export const WORD_PAIRS: WordPair[] = [
  {
    id: "1",
    category: "Food",
    innocentWord: "Pizza",
    imposterWord: "Burger",
  },
  {
    id: "2",
    category: "Animals",
    innocentWord: "Dog",
    imposterWord: "Wolf",
  },
  {
    id: "3",
    category: "Vehicles",
    innocentWord: "Airplane",
    imposterWord: "Helicopter",
  },
  {
    id: "4",
    category: "Technology",
    innocentWord: "Laptop",
    imposterWord: "Tablet",
  },
  {
    id: "5",
    category: "Sports",
    innocentWord: "Cricket",
    imposterWord: "Baseball",
  },
];

export function getRandomWordPair(): WordPair {
  const index = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[index];
}