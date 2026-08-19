export type ExchangePost = {
    id: string;
    offeredTitle: string;
    offeredAuthor: string;
    wantedTitle: string;
    wantedAuthor: string;
    category: string;
    location: string;
    sellerName: string;
    sellerInitials: string;
    sellerColor: string;
    exchanged: boolean;
    offeredCoverUrl?: string;
    wantedCoverUrl?: string;
    offeredCoverColor: string;
    wantedCoverColor: string;
    photoColors: string[];
    photoUrls?: string[];
};

export const exchangeCategories = [
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
