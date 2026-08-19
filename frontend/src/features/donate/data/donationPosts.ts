export type DonationPost = {
    id: string;
    title: string;
    author: string;
    category: string;
    condition: 'New' | 'Used' | 'Good' | 'Fair';
    city: string;
    location: string;
    donorName: string;
    donorInitials: string;
    donorColor: string;
    note: string;
    donated: boolean;
    coverUrl?: string;
    coverColor: string;
    accentColor: string;
};

export const donationCategories = [
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

export const donationLocations = [
    'All Locations',
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Rangpur',
    'Mymensingh',
    'Other',
];

export const donationPosts: DonationPost[] = [
    {
        id: 'story-books-bundle',
        title: 'Story Books Bundle',
        author: "Children's Collection",
        category: 'Children',
        condition: 'Good',
        city: 'Sylhet',
        location: 'Sylhet',
        donorName: 'Tasnim Noor',
        donorInitials: 'TN',
        donorColor: '#7DE3A5',
        note: 'Prefer local pickup from a nearby reader.',
        donated: false,
        coverColor: '#FFF3D6',
        accentColor: '#F4D35E',
    },
    {
        id: 'hsc-biology-guide',
        title: 'HSC Biology Guide',
        author: 'Academic Collection',
        category: 'Academic',
        condition: 'Fair',
        city: 'Dhaka',
        location: 'Uttara, Dhaka',
        donorName: 'Farhan Ahmed',
        donorInitials: 'FA',
        donorColor: '#93C5FD',
        note: 'Can hand over near Uttara on weekends.',
        donated: false,
        coverColor: '#EAF4EE',
        accentColor: '#7DE3A5',
    },
    {
        id: 'quran-translation',
        title: 'Quran Translation',
        author: 'Religious Collection',
        category: 'Religious',
        condition: 'New',
        city: 'Cumilla',
        location: 'Cumilla',
        donorName: 'Mahmudul Hasan',
        donorInitials: 'MH',
        donorColor: '#F4D35E',
        note: 'Available for pickup after evening.',
        donated: false,
        coverColor: '#F7F4EC',
        accentColor: '#A78BFA',
    },
    {
        id: 'english-novel-pack',
        title: 'English Novel Pack',
        author: 'Mixed Authors',
        category: 'Novel',
        condition: 'Used',
        city: 'Chattogram',
        location: 'Chattogram',
        donorName: 'Samiul Karim',
        donorInitials: 'SK',
        donorColor: '#A78BFA',
        note: 'Three novels together, pickup preferred.',
        donated: false,
        coverColor: '#EAF2FF',
        accentColor: '#93C5FD',
    },
    {
        id: 'job-prep-current-affairs',
        title: 'Current Affairs Notes',
        author: 'Job Prep Collection',
        category: 'Job Prep',
        condition: 'Good',
        city: 'Mymensingh',
        location: 'Mymensingh',
        donorName: 'Shuvo Das',
        donorInitials: 'SD',
        donorColor: '#7DE3A5',
        note: 'Useful for recent job preparation.',
        donated: false,
        coverColor: '#FAF8F2',
        accentColor: '#F9735B',
    },
    {
        id: 'class-six-books',
        title: 'Class Six Book Set',
        author: 'NCTB',
        category: 'Academic',
        condition: 'Fair',
        city: 'Rajshahi',
        location: 'Rajshahi',
        donorName: 'Maliha Islam',
        donorInitials: 'MI',
        donorColor: '#F9735B',
        note: 'Full set, some pages have notes.',
        donated: true,
        coverColor: '#F4EFE6',
        accentColor: '#F4D35E',
    },
];
