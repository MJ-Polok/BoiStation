import { apiRequest } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';

type BackendImage = {
    url?: string;
    publicId?: string;
};

type BackendUser = {
    _id?: string;
    id?: string;
    name: string;
    username?: string;
    avatar?: BackendImage;
    location?: string;
};

export type BackendConversation = {
    _id: string;
    id?: string;
    buyer: BackendUser;
    seller: BackendUser;
    bookPost: Pick<
        BackendBookPost,
        '_id' | 'id' | 'title' | 'author' | 'type' | 'status' | 'frontImage' | 'price' | 'isNegotiable' | 'wantedBook'
    >;
    lastMessage?: string;
    lastMessageAt?: string;
    readBy?: string[];
    createdAt: string;
    updatedAt: string;
};

export type BackendMessage = {
    _id: string;
    id?: string;
    sender?: BackendUser | null;
    type: 'text' | 'image' | 'system';
    text: string;
    createdAt: string;
};

export const listConversations = () =>
    apiRequest<{ success: boolean; data: BackendConversation[] }>('/conversations', {
        auth: true,
    });

export const createConversation = (bookPostId: string) =>
    apiRequest<{ success: boolean; data: BackendConversation }>('/conversations', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ bookPostId }),
    });

export const listMessages = (conversationId: string) =>
    apiRequest<{ success: boolean; data: BackendMessage[] }>(`/conversations/${conversationId}/messages`, {
        auth: true,
    });

export const sendConversationMessage = (conversationId: string, text: string) =>
    apiRequest<{ success: boolean; data: BackendMessage }>(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ text }),
    });

export const markConversationRead = (conversationId: string) =>
    apiRequest<{ success: boolean; message: string }>(`/conversations/${conversationId}/read`, {
        method: 'PATCH',
        auth: true,
    });
