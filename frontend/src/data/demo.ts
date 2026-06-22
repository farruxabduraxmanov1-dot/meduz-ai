// MedUZ AI — Demo data (doctors, organizations, pharmacies, services, reviews)
export type City = "Tashkent" | "Andijan" | "Namangan" | "Fergana" | "Samarkand" | "Bukhara";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  yearsExp: number;
  price: number; // UZS thousands
  online: boolean;
  offline: boolean;
  homeVisit: boolean;
  city: City;
  distanceKm: number;
  workplaces: string[];
  organizationIds: string[];
  bio: string;
  languages: string[];
  featured?: boolean;
};

export type Organization = {
  id: string;
  name: string;
  type:
    | "Private Clinic"
    | "Public Hospital"
    | "Polyclinic"
    | "Specialized Center"
    | "Regional Hospital"
    | "Family Medicine Center";
  ownership: "private" | "public";
  logo: string;
  hero: string;
  rating: number;
  reviewsCount: number;
  city: City;
  address: string;
  distanceKm: number;
  phone: string;
  hours: string;
  doctorsCount: number;
  departments: string[];
  description: string;
  featured?: boolean;
};

export type Pharmacy = {
  id: string;
  name: string;
  city: City;
  address: string;
  distanceKm: number;
  phone: string;
  hours: string;
  open: boolean;
  logo: string;
};

export type Medicine = {
  id: string;
  name: string;
  generic: string;
  description: string;
  usage: string;
  priceMin: number;
  priceMax: number;
  pharmacyIds: string[];
  image: string;
};

export type MedicalService = {
  id: string;
  name: string;
  serviceType: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  price: number;
  homeVisit: boolean;
  city: City;
  distanceKm: number;
  experience: number;
  bio: string;
  gallery: string[];
  featured?: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
};

// ===== DOCTORS (20) =====
const DOCTOR_PHOTOS = [
  "https://images.pexels.com/photos/32160037/pexels-photo-32160037.jpeg",
  "https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54",
  "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31",
];

export const DOCTORS: Doctor[] = [
  {
    id: "dr-001",
    name: "Dr. Akmal Karimov",
    specialty: "Kardiolog",
    photo: DOCTOR_PHOTOS[0],
    rating: 4.9,
    reviewsCount: 184,
    yearsExp: 17,
    price: 250,
    online: true,
    offline: true,
    homeVisit: true,
    city: "Tashkent",
    distanceKm: 2.4,
    workplaces: ["Andijan Regional Hospital", "Medion Private Clinic"],
    organizationIds: ["org-001", "org-006"],
    bio: "Senior cardiologist with international training, specializing in interventional cardiology and heart failure management.",
    languages: ["Uzbek", "Russian", "English"],
    featured: true,
  },
  {
    id: "dr-002",
    name: "Dr. Madina Yusupova",
    specialty: "Pediatr",
    photo: DOCTOR_PHOTOS[6],
    rating: 4.8,
    reviewsCount: 312,
    yearsExp: 12,
    price: 180,
    online: true,
    offline: true,
    homeVisit: true,
    city: "Tashkent",
    distanceKm: 1.1,
    workplaces: ["Children's Republican Hospital"],
    organizationIds: ["org-002"],
    bio: "Pediatrician focused on newborn and child wellness, vaccination programs and respiratory illnesses.",
    languages: ["Uzbek", "Russian"],
    featured: true,
  },
  {
    id: "dr-003",
    name: "Dr. Bobur Tursunov",
    specialty: "Nevrolog",
    photo: DOCTOR_PHOTOS[1],
    rating: 4.7,
    reviewsCount: 96,
    yearsExp: 15,
    price: 220,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Samarkand",
    distanceKm: 5.2,
    workplaces: ["Samarkand Medical Institute"],
    organizationIds: ["org-007"],
    bio: "Neurologist with deep expertise in stroke care, migraine and movement disorders.",
    languages: ["Uzbek", "Russian", "English"],
  },
  {
    id: "dr-004",
    name: "Dr. Nilufar Ergasheva",
    specialty: "Dermatologist",
    photo: DOCTOR_PHOTOS[7],
    rating: 4.9,
    reviewsCount: 241,
    yearsExp: 10,
    price: 200,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 3.0,
    workplaces: ["Derma Clinic Tashkent"],
    organizationIds: ["org-003"],
    bio: "Aesthetic and clinical dermatology, laser treatments and pediatric skin conditions.",
    languages: ["Uzbek", "Russian"],
    featured: true,
  },
  {
    id: "dr-005",
    name: "Dr. Sherzod Rahimov",
    specialty: "Plastik Jarroh",
    photo: DOCTOR_PHOTOS[2],
    rating: 4.8,
    reviewsCount: 87,
    yearsExp: 18,
    price: 400,
    online: false,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 4.5,
    workplaces: ["Vita Beauty Clinic"],
    organizationIds: ["org-008"],
    bio: "Board-certified plastic surgeon — facial reconstructive and aesthetic procedures.",
    languages: ["Uzbek", "Russian", "Turkish"],
  },
  {
    id: "dr-006",
    name: "Dr. Dilnoza Abdullaeva",
    specialty: "Ginekolog",
    photo: DOCTOR_PHOTOS[8],
    rating: 4.9,
    reviewsCount: 423,
    yearsExp: 20,
    price: 230,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Bukhara",
    distanceKm: 6.7,
    workplaces: ["Women's Health Center Bukhara"],
    organizationIds: ["org-009"],
    bio: "Senior obstetrician-gynecologist with experience in high-risk pregnancies.",
    languages: ["Uzbek", "Russian"],
    featured: true,
  },
  {
    id: "dr-007",
    name: "Dr. Jasur Mamatov",
    specialty: "LOR",
    photo: DOCTOR_PHOTOS[3],
    rating: 4.6,
    reviewsCount: 138,
    yearsExp: 11,
    price: 170,
    online: true,
    offline: true,
    homeVisit: true,
    city: "Andijan",
    distanceKm: 2.0,
    workplaces: ["Andijan Regional Hospital"],
    organizationIds: ["org-001"],
    bio: "ENT specialist treating chronic sinusitis, hearing loss and pediatric ear infections.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-008",
    name: "Dr. Aziza Khalilova",
    specialty: "Endokrinolog",
    photo: DOCTOR_PHOTOS[9],
    rating: 4.7,
    reviewsCount: 156,
    yearsExp: 13,
    price: 210,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Namangan",
    distanceKm: 3.4,
    workplaces: ["Namangan Endocrine Center"],
    organizationIds: ["org-010"],
    bio: "Endocrinologist managing diabetes, thyroid disorders and metabolic syndrome.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-009",
    name: "Dr. Otabek Saidov",
    specialty: "Ortoped",
    photo: DOCTOR_PHOTOS[4],
    rating: 4.8,
    reviewsCount: 201,
    yearsExp: 16,
    price: 280,
    online: false,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 5.8,
    workplaces: ["National Orthopedic Center"],
    organizationIds: ["org-011"],
    bio: "Orthopedic surgeon — joint replacements, sports injuries and trauma.",
    languages: ["Uzbek", "Russian", "English"],
  },
  {
    id: "dr-010",
    name: "Dr. Gulnora Tashkentova",
    specialty: "Umumiy amaliyot shifokori",
    photo: DOCTOR_PHOTOS[6],
    rating: 4.9,
    reviewsCount: 367,
    yearsExp: 22,
    price: 120,
    online: true,
    offline: true,
    homeVisit: true,
    city: "Tashkent",
    distanceKm: 1.6,
    workplaces: ["Family Polyclinic No. 12"],
    organizationIds: ["org-004"],
    bio: "Family doctor — preventive care, chronic disease and pediatric medicine.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-011",
    name: "Dr. Rustam Ergashev",
    specialty: "Bolalar Jarrohi",
    photo: DOCTOR_PHOTOS[1],
    rating: 4.7,
    reviewsCount: 98,
    yearsExp: 14,
    price: 260,
    online: false,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 4.1,
    workplaces: ["Children's Republican Hospital"],
    organizationIds: ["org-002"],
    bio: "Pediatric surgeon — congenital anomalies and elective pediatric surgery.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-012",
    name: "Dr. Zarina Komilova",
    specialty: "Psixiatr",
    photo: DOCTOR_PHOTOS[7],
    rating: 4.8,
    reviewsCount: 142,
    yearsExp: 11,
    price: 240,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 3.7,
    workplaces: ["Mind Wellness Clinic"],
    organizationIds: ["org-012"],
    bio: "Psychiatrist focused on anxiety, depression and cognitive-behavioral therapy.",
    languages: ["Uzbek", "Russian", "English"],
  },
  {
    id: "dr-013",
    name: "Dr. Farrukh Iskandarov",
    specialty: "Urolog",
    photo: DOCTOR_PHOTOS[2],
    rating: 4.6,
    reviewsCount: 76,
    yearsExp: 13,
    price: 220,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Fergana",
    distanceKm: 2.9,
    workplaces: ["Fergana Regional Medical Center"],
    organizationIds: ["org-013"],
    bio: "Urologist treating kidney stones, BPH and minimally invasive surgery.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-014",
    name: "Dr. Lola Khasanova",
    specialty: "Oftalmolog",
    photo: DOCTOR_PHOTOS[8],
    rating: 4.9,
    reviewsCount: 219,
    yearsExp: 19,
    price: 200,
    online: false,
    offline: true,
    homeVisit: false,
    city: "Samarkand",
    distanceKm: 1.8,
    workplaces: ["Samarkand Eye Institute"],
    organizationIds: ["org-014"],
    bio: "Ophthalmologist — cataract surgery, retinal diseases, pediatric ophthalmology.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-015",
    name: "Dr. Sardor Mirzaev",
    specialty: "Gastroenterolog",
    photo: DOCTOR_PHOTOS[3],
    rating: 4.7,
    reviewsCount: 113,
    yearsExp: 12,
    price: 230,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 4.6,
    workplaces: ["Tashkent GI Center"],
    organizationIds: ["org-015"],
    bio: "Gastroenterologist — endoscopy, IBD and liver diseases.",
    languages: ["Uzbek", "Russian", "English"],
  },
  {
    id: "dr-016",
    name: "Dr. Shahnoza Bekova",
    specialty: "Revmatolog",
    photo: DOCTOR_PHOTOS[9],
    rating: 4.8,
    reviewsCount: 84,
    yearsExp: 10,
    price: 200,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 5.1,
    workplaces: ["Medion Private Clinic"],
    organizationIds: ["org-006"],
    bio: "Rheumatologist — autoimmune diseases, arthritis and osteoporosis.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-017",
    name: "Dr. Khasan Sobirov",
    specialty: "Pulmonolog",
    photo: DOCTOR_PHOTOS[4],
    rating: 4.6,
    reviewsCount: 67,
    yearsExp: 14,
    price: 210,
    online: true,
    offline: true,
    homeVisit: true,
    city: "Namangan",
    distanceKm: 3.0,
    workplaces: ["Namangan Lung Clinic"],
    organizationIds: ["org-010"],
    bio: "Pulmonologist — asthma, COPD and post-viral respiratory recovery.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-018",
    name: "Dr. Kamola Nizamova",
    specialty: "Allergolog",
    photo: DOCTOR_PHOTOS[7],
    rating: 4.8,
    reviewsCount: 121,
    yearsExp: 9,
    price: 190,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 2.3,
    workplaces: ["Allergy & Immunology Center"],
    organizationIds: ["org-008"],
    bio: "Allergist managing chronic urticaria, food allergies and immunotherapy.",
    languages: ["Uzbek", "Russian", "English"],
  },
  {
    id: "dr-019",
    name: "Dr. Murod Nazarov",
    specialty: "Stomatolog",
    photo: DOCTOR_PHOTOS[1],
    rating: 4.9,
    reviewsCount: 412,
    yearsExp: 15,
    price: 150,
    online: false,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 1.9,
    workplaces: ["Smile Studio Tashkent"],
    organizationIds: ["org-005"],
    bio: "Dentist — implants, orthodontics and pediatric dentistry.",
    languages: ["Uzbek", "Russian"],
  },
  {
    id: "dr-020",
    name: "Dr. Asal Ravshanova",
    specialty: "Nutritsiolog",
    photo: DOCTOR_PHOTOS[8],
    rating: 4.7,
    reviewsCount: 156,
    yearsExp: 8,
    price: 130,
    online: true,
    offline: true,
    homeVisit: false,
    city: "Tashkent",
    distanceKm: 3.5,
    workplaces: ["Vita Wellness Clinic"],
    organizationIds: ["org-008"],
    bio: "Clinical nutritionist for weight management, diabetes and sports nutrition.",
    languages: ["Uzbek", "Russian"],
  },
];

// ===== ORGANIZATIONS (15) =====
const HOSPITAL_PHOTOS = [
  "https://images.pexels.com/photos/33812025/pexels-photo-33812025.jpeg",
  "https://images.unsplash.com/photo-1587351021355-a479a299d2f9",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  "https://images.unsplash.com/photo-1551076805-e1869033e561",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
];

export const ORGANIZATIONS: Organization[] = [
  {
    id: "org-001",
    name: "Andijan Regional Hospital",
    type: "Regional Hospital",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[1],
    hero: HOSPITAL_PHOTOS[1],
    rating: 4.5,
    reviewsCount: 287,
    city: "Andijan",
    address: "Andijan, Navoiy 78",
    distanceKm: 2.1,
    phone: "+998 74 222 31 11",
    hours: "24/7",
    doctorsCount: 142,
    departments: ["Cardiology", "Pediatrics", "ENT", "Surgery", "Emergency", "Neurology"],
    description: "Largest public regional hospital serving the Andijan region with 24/7 emergency services.",
  },
  {
    id: "org-002",
    name: "Children's Republican Hospital",
    type: "Specialized Center",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[2],
    hero: HOSPITAL_PHOTOS[2],
    rating: 4.7,
    reviewsCount: 521,
    city: "Tashkent",
    address: "Tashkent, Yunusabad 4",
    distanceKm: 3.8,
    phone: "+998 71 233 44 55",
    hours: "24/7",
    doctorsCount: 220,
    departments: ["Pediatrics", "Pediatric Surgery", "Neonatology", "Oncology", "Cardiology"],
    description: "National referral center for pediatric medicine and surgery.",
    featured: true,
  },
  {
    id: "org-003",
    name: "Derma Clinic Tashkent",
    type: "Private Clinic",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[3],
    hero: HOSPITAL_PHOTOS[3],
    rating: 4.8,
    reviewsCount: 198,
    city: "Tashkent",
    address: "Tashkent, Mirzo Ulugbek 15",
    distanceKm: 2.9,
    phone: "+998 71 200 11 22",
    hours: "08:00–22:00",
    doctorsCount: 18,
    departments: ["Dermatology", "Cosmetology", "Laser Therapy"],
    description: "Premium dermatology and aesthetic clinic with European-trained specialists.",
  },
  {
    id: "org-004",
    name: "Family Polyclinic No. 12",
    type: "Polyclinic",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[5],
    hero: HOSPITAL_PHOTOS[5],
    rating: 4.3,
    reviewsCount: 412,
    city: "Tashkent",
    address: "Tashkent, Chilanzar 6",
    distanceKm: 1.5,
    phone: "+998 71 277 88 99",
    hours: "07:00–20:00",
    doctorsCount: 67,
    departments: ["Family Medicine", "Pediatrics", "Lab", "Vaccination"],
    description: "Neighborhood family polyclinic for everyday primary care.",
  },
  {
    id: "org-005",
    name: "Smile Studio Tashkent",
    type: "Private Clinic",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[4],
    hero: HOSPITAL_PHOTOS[4],
    rating: 4.9,
    reviewsCount: 312,
    city: "Tashkent",
    address: "Tashkent, Yashnabod 22",
    distanceKm: 1.8,
    phone: "+998 71 200 77 33",
    hours: "09:00–21:00",
    doctorsCount: 12,
    departments: ["Dentistry", "Orthodontics", "Implants"],
    description: "Modern boutique dental studio with cutting-edge equipment.",
  },
  {
    id: "org-006",
    name: "Medion Private Clinic",
    type: "Private Clinic",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[6],
    hero: HOSPITAL_PHOTOS[6],
    rating: 4.7,
    reviewsCount: 256,
    city: "Tashkent",
    address: "Tashkent, Shaykhantakhur 7",
    distanceKm: 4.4,
    phone: "+998 71 233 11 00",
    hours: "08:00–22:00",
    doctorsCount: 54,
    departments: ["Cardiology", "Rheumatology", "Endocrinology", "Surgery"],
    description: "Multi-specialty private clinic with full diagnostics.",
    featured: true,
  },
  {
    id: "org-007",
    name: "Samarkand Medical Institute",
    type: "Public Hospital",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[0],
    hero: HOSPITAL_PHOTOS[0],
    rating: 4.4,
    reviewsCount: 188,
    city: "Samarkand",
    address: "Samarkand, Amir Temur 18",
    distanceKm: 5.1,
    phone: "+998 66 235 22 22",
    hours: "24/7",
    doctorsCount: 178,
    departments: ["Neurology", "Surgery", "Cardiology", "Internal Medicine"],
    description: "Academic medical institute combining teaching, research and patient care.",
  },
  {
    id: "org-008",
    name: "Vita Beauty Clinic",
    type: "Private Clinic",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[3],
    hero: HOSPITAL_PHOTOS[3],
    rating: 4.8,
    reviewsCount: 144,
    city: "Tashkent",
    address: "Tashkent, Mirabad 33",
    distanceKm: 3.2,
    phone: "+998 71 200 50 50",
    hours: "10:00–22:00",
    doctorsCount: 22,
    departments: ["Plastic Surgery", "Cosmetology", "Allergy"],
    description: "Premium aesthetic and wellness clinic with VIP service.",
  },
  {
    id: "org-009",
    name: "Women's Health Center Bukhara",
    type: "Specialized Center",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[2],
    hero: HOSPITAL_PHOTOS[2],
    rating: 4.6,
    reviewsCount: 167,
    city: "Bukhara",
    address: "Bukhara, Bahouddin Naqshband 12",
    distanceKm: 6.2,
    phone: "+998 65 224 11 22",
    hours: "08:00–20:00",
    doctorsCount: 28,
    departments: ["Gynecology", "Obstetrics", "Ultrasound", "Family Planning"],
    description: "Dedicated women's health center with maternity services.",
  },
  {
    id: "org-010",
    name: "Namangan Endocrine Center",
    type: "Specialized Center",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[5],
    hero: HOSPITAL_PHOTOS[5],
    rating: 4.5,
    reviewsCount: 92,
    city: "Namangan",
    address: "Namangan, Uychi 5",
    distanceKm: 3.0,
    phone: "+998 69 234 88 77",
    hours: "08:00–18:00",
    doctorsCount: 26,
    departments: ["Endocrinology", "Diabetology", "Pulmonology"],
    description: "Regional reference center for endocrine and metabolic disorders.",
  },
  {
    id: "org-011",
    name: "National Orthopedic Center",
    type: "Specialized Center",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[1],
    hero: HOSPITAL_PHOTOS[1],
    rating: 4.7,
    reviewsCount: 234,
    city: "Tashkent",
    address: "Tashkent, Sergeli 18",
    distanceKm: 5.6,
    phone: "+998 71 290 12 12",
    hours: "08:00–20:00",
    doctorsCount: 41,
    departments: ["Orthopedics", "Trauma", "Sports Medicine", "Rehabilitation"],
    description: "Top national center for orthopedic and trauma surgery.",
  },
  {
    id: "org-012",
    name: "Mind Wellness Clinic",
    type: "Private Clinic",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[6],
    hero: HOSPITAL_PHOTOS[6],
    rating: 4.9,
    reviewsCount: 142,
    city: "Tashkent",
    address: "Tashkent, Mirabad 7",
    distanceKm: 3.4,
    phone: "+998 71 200 44 44",
    hours: "09:00–21:00",
    doctorsCount: 14,
    departments: ["Psychiatry", "Psychology", "CBT"],
    description: "Modern mental wellness clinic with private and online sessions.",
  },
  {
    id: "org-013",
    name: "Fergana Regional Medical Center",
    type: "Regional Hospital",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[0],
    hero: HOSPITAL_PHOTOS[0],
    rating: 4.4,
    reviewsCount: 198,
    city: "Fergana",
    address: "Fergana, Mustaqillik 44",
    distanceKm: 2.7,
    phone: "+998 73 244 88 99",
    hours: "24/7",
    doctorsCount: 156,
    departments: ["Urology", "Surgery", "Cardiology", "Pediatrics", "Emergency"],
    description: "Largest hospital in Fergana valley serving the region.",
  },
  {
    id: "org-014",
    name: "Samarkand Eye Institute",
    type: "Specialized Center",
    ownership: "public",
    logo: HOSPITAL_PHOTOS[2],
    hero: HOSPITAL_PHOTOS[2],
    rating: 4.8,
    reviewsCount: 311,
    city: "Samarkand",
    address: "Samarkand, Registan 9",
    distanceKm: 1.7,
    phone: "+998 66 232 11 33",
    hours: "08:00–18:00",
    doctorsCount: 38,
    departments: ["Ophthalmology", "Pediatric Eye Care", "Laser Eye Surgery"],
    description: "World-class eye institute offering corneal and retinal procedures.",
  },
  {
    id: "org-015",
    name: "Tashkent GI Center",
    type: "Specialized Center",
    ownership: "private",
    logo: HOSPITAL_PHOTOS[3],
    hero: HOSPITAL_PHOTOS[3],
    rating: 4.7,
    reviewsCount: 173,
    city: "Tashkent",
    address: "Tashkent, Mirzo Ulugbek 31",
    distanceKm: 4.1,
    phone: "+998 71 244 33 22",
    hours: "08:00–20:00",
    doctorsCount: 24,
    departments: ["Gastroenterology", "Endoscopy", "Hepatology"],
    description: "Specialized center for advanced gastrointestinal diagnostics.",
  },
];

// ===== PHARMACIES (15) =====
const PHARMACY_LOGO = "https://images.pexels.com/photos/8657368/pexels-photo-8657368.jpeg";
export const PHARMACIES: Pharmacy[] = [
  { id: "ph-001", name: "Dori-Darmon #14", city: "Tashkent", address: "Yunusabad 12", distanceKm: 0.8, phone: "+998 71 211 22 33", hours: "24/7", open: true, logo: PHARMACY_LOGO },
  { id: "ph-002", name: "Pharma Plus Mirzo", city: "Tashkent", address: "Mirzo Ulugbek 9", distanceKm: 1.4, phone: "+998 71 220 11 99", hours: "08:00–23:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-003", name: "Apteka 24/7", city: "Tashkent", address: "Chilanzar 22", distanceKm: 2.1, phone: "+998 71 277 00 88", hours: "24/7", open: true, logo: PHARMACY_LOGO },
  { id: "ph-004", name: "MedShop Yashnabad", city: "Tashkent", address: "Yashnabod 17", distanceKm: 2.6, phone: "+998 71 233 77 11", hours: "08:00–22:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-005", name: "Dori Bozor", city: "Andijan", address: "Navoiy 33", distanceKm: 1.0, phone: "+998 74 222 55 44", hours: "08:00–22:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-006", name: "Andijan Apteka", city: "Andijan", address: "Bobur 17", distanceKm: 1.5, phone: "+998 74 222 66 77", hours: "24/7", open: false, logo: PHARMACY_LOGO },
  { id: "ph-007", name: "Namangan Pharma", city: "Namangan", address: "Uychi 11", distanceKm: 0.9, phone: "+998 69 234 55 22", hours: "08:00–22:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-008", name: "Healthy Life Namangan", city: "Namangan", address: "Babur 41", distanceKm: 1.7, phone: "+998 69 235 11 00", hours: "08:00–23:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-009", name: "Fergana Dori", city: "Fergana", address: "Mustaqillik 12", distanceKm: 1.2, phone: "+998 73 244 99 99", hours: "07:00–24:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-010", name: "Apteka Premium Fergana", city: "Fergana", address: "Yangi Hayot 9", distanceKm: 2.3, phone: "+998 73 244 33 44", hours: "08:00–23:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-011", name: "Samarkand Apteka", city: "Samarkand", address: "Registan 4", distanceKm: 0.6, phone: "+998 66 230 11 22", hours: "08:00–22:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-012", name: "Bibi-Khanym Pharma", city: "Samarkand", address: "Bibi-Khanym 8", distanceKm: 1.5, phone: "+998 66 232 22 33", hours: "08:00–24:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-013", name: "Bukhara Dori", city: "Bukhara", address: "Lyabi-Hauz 3", distanceKm: 1.0, phone: "+998 65 224 00 11", hours: "08:00–22:00", open: true, logo: PHARMACY_LOGO },
  { id: "ph-014", name: "Tashkent Central Pharmacy", city: "Tashkent", address: "Amir Temur 1", distanceKm: 4.0, phone: "+998 71 200 11 00", hours: "24/7", open: true, logo: PHARMACY_LOGO },
  { id: "ph-015", name: "Vita Apteka", city: "Tashkent", address: "Mirabad 50", distanceKm: 3.1, phone: "+998 71 200 99 88", hours: "08:00–23:00", open: true, logo: PHARMACY_LOGO },
];

const MED_IMG = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae";
export const MEDICINES: Medicine[] = [
  { id: "med-001", name: "Paracetamol 500mg", generic: "Paracetamol", description: "Pain reliever and fever reducer.", usage: "1 tablet every 4–6h, max 4/day. With water.", priceMin: 8, priceMax: 18, pharmacyIds: ["ph-001", "ph-002", "ph-003", "ph-005"], image: MED_IMG },
  { id: "med-002", name: "Ibuprofen 400mg", generic: "Ibuprofen", description: "NSAID for pain and inflammation.", usage: "1 tablet 3 times a day after meals.", priceMin: 12, priceMax: 25, pharmacyIds: ["ph-001", "ph-004", "ph-007"], image: MED_IMG },
  { id: "med-003", name: "Amoxiclav 875/125", generic: "Amoxicillin + Clavulanic acid", description: "Broad-spectrum antibiotic. Prescription required.", usage: "1 tablet every 12h for 7 days.", priceMin: 95, priceMax: 145, pharmacyIds: ["ph-002", "ph-009", "ph-014"], image: MED_IMG },
  { id: "med-004", name: "Augmentin 625mg", generic: "Amoxicillin + Clavulanic acid", description: "Antibiotic for respiratory and ENT infections.", usage: "Per doctor's prescription.", priceMin: 80, priceMax: 130, pharmacyIds: ["ph-001", "ph-002", "ph-011"], image: MED_IMG },
  { id: "med-005", name: "Ceftriaxone 1g", generic: "Ceftriaxone", description: "Injectable antibiotic for severe infections.", usage: "1 vial IM/IV daily, by prescription.", priceMin: 22, priceMax: 38, pharmacyIds: ["ph-003", "ph-005", "ph-014"], image: MED_IMG },
  { id: "med-006", name: "Vitamin D3 2000 IU", generic: "Cholecalciferol", description: "Vitamin D supplement.", usage: "1 capsule daily with food.", priceMin: 45, priceMax: 80, pharmacyIds: ["ph-001", "ph-004", "ph-015"], image: MED_IMG },
  { id: "med-007", name: "Loratadine 10mg", generic: "Loratadine", description: "Antihistamine for allergic rhinitis.", usage: "1 tablet daily.", priceMin: 15, priceMax: 28, pharmacyIds: ["ph-002", "ph-008"], image: MED_IMG },
  { id: "med-008", name: "Omeprazole 20mg", generic: "Omeprazole", description: "Reduces stomach acid.", usage: "1 capsule daily before breakfast.", priceMin: 35, priceMax: 60, pharmacyIds: ["ph-003", "ph-014"], image: MED_IMG },
];

// ===== MEDICAL SERVICES (15) =====
const SERVICE_PHOTOS = [
  "https://images.pexels.com/photos/9893512/pexels-photo-9893512.jpeg",
  "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e",
  "https://images.unsplash.com/photo-1559757175-5700dde675bc",
  "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
];

export const MEDICAL_SERVICES: MedicalService[] = [
  { id: "svc-001", name: "Sevara Kamilova", serviceType: "Home Nurse", photo: SERVICE_PHOTOS[0], rating: 4.9, reviewsCount: 121, price: 80, homeVisit: true, city: "Tashkent", distanceKm: 1.2, experience: 8, bio: "Certified home nurse providing IV therapy, injections and post-op care.", gallery: SERVICE_PHOTOS, featured: true },
  { id: "svc-002", name: "Rustam Bekov", serviceType: "Physiotherapist", photo: SERVICE_PHOTOS[2], rating: 4.8, reviewsCount: 96, price: 120, homeVisit: true, city: "Tashkent", distanceKm: 2.4, experience: 11, bio: "Sports rehabilitation and post-operative physiotherapy.", gallery: SERVICE_PHOTOS },
  { id: "svc-003", name: "Madina Ergasheva", serviceType: "Speech Therapist", photo: SERVICE_PHOTOS[1], rating: 4.7, reviewsCount: 54, price: 100, homeVisit: false, city: "Tashkent", distanceKm: 3.1, experience: 7, bio: "Pediatric speech therapy and adult voice rehabilitation.", gallery: SERVICE_PHOTOS },
  { id: "svc-004", name: "Bobur Kholmatov", serviceType: "Massage Therapist", photo: SERVICE_PHOTOS[2], rating: 4.6, reviewsCount: 178, price: 90, homeVisit: true, city: "Tashkent", distanceKm: 2.0, experience: 6, bio: "Therapeutic and sports massage. Home visits available.", gallery: SERVICE_PHOTOS },
  { id: "svc-005", name: "Nilufar Abdullaeva", serviceType: "Rehabilitation Specialist", photo: SERVICE_PHOTOS[0], rating: 4.8, reviewsCount: 87, price: 130, homeVisit: true, city: "Tashkent", distanceKm: 4.5, experience: 10, bio: "Stroke and post-surgical rehab with home programs.", gallery: SERVICE_PHOTOS },
  { id: "svc-006", name: "Aziz Tursunov", serviceType: "Home Care Specialist", photo: SERVICE_PHOTOS[3], rating: 4.7, reviewsCount: 142, price: 70, homeVisit: true, city: "Tashkent", distanceKm: 1.6, experience: 5, bio: "Elderly home care and chronic care coordination.", gallery: SERVICE_PHOTOS, featured: true },
  { id: "svc-007", name: "Zarina Komilova", serviceType: "Wound Care Specialist", photo: SERVICE_PHOTOS[4], rating: 4.9, reviewsCount: 73, price: 110, homeVisit: true, city: "Tashkent", distanceKm: 2.8, experience: 9, bio: "Specialty wound dressings, diabetic ulcer care.", gallery: SERVICE_PHOTOS },
  { id: "svc-008", name: "Kamol Saidov", serviceType: "Injection Services", photo: SERVICE_PHOTOS[2], rating: 4.6, reviewsCount: 201, price: 50, homeVisit: true, city: "Tashkent", distanceKm: 1.4, experience: 6, bio: "IM/IV/SC injections at home with sterile technique.", gallery: SERVICE_PHOTOS },
  { id: "svc-009", name: "Lola Rashidova", serviceType: "Lab Sample Collection", photo: SERVICE_PHOTOS[0], rating: 4.8, reviewsCount: 188, price: 40, homeVisit: true, city: "Tashkent", distanceKm: 1.0, experience: 4, bio: "Home blood draw, ECG and basic samples.", gallery: SERVICE_PHOTOS },
  { id: "svc-010", name: "Sherzod Karimov", serviceType: "Physiotherapist", photo: SERVICE_PHOTOS[2], rating: 4.7, reviewsCount: 76, price: 115, homeVisit: false, city: "Samarkand", distanceKm: 3.4, experience: 8, bio: "Manual therapy and ergonomic rehab.", gallery: SERVICE_PHOTOS },
  { id: "svc-011", name: "Gulnora Yusupova", serviceType: "Home Nurse", photo: SERVICE_PHOTOS[0], rating: 4.8, reviewsCount: 109, price: 75, homeVisit: true, city: "Andijan", distanceKm: 2.1, experience: 7, bio: "Pediatric home nursing and postnatal care.", gallery: SERVICE_PHOTOS },
  { id: "svc-012", name: "Otabek Mamatov", serviceType: "Massage Therapist", photo: SERVICE_PHOTOS[2], rating: 4.6, reviewsCount: 64, price: 80, homeVisit: true, city: "Fergana", distanceKm: 2.5, experience: 5, bio: "Deep tissue and relaxation massage.", gallery: SERVICE_PHOTOS },
  { id: "svc-013", name: "Aziza Ahmedova", serviceType: "Rehabilitation Specialist", photo: SERVICE_PHOTOS[0], rating: 4.9, reviewsCount: 51, price: 140, homeVisit: false, city: "Bukhara", distanceKm: 4.0, experience: 12, bio: "Cardiac and pulmonary rehab programs.", gallery: SERVICE_PHOTOS },
  { id: "svc-014", name: "Dilshod Nazarov", serviceType: "Home Care Specialist", photo: SERVICE_PHOTOS[3], rating: 4.7, reviewsCount: 92, price: 70, homeVisit: true, city: "Namangan", distanceKm: 1.8, experience: 6, bio: "Elderly and chronic care, medication management.", gallery: SERVICE_PHOTOS },
  { id: "svc-015", name: "Farzona Iskandarova", serviceType: "Lab Sample Collection", photo: SERVICE_PHOTOS[0], rating: 4.8, reviewsCount: 134, price: 45, homeVisit: true, city: "Tashkent", distanceKm: 2.3, experience: 4, bio: "Home phlebotomy and lab sample logistics.", gallery: SERVICE_PHOTOS },
];

// ===== REVIEWS =====
const REVIEW_TEXTS = [
  "Very professional and friendly. Highly recommended!",
  "Helped my child quickly, calm and caring approach.",
  "Excellent diagnosis and clear explanation.",
  "Modern clinic, no waiting, perfect service.",
  "Saved time and money — AI consultation pointed me to the right specialist.",
  "Polite staff and very thorough examination.",
  "Best doctor I have visited in Uzbekistan.",
  "Quick home visit, very experienced.",
];

export function generateReviews(seed: number, count: number = 6): Review[] {
  const authors = ["Aziza", "Bobur", "Madina", "Sherzod", "Nilufar", "Otabek", "Lola", "Dilshod"];
  return Array.from({ length: count }, (_, i) => {
    const idx = (seed * 7 + i) % REVIEW_TEXTS.length;
    return {
      id: `rev-${seed}-${i}`,
      author: `${authors[(seed + i) % authors.length]} ${["A.", "B.", "K.", "M.", "S."][(i + seed) % 5]}`,
      rating: [5, 5, 5, 4, 4, 3][i % 6],
      date: `2026-0${1 + ((i + seed) % 9)}-${10 + i}`,
      text: REVIEW_TEXTS[idx],
    };
  });
}

// ===== HOME CARE SERVICES =====
export const HOME_CARE_SERVICES = [
  { id: "hc-001", name: "Doctor Home Visit", icon: "doctor", price: 200 },
  { id: "hc-002", name: "Nurse Home Visit", icon: "account-heart", price: 80 },
  { id: "hc-003", name: "Injection Service", icon: "needle", price: 50 },
  { id: "hc-004", name: "IV Therapy", icon: "iv-bag", price: 150 },
  { id: "hc-005", name: "Dressings", icon: "bandage", price: 60 },
  { id: "hc-006", name: "Postoperative Care", icon: "hospital-box", price: 180 },
  { id: "hc-007", name: "Elderly Care", icon: "human-cane", price: 90 },
  { id: "hc-008", name: "Child Care", icon: "baby-face", price: 100 },
  { id: "hc-009", name: "Rehabilitation", icon: "run", price: 130 },
];

// ===== CHAT HISTORY DEMO =====
export const CHAT_HISTORY = [
  { id: "ch-001", title: "Child with fever and ear pain", lastMessage: "Recommended: Pediatrician", date: "Today" },
  { id: "ch-002", title: "Strong headache for 2 days", lastMessage: "Recommended: Neurologist", date: "Yesterday" },
  { id: "ch-003", title: "Burn on hand", lastMessage: "First aid advice", date: "2d ago" },
  { id: "ch-004", title: "Abdominal pain", lastMessage: "Recommended: GP", date: "1w ago" },
  { id: "ch-005", title: "Pregnancy question", lastMessage: "Recommended: OB-GYN", date: "2w ago" },
];

// ===== HOMECARE REQUESTS =====
export const HOME_CARE_REQUESTS = [
  { id: "hr-001", service: "Nurse Home Visit", status: "Completed", date: "2 days ago", patient: "M. Yusupov" },
  { id: "hr-002", service: "IV Therapy", status: "Scheduled", date: "Tomorrow 10:00", patient: "A. Karimova" },
  { id: "hr-003", service: "Doctor Home Visit", status: "In progress", date: "Today 14:30", patient: "S. Tursunov" },
];

// ===== DOCTOR DASHBOARD DEMO =====
export const DOCTOR_DEMO = {
  name: "Dr. Akmal Karimov",
  specialty: "Cardiologist",
  photo: DOCTOR_PHOTOS[0],
  todayAppointments: 7,
  todayConsultations: 3,
  todayEarnings: 1750,
  weekEarnings: 9800,
  monthEarnings: 38500,
  yearEarnings: 412000,
  rating: 4.9,
  reviewsCount: 184,
  monthlyAppointments: [42, 51, 47, 63, 58, 71, 82, 76, 88, 95, 102, 118],
  patientGrowth: [120, 145, 160, 178, 210, 246, 289, 320, 358, 392, 421, 467],
  ratingsTrend: [4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9],
  nextAppointment: { time: "10:30", patient: "Aziza Karimova", type: "Follow-up: Hypertension" },
  upcoming: [
    { time: "09:00", patient: "Bobur Tursunov", type: "Consultation" },
    { time: "10:30", patient: "Aziza Karimova", type: "Follow-up" },
    { time: "11:15", patient: "Madina Ergasheva", type: "ECG review" },
    { time: "14:00", patient: "Otabek Saidov", type: "New patient" },
    { time: "16:30", patient: "Nilufar Abdullaeva", type: "Online consult" },
  ],
  consultationRequests: [
    { id: "cr-1", patient: "Sherzod K.", reason: "Chest discomfort", urgency: "MEDIUM" },
    { id: "cr-2", patient: "Lola I.", reason: "Routine check", urgency: "LOW" },
    { id: "cr-3", patient: "Farrukh M.", reason: "Palpitations", urgency: "HIGH" },
  ],
};

// ===== ADMIN DASHBOARD DEMO =====
export const ADMIN_DEMO = {
  organizationName: "Medion Private Clinic",
  hero: HOSPITAL_PHOTOS[6],
  activeDoctors: 54,
  totalPatients: 12480,
  monthlyVisits: 3120,
  monthlyRevenue: 487000,
  patientVisitsMonthly: [240, 268, 251, 287, 312, 298, 326, 342, 358, 371, 389, 412],
  revenueMonthly: [310, 332, 318, 360, 384, 372, 401, 418, 435, 451, 468, 487],
  popularServices: [
    { name: "Cardiology", percent: 28 },
    { name: "Dermatology", percent: 21 },
    { name: "Endocrinology", percent: 14 },
    { name: "Rheumatology", percent: 11 },
    { name: "Surgery", percent: 9 },
  ],
  recentReviews: generateReviews(11, 4),
  marketingCampaigns: [
    { name: "Premium placement", status: "Active", clicks: 4231 },
    { name: "Featured Organization", status: "Active", clicks: 2876 },
    { name: "Spring promo: 20% off", status: "Draft", clicks: 0 },
  ],
};

// ===== SERVICE PROVIDER DASHBOARD =====
export const SERVICE_DEMO = {
  name: "Sevara Kamilova",
  serviceType: "Home Nurse",
  photo: SERVICE_PHOTOS[0],
  todayOrders: 5,
  weekOrders: 32,
  monthIncome: 18600,
  yearIncome: 187000,
  rating: 4.9,
  activeOrders: [
    { id: "o-1", client: "Aziza K.", service: "IV Therapy", time: "14:00", status: "In transit" },
    { id: "o-2", client: "Bobur T.", service: "Injection", time: "15:30", status: "Confirmed" },
    { id: "o-3", client: "Madina E.", service: "Dressing", time: "17:00", status: "Pending" },
  ],
  completedToday: 2,
  gallery: SERVICE_PHOTOS,
};

export const SPECIALTIES = Array.from(new Set(DOCTORS.map((d) => d.specialty))).sort();
export const CITIES: City[] = ["Tashkent", "Andijan", "Namangan", "Fergana", "Samarkand", "Bukhara"];

// ===== DIAGNOSTICS (medical imaging & tests) =====
export type Diagnostic = {
  id: string;
  name: string;
  category: "Imaging" | "Cardiac" | "Endoscopy";
  description: string;
  price: number; // thousands UZS
  duration: string;
  icon: string;
  image: string;
  providers: number;
};

const DIAG_IMG = "https://images.unsplash.com/photo-1576091160550-2173dba999ef";

export const DIAGNOSTICS: Diagnostic[] = [
  { id: "dg-001", name: "MRT (MRI)", category: "Imaging", description: "Magnit-rezonans tomografiya — yumshoq to'qimalar uchun yuqori aniqlikdagi tasvir.", price: 850, duration: "45 daqiqa", icon: "atom-variant", image: DIAG_IMG, providers: 12 },
  { id: "dg-002", name: "KT (CT)", category: "Imaging", description: "Kompyuter tomografiyasi — suyak, qon tomir va o'pka tahlili uchun.", price: 600, duration: "20 daqiqa", icon: "scanner", image: DIAG_IMG, providers: 18 },
  { id: "dg-003", name: "UZI (Ultrasound)", category: "Imaging", description: "Ultratovush diagnostikasi — ichki organlar, bo'yin, qorin, homiladorlik uchun.", price: 220, duration: "30 daqiqa", icon: "waveform", image: DIAG_IMG, providers: 47 },
  { id: "dg-004", name: "Rentgen (X-ray)", category: "Imaging", description: "Rentgen tekshiruvi — suyak va o'pka kasalliklarini aniqlash.", price: 140, duration: "15 daqiqa", icon: "image-broken-variant", image: DIAG_IMG, providers: 56 },
  { id: "dg-005", name: "EKG", category: "Cardiac", description: "Elektrokardiogramma — yurak ritmi va ishchanligi tahlili.", price: 90, duration: "10 daqiqa", icon: "heart-pulse", image: DIAG_IMG, providers: 64 },
  { id: "dg-006", name: "EXOKG (EchoCG)", category: "Cardiac", description: "Yurak ultratovushi — klapanlar, devorlar va qon oqimi.", price: 320, duration: "30 daqiqa", icon: "heart-flash", image: DIAG_IMG, providers: 28 },
  { id: "dg-007", name: "Endoskopiya", category: "Endoscopy", description: "Yuqori qorin endoskopiyasi (FGDS) — me'da va ichak diagnostikasi.", price: 480, duration: "20 daqiqa", icon: "magnify-plus-outline", image: DIAG_IMG, providers: 14 },
];

// ===== PROCEDURES (independent medical procedures) =====
export type Procedure = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  homeAvailable: boolean;
  providers: number;
};

export const PROCEDURES: Procedure[] = [
  { id: "pr-001", name: "Inyeksiya", description: "Mushak ichi (i/m) va vena ichi (i/v) inyeksiyalar.", price: 50, icon: "needle", homeAvailable: true, providers: 38 },
  { id: "pr-002", name: "Kapelnitsa (IV Therapy)", description: "Tomchi infuziya — gidratatsiya, vitamin, dori terapiyasi.", price: 150, icon: "iv-bag", homeAvailable: true, providers: 26 },
  { id: "pr-003", name: "Bog'lov (Dressing)", description: "Yara, kuyish va operatsiyadan keyingi bog'lovlar.", price: 60, icon: "bandage", homeAvailable: true, providers: 41 },
  { id: "pr-004", name: "Reabilitatsiya", description: "Insultdan, jarrohlikdan va sport jarohatidan keyingi reabilitatsiya.", price: 130, icon: "run", homeAvailable: true, providers: 19 },
  { id: "pr-005", name: "Postoperatsion parvarish", description: "Operatsiyadan keyin ko'p kunlik nazorat va parvarish.", price: 180, icon: "hospital-box", homeAvailable: true, providers: 22 },
];

// ===== HOME CARE SPECIALIST PREVIEW (per-service matched specialist) =====
export type HomeCareSpecialist = {
  id: string;
  name: string;
  serviceId: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  yearsExp: number;
  etaMinutes: number;
  gender: "male" | "female";
};

const HC_FEM = "https://images.unsplash.com/photo-1559757175-5700dde675bc";
const HC_FEM2 = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d";
const HC_MALE = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2";
const HC_MALE2 = "https://images.unsplash.com/photo-1622253692010-333f2da6031d";

export const HOME_CARE_SPECIALISTS: HomeCareSpecialist[] = [
  { id: "hcs-1", name: "Sevara Kamilova", serviceId: "hc-002", photo: HC_FEM, rating: 4.9, reviewsCount: 121, yearsExp: 8, etaMinutes: 25, gender: "female" },
  { id: "hcs-2", name: "Aziza Tashkentova", serviceId: "hc-002", photo: HC_FEM2, rating: 4.8, reviewsCount: 96, yearsExp: 6, etaMinutes: 35, gender: "female" },
  { id: "hcs-3", name: "Dr. Akmal Karimov", serviceId: "hc-001", photo: HC_MALE, rating: 4.9, reviewsCount: 184, yearsExp: 17, etaMinutes: 45, gender: "male" },
  { id: "hcs-4", name: "Dr. Bobur Tursunov", serviceId: "hc-001", photo: HC_MALE2, rating: 4.7, reviewsCount: 96, yearsExp: 15, etaMinutes: 50, gender: "male" },
  { id: "hcs-5", name: "Kamol Saidov", serviceId: "hc-003", photo: HC_MALE2, rating: 4.6, reviewsCount: 201, yearsExp: 6, etaMinutes: 20, gender: "male" },
  { id: "hcs-6", name: "Madina Yusupova", serviceId: "hc-003", photo: HC_FEM, rating: 4.8, reviewsCount: 142, yearsExp: 9, etaMinutes: 22, gender: "female" },
  { id: "hcs-7", name: "Zarina Komilova", serviceId: "hc-004", photo: HC_FEM2, rating: 4.9, reviewsCount: 73, yearsExp: 9, etaMinutes: 30, gender: "female" },
  { id: "hcs-8", name: "Otabek Mamatov", serviceId: "hc-004", photo: HC_MALE, rating: 4.7, reviewsCount: 64, yearsExp: 8, etaMinutes: 40, gender: "male" },
  { id: "hcs-9", name: "Nilufar Abdullaeva", serviceId: "hc-005", photo: HC_FEM, rating: 4.8, reviewsCount: 87, yearsExp: 10, etaMinutes: 28, gender: "female" },
  { id: "hcs-10", name: "Aziz Tursunov", serviceId: "hc-007", photo: HC_MALE2, rating: 4.7, reviewsCount: 142, yearsExp: 5, etaMinutes: 32, gender: "male" },
];

export function findSpecialistsForService(serviceId: string, prefer?: "any" | "male" | "female"): HomeCareSpecialist[] {
  const matched = HOME_CARE_SPECIALISTS.filter((s) => s.serviceId === serviceId);
  const pool = matched.length > 0 ? matched : HOME_CARE_SPECIALISTS.slice(0, 2);
  if (!prefer || prefer === "any") return pool;
  return pool.filter((s) => s.gender === prefer).length > 0 ? pool.filter((s) => s.gender === prefer) : pool;
}

// Deterministic pseudo-random in [min,max] from a string id
export function seedRand(id: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return min + (h % 1000) / 1000 * (max - min);
}

// ===== HOME CARE ETA (varies by service for realism) =====
export const HOME_CARE_ETA: Record<string, { min: number; max: number; label: string }> = {
  "hc-001": { min: 25, max: 45, label: "Doctor Home Visit" },
  "hc-002": { min: 20, max: 40, label: "Nurse Home Visit" },
  "hc-003": { min: 15, max: 30, label: "Injection Service" },
  "hc-004": { min: 30, max: 60, label: "IV Therapy" },
  "hc-005": { min: 20, max: 35, label: "Dressings" },
  "hc-006": { min: 25, max: 45, label: "Postoperative Care" },
  "hc-007": { min: 30, max: 60, label: "Elderly Care" },
  "hc-008": { min: 25, max: 45, label: "Child Care" },
  "hc-009": { min: 45, max: 90, label: "Rehabilitation" },
};

export function computeServiceEta(serviceId: string, address: string = ""): number {
  const range = HOME_CARE_ETA[serviceId] || { min: 20, max: 45, label: "Home Visit" };
  // Deterministic variation seeded by service + address
  const seed = `${serviceId}-${address}`;
  return Math.round(seedRand(seed, range.min, range.max));
}

// ===== PHARMACY EXTRAS (delivery flags) =====
export function pharmacyHas24h(p: { hours: string }) {
  return p.hours.includes("24/7") || p.hours.includes("24");
}
export function pharmacyHasDelivery(id: string) {
  return seedRand(id + "del", 0, 1) > 0.35;
}
export function pharmacyDeliveryEta(id: string) {
  return Math.round(seedRand(id + "deta", 20, 75));
}

// ===== DOCTOR PROFILE EXTRAS (education, certificates) =====
export type DoctorExtras = {
  education: { school: string; year: string; degree: string }[];
  certificates: { title: string; org: string; year: string }[];
  primaryOrganizationId?: string;
};

export const DOCTOR_EXTRAS: Record<string, DoctorExtras> = {
  "dr-001": {
    education: [
      { school: "Tashkent Medical Academy", year: "2008", degree: "Doctor of Medicine" },
      { school: "Bakulev Cardiology Center, Moscow", year: "2011", degree: "Interventional Cardiology Fellowship" },
    ],
    certificates: [
      { title: "Board Certification — Cardiology", org: "Ministry of Health, UZ", year: "2012" },
      { title: "ESC Member", org: "European Society of Cardiology", year: "2016" },
      { title: "Advanced Cardiac Life Support", org: "AHA", year: "2022" },
    ],
    primaryOrganizationId: "org-006",
  },
  "dr-002": {
    education: [
      { school: "Tashkent Pediatric Medical Institute", year: "2013", degree: "Doctor of Medicine" },
      { school: "Children's Hospital, Ankara", year: "2015", degree: "Pediatric Residency" },
    ],
    certificates: [
      { title: "Board Certified Pediatrician", org: "Ministry of Health, UZ", year: "2016" },
      { title: "Neonatal Resuscitation Provider", org: "AAP", year: "2020" },
    ],
    primaryOrganizationId: "org-002",
  },
};

export function getDoctorExtras(id: string): DoctorExtras {
  return (
    DOCTOR_EXTRAS[id] || {
      education: [
        { school: "Tashkent Medical Academy", year: "2014", degree: "Doctor of Medicine" },
        { school: "Tashkent Institute of Postgraduate Medical Education", year: "2017", degree: "Residency" },
      ],
      certificates: [
        { title: "Board Certified Specialist", org: "Ministry of Health, UZ", year: "2018" },
        { title: "Continuing Medical Education", org: "MedUZ Academy", year: "2024" },
      ],
      primaryOrganizationId: undefined,
    }
  );
}
