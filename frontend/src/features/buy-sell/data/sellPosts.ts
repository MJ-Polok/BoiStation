export type SellPost = {
    id: string;
    title: string;
    author: string;
    category: string;
    price: number;
    priceLabel: string;
    condition: 'New' | 'Used' | 'Good' | 'Fair';
    location: string;
    sellerName: string;
    sellerUsername?: string;
    sellerInitials: string;
    sellerColor: string;
    negotiable: boolean;
    sold: boolean;
    databaseMatched: boolean;
    coverUrl?: string;
    coverColor: string;
    photoColors: string[];
    photoUrls?: string[];
};

export const categories = [
    'All Categories',
    'Academic',
    'Novel',
    'Story Book',
    'Children',
    'Religious',
    'Career',
    'Admission',
    'Job Prep',
    'Other',
];

export const priceRanges = [
    'Any Price',
    'Under ৳200',
    '৳200 - ৳500',
    '৳500 - ৳1000',
    'Above ৳1000',
];
