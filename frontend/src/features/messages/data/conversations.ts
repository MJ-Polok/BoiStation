export type ChatMessage = {
    id: string;
    sender: 'me' | 'other' | 'system';
    text: string;
    time: string;
};

export type Conversation = {
    id: string;
    userName: string;
    initials: string;
    avatarColor: string;
    bookId: string;
    bookTitle: string;
    bookAuthor: string;
    bookStatus: string;
    coverUrl?: string;
    coverColor: string;
    location: string;
    lastMessage: string;
    lastTime: string;
    unreadCount: number;
    messages: ChatMessage[];
};
