import { atomWithStorage, splitAtom } from 'jotai/utils';

export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const defaultMessages: Message[] = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hello there! How can I help you today?',
  },
];

export const messagesAtom = atomWithStorage<Message[]>('lms:chat-messages', defaultMessages);

export const messageItemsAtom = splitAtom(messagesAtom);
