export type DivisionName =
    | 'Barishal'
    | 'Chattogram'
    | 'Dhaka'
    | 'Khulna'
    | 'Mymensingh'
    | 'Rajshahi'
    | 'Rangpur'
    | 'Sylhet';

export const divisions: DivisionName[] = [
    'Barishal',
    'Chattogram',
    'Dhaka',
    'Khulna',
    'Mymensingh',
    'Rajshahi',
    'Rangpur',
    'Sylhet',
];

export const districtsByDivision: Record<DivisionName, string[]> = {
    Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
    Chattogram: [
        'Bandarban',
        'Brahmanbaria',
        'Chandpur',
        'Chattogram',
        "Cox's Bazar",
        'Cumilla',
        'Feni',
        'Khagrachhari',
        'Lakshmipur',
        'Noakhali',
        'Rangamati',
    ],
    Dhaka: [
        'Dhaka',
        'Faridpur',
        'Gazipur',
        'Gopalganj',
        'Kishoreganj',
        'Madaripur',
        'Manikganj',
        'Munshiganj',
        'Narayanganj',
        'Narsingdi',
        'Rajbari',
        'Shariatpur',
        'Tangail',
    ],
    Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
    Rajshahi: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],
    Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
    Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
};

export const upazilasByDistrict: Record<string, string[]> = {
    Dhaka: ['Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar', 'Dhaka Metro'],
    Gazipur: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
    Narayanganj: ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'],
    Tangail: ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar'],
    Chattogram: ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Karnaphuli', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda', 'Chattogram Metro'],
    Cumilla: ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Sadar', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna', 'Monohorgonj', 'Muradnagar', 'Nangalkot', 'Titas'],
    Rajshahi: ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore', 'Rajshahi Metro'],
    Bogura: ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'],
    Khulna: ['Batiaghata', 'Dacope', 'Dighalia', 'Dumuria', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsha', 'Terokhada', 'Khulna Metro'],
    Jashore: ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
    Barishal: ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Barishal Sadar', 'Gournadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
    Mymensingh: ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Mymensingh Sadar', 'Nandail', 'Phulpur', 'Trishal'],
    Rangpur: ['Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Rangpur Sadar', 'Taraganj'],
    Sylhet: ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Sylhet Sadar', 'Zakiganj'],
};

export const getDistrictsForDivision = (division: string) =>
    districtsByDivision[division as DivisionName] || [];

export const getUpazilasForDistrict = (district: string) =>
    upazilasByDistrict[district] || ['Sadar', 'Metro', 'Other'];
