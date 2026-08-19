import { apiRequest } from '../../lib/auth';

type BackendImage = {
    url: string;
    publicId?: string;
    alt?: string;
};

type BackendUser = {
    _id?: string;
    id?: string;
    name: string;
    username?: string;
    avatar?: BackendImage;
    location?: string;
    bio?: string;
};

export type BackendBookPost = {
    _id: string;
    id?: string;
    type: 'sell' | 'exchange' | 'donate';
    status: 'active' | 'sold' | 'exchanged' | 'unavailable';
    title: string;
    author: string;
    category: string;
    condition: string;
    officialBook?: {
        source?: 'open-library' | 'google-books' | 'manual';
        sourceId?: string;
        coverUrl?: string;
        title?: string;
        author?: string;
        description?: string;
    };
    frontImage: BackendImage;
    sellerImages: BackendImage[];
    price?: number;
    isNegotiable?: boolean;
    wantedBook?: {
        title: string;
        author?: string;
        officialBook?: {
            source?: 'open-library' | 'google-books' | 'manual';
            coverUrl?: string;
            description?: string;
        };
        frontImage?: BackendImage;
    };
    officialDescription?: string;
    sellerNote?: string;
    owner: BackendUser;
    location: string;
    createdAt: string;
};

export const getBookPost = (id: string) =>
    apiRequest<{ success: boolean; data: BackendBookPost }>(`/books/${id}`);
