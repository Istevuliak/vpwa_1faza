// src/types/types.ts

export interface Message {
  id: number;
  user: string;
  text: string;
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  messages?: Message[];
}

export interface Channel {
  id: number;
  name: string;
  messages: Message[];
  members?: number[];
  isAdmin?: boolean;
}

export interface Invitation {
  id: number;
  from: string;
  channel: string;
}
