import { atom } from "jotai";

export interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

// Atom initialized with a default bot message
export const messagesAtom = atom<Message[]>([
  {
    id: 1,
    sender: "bot",
    text: "Hello there! How can I help you today?",
  },
]);
