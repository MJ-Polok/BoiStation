import { apiRequest } from '../../lib/auth';

export type OfficialBookResult = {
    source: 'open-library';
    sourceId: string;
    title: string;
    author: string;
    publisherYear: string;
    coverUrl?: string;
    description?: string;
    openLibraryKey?: string;
    isbn?: string;
};

export type UploadedImage = {
    url: string;
    publicId?: string;
    alt?: string;
};

export type CreateBookPostPayload = {
    type: 'sell' | 'exchange';
    title: string;
    author: string;
    category: string;
    condition: string;
    officialBook?: {
        source: 'open-library' | 'manual';
        sourceId?: string;
        coverUrl?: string;
        title?: string;
        author?: string;
        description?: string;
    };
    frontImage: UploadedImage;
    sellerImages: UploadedImage[];
    price?: number;
    isNegotiable?: boolean;
    priceReason?: string;
    pricingRuleAccepted?: boolean;
    wantedBook?: {
        title: string;
        author: string;
        officialBook?: {
            source: 'open-library' | 'manual';
            sourceId?: string;
            coverUrl?: string;
            title?: string;
            author?: string;
            description?: string;
        };
        frontImage?: UploadedImage;
    };
    officialDescription?: string;
    sellerNote?: string;
    location: string;
    pickupInfo: {
        contactName: string;
        phone: string;
        division: string;
        district: string;
        upazila: string;
        area: string;
        address: string;
        note?: string;
    };
};

export const searchOfficialBooks = (query: string) =>
    apiRequest<{ success: boolean; data: OfficialBookResult[] }>(
        `/book-search?q=${encodeURIComponent(query)}&limit=6`,
    );

export const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    return apiRequest<{ success: boolean; data: UploadedImage[] }>('/uploads/images', {
        method: 'POST',
        body: formData,
        auth: true,
    });
};

export const createBookPost = (payload: CreateBookPostPayload) =>
    apiRequest<{ success: boolean; data: { _id: string } }>('/books', {
        method: 'POST',
        body: JSON.stringify(payload),
        auth: true,
    });
