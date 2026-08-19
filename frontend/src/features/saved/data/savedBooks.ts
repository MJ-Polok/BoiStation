export type SavedBook = {
    id: string;
    title: string;
    author: string;
    type: 'For Sale' | 'Exchange';
    condition: 'New' | 'Used' | 'Good' | 'Fair';
    priceLabel: string;
    location: string;
    category: string;
    coverUrl?: string;
    coverColor: string;
    accentColor: string;
};
