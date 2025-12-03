import { Team, TeamMember } from '../modules/teams/interfaces';

export type { TeamMember };

export type { Team };


type BallotType = {
  id: number;
  name: string;
  byDistrict: boolean
};

type Ballot = {
  id: number;
  name: string;
  description: string;
  ballotItems: BallotItem[];
  ballotType: BallotType;
  selectedBallotItem?: SelectedBallotItem;
};

type SelectedBallotItem = {
  id: number;
  type: string;
  name: string;
  description: string;
  hasListItems: boolean;
  maxSelectedItem: number;
  listItems: BallotItemListItem[];
};


type BallotItem = {
  id: number;
  type: string;
  name: string;
  description: string;
  hasListItems: boolean;
  maxSelectedItem: number;
  listItems: BallotItemListItem[];
};

export type Location = {
  id: number;
  name: string;
}

type ListItem = {
  id: number;
  position?: number;
  number?: number;
  name: string;
  title: string;
  image: string;
};


type BallotItemListItem = {
  location: Location;
  listItems: ListItem[];
};


export type Election = {
  id: number;
  name: string;
  description: string;
  ballots: Ballot[];
};

// Elections mock data
export const mockActiveElections: Election[] = [
  {
    id: 1,
    name: 'ონლაინ რეიტინგი',
    description: 'გააკეთე არჩევანი',
    ballots: [
      {
        id: 1, 
        name: 'პარტიების რეიტინგი', 
        description: 'აირჩიე პარტიები',
        ballotType: { 
          id: 1, 
          name: 'მთავარი / შემდეგი არჩევანი', 
          byDistrict: false 
        },        
        ballotItems: [
          { 
            id: 1, 
            type: 'accept', 
            name: 'ჩემი არჩევანი', 
            description: 'გააკეთე არჩევანი', 
            hasListItems: false, 
            maxSelectedItem: 3, 
            listItems: [{
              location: {
                id: 0,
                name: 'all districts'
              },
                listItems: [
                  { id: 1, name: 'ქართული ოცნება', title: 'პარტია', number: 1, image: 'https://picsum.photos/seed/party1/200/200' },
                  { id: 2, name: 'ერთიანი ნაციონალური მოძრაობა', title: 'პარტია', number: 2, image: 'https://picsum.photos/seed/party2/200/200' },
                  { id: 3, name: 'გირჩი', title: 'პარტია', number: 3, image: 'https://picsum.photos/seed/party3/200/200' },
                  { id: 4, name: 'ლელო', title: 'პარტია', number: 4, image: 'https://picsum.photos/seed/party4/200/200' },
                  { id: 5, name: 'სტრატეგია აღმაშენებელი', title: 'პარტია', number: 5, image: 'https://picsum.photos/seed/party5/200/200' },
                ]
              
            }]
          },
          { 
            id: 2, 
            type: 'decline', 
            name: 'უარი მონაწილეობაზე', 
            description: 'უარი მონაწილეობაზე', 
            hasListItems: false, 
            maxSelectedItem: 0, 
            listItems: [] 
          }
        ]
      },
      {
        id: 2,
        name: 'პოლიტიკოსთა საერთო რეიტინგი',
        description: 'აირჩიე პოლიტიკოსები',
        ballotType: {
          id: 2,
          name: 'სიის შედგენა',
          byDistrict: false
        },
        ballotItems: [
          {
          id: 1,
          type: 'accept',
          name: 'ჩემი არჩევანი',
          description: 'გააკეთე არჩევანი',
            hasListItems: true,
            maxSelectedItem: 10,
            listItems: [
              {
                location: {
                  id: 0,
                  name: 'all districts',
                },
                listItems: [
                  { id: 1, name: 'ივანე ივანიშვილი', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=1' },
                  { id: 2, name: 'მიხეილ სააკაშვილი', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=2' },
                  { id: 3, name: 'ბიძინა ივანიშვილი', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=3' },
                  { id: 4, name: 'გიგი უგულავა', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=4' },
                  { id: 5, name: 'გიორგი გახარია', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=5' },
                  { id: 6, name: 'დავით ბაქრაძე', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=6' },
                  { id: 7, name: 'კახა კალაძე', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=7' },
                  { id: 8, name: 'ნიკა მელია', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=8' },
                  { id: 9, name: 'ანა დოლიძე', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=9' },
                  { id: 10, name: 'გიორგი ვაშაძე', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=10' },
                  { id: 11, name: 'პოლიტიკოსი 11', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=11' },
                  { id: 12, name: 'პოლიტიკოსი 12', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=12' },
                  { id: 13, name: 'პოლიტიკოსი 13', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=13' },
                  { id: 14, name: 'პოლიტიკოსი 14', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=14' },
                  { id: 15, name: 'პოლიტიკოსი 15', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=15' },
                  { id: 16, name: 'პოლიტიკოსი 16', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=16' },
                  { id: 17, name: 'პოლიტიკოსი 17', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=17' },
                  { id: 18, name: 'პოლიტიკოსი 18', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=18' },
                  { id: 19, name: 'პოლიტიკოსი 19', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=19' },
                  { id: 20, name: 'პოლიტიკოსი 20', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=20' },
                ],
              },
            ],
        },
        {
          id: 2,
          type: 'decline',
          name: 'უარი მონაწილეობაზე',
            description: '',
          hasListItems: false,
            maxSelectedItem: 0,
            listItems: [],
          },
        ]
      },
      {
        id: 3, 
        name: 'პოლიტიკოსთა ადგილობრივი რეიტინგი', 
        description: 'აირჩიე პოლიტიკოსები',
        ballotType: 
        { 
          id: 3, 
          name: 'სიის შედგენა', 
          byDistrict: true 
        },
        ballotItems: 
        [
          { id: 1, 
            type: 'accept'
            , name: 'ჩემი არჩევანი'
            , description: 'აირჩიე ადგილობრივი პოლიტიკოსები'
            , hasListItems: true
            , maxSelectedItem: 10
            , listItems: [
              {
                location: {
                  id: 1,
                  name: 'თბილისი',
                },
                listItems: [
                  { id: 101, name: 'ადგილობრივი პოლიტიკოსი 1', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=21' },
                  { id: 102, name: 'ადგილობრივი პოლიტიკოსი 2', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=22' },
                  { id: 103, name: 'ადგილობრივი პოლიტიკოსი 3', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=23' },
                  { id: 104, name: 'ადგილობრივი პოლიტიკოსი 4', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=24' },
                  { id: 105, name: 'ადგილობრივი პოლიტიკოსი 5', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=25' },
                ],
              },
              {
                location: {
                  id: 2,
                  name: 'ბათუმი',
                },
                listItems: [
                  { id: 201, name: 'ადგილობრივი პოლიტიკოსი 1', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=26' },
                  { id: 202, name: 'ადგილობრივი პოლიტიკოსი 2', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=27' },
                  { id: 203, name: 'ადგილობრივი პოლიტიკოსი 3', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=28' },
                  { id: 204, name: 'ადგილობრივი პოლიტიკოსი 4', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=29' },
                  { id: 205, name: 'ადგილობრივი პოლიტიკოსი 5', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=30' },
                ],
              },
              {
                location: {
                  id: 3,
                  name: 'ქუთაისი',
                },
                listItems: [
                  { id: 301, name: 'ადგილობრივი პოლიტიკოსი 1', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=31' },
                  { id: 302, name: 'ადგილობრივი პოლიტიკოსი 2', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=32' },
                  { id: 303, name: 'ადგილობრივი პოლიტიკოსი 3', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=33' },
                  { id: 304, name: 'ადგილობრივი პოლიტიკოსი 4', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=34' },
                  { id: 305, name: 'ადგილობრივი პოლიტიკოსი 5', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=35' },
                ],
              },
              {
                location: {
                  id: 4,
                  name: 'რუსთავი',
                },
                listItems: [
                  { id: 401, name: 'ადგილობრივი პოლიტიკოსი 1', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=36' },
                  { id: 402, name: 'ადგილობრივი პოლიტიკოსი 2', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=37' },
                  { id: 403, name: 'ადგილობრივი პოლიტიკოსი 3', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=38' },
                  { id: 404, name: 'ადგილობრივი პოლიტიკოსი 4', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=39' },
                  { id: 405, name: 'ადგილობრივი პოლიტიკოსი 5', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=40' },
                ],
              },
              {
                location: {
                  id: 5,
                  name: 'ზუგდიდი',
                },
                listItems: [
                  { id: 501, number: 1, name: 'ადგილობრივი პოლიტიკოსი 1', title: 'ქართული ოცნება', image: 'https://i.pravatar.cc/150?img=41' },
                  { id: 502, number: 2, name: 'ადგილობრივი პოლიტიკოსი 2', title: 'ერთიანი ნაციონალური მოძრაობა', image: 'https://i.pravatar.cc/150?img=42' },
                  { id: 503, number: 3, name: 'ადგილობრივი პოლიტიკოსი 3', title: 'გირჩი', image: 'https://i.pravatar.cc/150?img=43' },
                  { id: 504, number: 4, name: 'ადგილობრივი პოლიტიკოსი 4', title: 'ლელო', image: 'https://i.pravatar.cc/150?img=44' },
                  { id: 505, number: 5, name: 'ადგილობრივი პოლიტიკოსი 5', title: 'სტრატეგია აღმაშენებელი', image: 'https://i.pravatar.cc/150?img=45' },
                ],
              },
            ] 
          },
          { 
            id: 2, 
            type: 'decline', 
            name: 'უარი მონაცილეობაზე', 
            description: 'უარი მონაცილეობაზე', 
            hasListItems: false, 
            maxSelectedItem: 0, 
            listItems: [] 
          }
        ]
      },
    ]
  },
];


// Teams mock data
export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'გუნდის გარეშე',
    number: 0,
    logo: 'https://picsum.photos/seed/nogroup/200/200',
    type: 'ngo',
    isMember: false,
    memberCount: 8,
  },
  { id: 2, name: 'ქართული ოცნება', number: 1, logo: 'https://picsum.photos/seed/party1/200/200', type: 'party', isMember: false, memberCount: 150 },
  { id: 3, name: 'ერთიანი ნაციონალური მოძრაობა', number: 2, logo: 'https://picsum.photos/seed/party2/200/200', type: 'party', isMember: false, memberCount: 120 },
  { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
  { id: 5, name: 'ლელო', number: 4, logo: 'https://picsum.photos/seed/party4/200/200', type: 'party', isMember: false, memberCount: 95 },
  { id: 6, name: 'სტრატეგია აღმაშენებელი', number: 5, logo: 'https://picsum.photos/seed/party5/200/200', type: 'party', isMember: false, memberCount: 110 },
  { id: 7, name: 'მოძრაობა', number: 6, logo: 'https://picsum.photos/seed/movement1/200/200', type: 'movement', isMember: false, memberCount: 50 },
  { id: 8, name: 'არასამთავრობო ორგანიზაცია', number: 7, logo: 'https://picsum.photos/seed/ngo1/200/200', type: 'ngo', isMember: false, memberCount: 75 },
  { id: 9, name: 'ახალი ორგანიზაცია', number: 8, logo: 'https://picsum.photos/seed/ngo2/200/200', type: 'ngo', isMember: false, memberCount: 60 },
];

// User interface for mock data
export interface MockUser {
  id: string;
  userName: string;
  email: string;
  mobileNumber: string;
  isVerified: boolean;
  person: {
    personalId: string;
    fullName: string;
  } | null; // null if isVerified = false
  password?: string; // For mock authentication
  image?: string; // Optional avatar image
  teamMember: TeamMember // Required team
  location: Location; // Required location
  delegateId?: number; // ID of the delegate (user who referred this user)
}

// Mock users data
export const mockUsers: MockUser[] = [
  {
    id: '1',
    userName: 'a.a',
    email: 'a.a@gmail.com',
    mobileNumber: '+995555123456',
    isVerified: true,
    person: {
      personalId: '01012345678',
      fullName: 'გიორგი მელაძე',
    },
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=1',
    teamMember: {
      team: { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
      isDelegate: true,
      isApproved: true,
      isLeader: true, // TODO: change to false
    },
    location: { id: 1, name: 'თბილისი' },
  },
  {
    id: '2',
    userName: 'nino_k',
    email: 'nino.kvantaliani@example.com',
    mobileNumber: '+995555234567',
    isVerified: true,
    person: {
      personalId: '01023456789',
      fullName: 'ნინო კვანტალიანი',
    },
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=2',
    teamMember: {
      team: { id: 2, name: 'ქართული ოცნება', number: 1, logo: 'https://picsum.photos/seed/party1/200/200', type: 'party', isMember: false, memberCount: 150 },
      isDelegate: true,
      isApproved: true,
      isLeader: true,
    },
    location: { id: 2, name: 'ბათუმი' },
    delegateId: 1,
  },
  {
    id: '3',
    userName: 'davit_t',
    email: 'davit.tsiklauri@example.com',
    mobileNumber: '+995555345678',
    isVerified: false,
    person: null,
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=3',
    teamMember: {
      team: { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
      isDelegate: true,
      isApproved: true,
      isLeader: false,
    },
    location: { id: 3, name: 'ქუთაისი' },
    delegateId: 1,
  },
  {
    id: '4',
    userName: 'mariam_s',
    email: 'mariam.sharashidze@example.com',
    mobileNumber: '+995555456789',
    isVerified: true,
    person: {
      personalId: '01045678901',
      fullName: 'მარიამ შარაშიძე',
    },
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=4',
    teamMember: {
      team: { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
      isDelegate: true,
      isApproved: true,
      isLeader: false,
    },
    location: { id: 1, name: 'თბილისი' },
    delegateId: 1,
  },
  {
    id: '5',
    userName: 'luka_g',
    email: 'luka.gogoladze@example.com',
    mobileNumber: '+995555567890',
    isVerified: true,
    person: {
      personalId: '01056789012',
      fullName: 'ლუკა გოგოლაძე',
    },
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=5',
    teamMember: {
      team: { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
      isDelegate: false,
      isApproved: true,
      isLeader: false,
    },
    location: { id: 4, name: 'რუსთავი' },
    delegateId: 1,
  },
  {
    id: '6',
    userName: 'ana_m',
    email: 'ana.mchedlidze@example.com',
    mobileNumber: '+995555678901',
    isVerified: false,
    person: null,
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=6',
    teamMember: {
      team: { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
      isDelegate: false,
      isApproved: false,
      isLeader: false,
    },
    location: { id: 0, name: 'ლოკაციის გარეშე' },
    delegateId: 1,
  },
  {
    id: '7',
    userName: 'a.b',
    email: 'a.b@gmail.com',
    mobileNumber: '+995555789012',
    isVerified: false,
    person: null,
    password: 'password123',
    image: 'https://i.pravatar.cc/150?img=7',
    teamMember: {
      team: { id: 4, name: 'გირჩი', number: 3, logo: 'https://picsum.photos/seed/party3/200/200', type: 'party', isMember: false, memberCount: 80 },
      isDelegate: false,
      isApproved: true,
      isLeader: false,
    },
    location: { id: 2, name: 'ბათუმი' },
    delegateId: 1,
  },
];

// Mock locations/municipalities - in real app this would come from API
export const mockLocations: Location[] = [
  { id: 0, name: 'ლოკაციის გარეშე' },
  { id: 1, name: 'თბილისი' },
  { id: 2, name: 'ბათუმი' },
  { id: 3, name: 'ქუთაისი' },
  { id: 4, name: 'რუსთავი' },
  { id: 5, name: 'ზუგდიდი' },
  { id: 6, name: 'გორი' },
  { id: 7, name: 'ფოთი' },
  { id: 8, name: 'სამტრედია' },
  { id: 9, name: 'ხაშური' },
  { id: 10, name: 'სენაკი' },
];

// Bank account interface
export interface BankAccount {
  id: number;
  bankName: string;
  iban: string;
  logo: string;
}

// Mock bank accounts data
export const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: 'თიბისი',
    iban: 'GE62TB7654036020100005',
    logo: 'https://www.opendemocracy.ge/images/TBC_ACCOUNT.png',
  },
  {
    id: 2,
    bankName: 'საქართველოს ბანკი',
    iban: 'GE03BG0000000609260472',
    logo: 'https://www.opendemocracy.ge/images/BOG_ACCOUNT.png',
  },
];

// Verification data interface
export interface VerificationData {
  personalId: string; // 11 digits
  fullName: string; // First name and last name
}

// Mock verification data
export const verificationData: VerificationData[] = [
  { personalId: '01234567890', fullName: 'გიორგი მელაძე' },
  { personalId: '01234567891', fullName: 'ნინო კვანტალიანი' },
  { personalId: '01234567892', fullName: 'მარიამ შარაშიძე' },
  { personalId: '01234567893', fullName: 'ლუკა გოგოლაძე' },
  { personalId: '01234567894', fullName: 'თესტ მომხმარებელი 1' },
  { personalId: '01234567895', fullName: 'თესტ მომხმარებელი 2' },
  { personalId: '01234567896', fullName: 'თესტ მომხმარებელი 3' },
];

// Verification method - returns verification data by personal ID
export function verification(personalId: string): VerificationData | null {
  // Remove any non-digit characters
  const cleanPersonalId = personalId.replace(/\D/g, '');
  
  // Check if personal ID is 11 digits
  if (cleanPersonalId.length !== 11) {
    return null;
  }
  
  // Find verification data by personal ID
  const found = verificationData.find(
    (data) => data.personalId === cleanPersonalId
  );
  
  return found || null;
}

