# Boi Station Design Notes

## Before Backend Checklist

Backend শুরু করার আগে frontend-এর core flows এবং data contract পরিষ্কার করতে হবে। সব page perfect production-level polish না হলেও, backend কোন data shape serve করবে সেটা বোঝার মতো UI এবং mock behavior থাকা দরকার।

### Priority Order

```text
Book Details -> Profile -> Messages -> Saved -> Auth behavior -> Post polish -> API contract -> Backend
```

### 1. Book Details Page

Route:

```text
/books/:id
```

শেষ করার বিষয়:

- Buy/Sell post details view।
- Exchange post details view।
- Cover + seller photos gallery।
- Book title, author, category, condition, location।
- Sell হলে price + negotiable।
- Exchange হলে offered book + wanted book।
- Seller info block।
- Prominent `Message` button।
- `Save` button।
- Sold/Exchanged status handling।

### 2. Profile Page

Route:

```text
/profile/:id
```

শেষ করার বিষয়:

- User header: photo, name, area।
- Own profile হলে `Edit Profile` button।
- অন্য user হলে `Message` button।
- Tabs:

```text
All
Sell
Exchange
```

- User posts grid।
- Empty state।
- Seller/profile relation বোঝার মতো mock data।

### 3. Messages Page

Route:

```text
/messages
```

শেষ করার বিষয়:

- Conversation list।
- Chat window।
- Chat header।
- Sticky/visible book reference card।
- Empty inbox state।
- Empty conversation state।
- Mock send message behavior।
- Conversation/message data shape বোঝার মতো mock data।

### 4. Saved Books Page

Route:

```text
/saved
```

শেষ করার বিষয়:

- Saved posts grid।
- Sell এবং Exchange post support।
- Empty state।
- Remove saved behavior mock।
- Saved relation data shape বোঝা।

### 5. Auth Frontend Behavior

শেষ করার বিষয়:

- Logged-out বনাম logged-in navbar state।
- Protected actions decide:
  - Post a Book
  - Save
  - Message
  - Profile
- Logged-out user protected action করলে `/login` redirect/mock behavior।
- Login/signup page থেকে mock logged-in state simulate করা যাবে কিনা decide করা।
- Backend auth connect করার আগে frontend guard pattern final করা।

### 6. Post Page Final Polish

শেষ করার বিষয়:

- Sell flow full test।
- Exchange flow full test।
- Manual offered book + front cover photo test।
- Wanted book manual fallback test।
- Photo upload/remove/max 4 test।
- Review card test।
- Mock publish success state।
- Query preselect support:

```text
/post?type=sell
/post?type=exchange
```

### 7. API/Data Contract Cleanup

Backend শুরু করার আগে frontend data contract central জায়গায় লিখে/গুছিয়ে নিতে হবে।

শেষ করার বিষয়:

- Common post data shape।
- Sell post shape।
- Exchange post shape।
- User shape।
- Saved shape।
- Conversation shape।
- Message shape।
- Notification shape if needed।
- Mock API/service layer।
- Components যেন scattered mock data-এর ওপর বেশি depend না করে।

### 8. Backend Start Condition

Backend শুরু করা যাবে যখন:

- Core pages-এর UI flow mock mode-এ বোঝা যায়।
- Required data fields পরিষ্কার।
- Auth/protected action behavior ঠিক।
- Post, message, saved, profile relation বোঝা যায়।
- `design.md` latest decisions reflect করে।

## Book Details Page

### লক্ষ্য

Book Details page হবে একটি post-এর decision page। User এখানে বইয়ের identity, real condition, price/status, wanted exchange info, seller info দেখে সিদ্ধান্ত নেবে seller/owner-কে message করবে কি না।

Website-এর visible UI copy আপাতত English থাকবে।

### Route

```text
/books/:id
```

একটাই route থাকবে। Post type অনুযায়ী Sell অথবা Exchange variation দেখাবে।

### MVP Scope

Included:

- Sell details।
- Exchange details।
- Media/gallery।
- Action panel।
- Description blocks।
- Seller mini info action panel-এর ভিতরে।
- Message primary action।
- Save secondary action।
- Status/missing data states।

Excluded for MVP:

- Similar posts।
- আলাদা full seller block।
- Lightbox/zoom modal।
- Reviews/ratings।
- Report listing।
- Share button।

### Page Section Order

Desktop:

```text
Back link -> Main detail area -> Description area
```

Main detail area:

- Left: media/gallery।
- Right: action/details panel।

Description area:

- `About this book`
- `Seller note`

Mobile:

```text
Back link -> Media/gallery -> Title/price/action -> Key details -> Description area
```

Mobile-এ action panel-এর content natural order-এ stack হবে।

### Primary Action

Book Details page-এর primary action হবে messaging।

Sell post:

```text
Message Seller
```

Exchange post:

```text
Message Owner
```

Rules:

- Message button সবচেয়ে prominent হবে।
- Message button primary black button style ব্যবহার করবে।
- Save secondary action হবে।
- Seller profile link lower-priority action হবে।
- Sold/Exchanged হলে Message disabled হবে।
- Logged-out user Message/Save চাপলে `/login` redirect অথবা login prompt দেখানো যাবে।

### Desktop Layout

- Page background: `#FAF7EF`
- Max-width: around `1180px`
- `1024px+` থেকে two-column layout।
- Left media/gallery বড় হবে।
- Right action panel around `360px` থেকে `400px`।
- Action panel top-aligned থাকবে।
- Action panel overly sticky করা হবে না; MVP-তে normal panel enough।
- Description area নিচে full-width থাকবে।

### Responsive Behavior

Professional/simple responsive rule:

```text
<1024px: single column
1024px+: media + action two column
```

Mobile/tablet:

- Single column।
- Media first।
- Title/price/action immediately after media।
- Message button full-width।
- Save button secondary full-width বা side-by-side, available width অনুযায়ী।
- Gallery thumbnails horizontal scroll অথবা compact grid।
- Exchange covers small screen-এ readable থাকতে হবে।
- Long title 2-3 line পর্যন্ত যাবে, layout ভাঙবে না।
- Long location wrap/truncate safely হবে।
- No sticky action panel।

Very small mobile:

- Buttons full-width stack।
- Price/status line wrap করবে।
- Thumbnails ছোট হবে।
- Text compact থাকবে, hero-size হবে না।

### Media/Gallery Behavior

Gallery goal:

- User যেন বইয়ের identity এবং real condition দ্রুত বুঝতে পারে।

#### Sell Post Media

Official/database match হলে:

- Main image প্রথমে official cover দেখাবে।
- Thumbnail list/grid-এ থাকবে:
  - official cover
  - seller uploaded photos
- Thumbnail click করলে main image বদলাবে।
- Official cover thumbnail badge:

```text
Cover
```

- Seller photo thumbnail badge:

```text
Photo
```

Manual/unmatched হলে:

- Main image প্রথমে manual front cover photo দেখাবে।
- Thumbnail list/grid-এ থাকবে:
  - front cover photo
  - condition photos
- Front cover photo badge: `Cover`
- Condition photo badge: `Photo`

#### Exchange Post Media

Default main visual:

- Exchange poster composition।
- Offered book cover।
- Wanted book cover।
- Center exchange icon।

Thumbnail list/grid:

- `Exchange view` thumbnail।
- Seller uploaded condition photos।

Thumbnail behavior:

- `Exchange view` click করলে two-cover exchange composition main visual-এ দেখাবে।
- Seller photo click করলে seller photo main visual-এ বড় হবে।
- Offered/wanted cover আলাদা thumbnail হিসেবে রাখার দরকার নেই, কারণ exchange composition-এ দুটোই দেখা যাবে।

MVP:

- Inline gallery only।
- Lightbox/zoom modal থাকবে না।
- Selected thumbnail dark border পাবে।

Missing media:

- Seller photos ideally missing হবে না, কারণ Post flow photo required।
- Cover missing হলে generated fallback cover।
- Broken image হলে soft placeholder।

### Sell Action Panel

Order:

1. Badge:

```text
For Sale
```

2. Title + author।
3. Price row:
   - price বড় করে।
   - `Negotiable` badge if true।
4. Primary actions:
   - `Message Seller`
   - `Save` / `Saved`
5. Key details:
   - Condition
   - Category
   - Location
   - Posted date
6. Seller mini info:
   - Avatar
   - Seller name
   - Area
   - `View Profile`
7. Sold state if applicable:
   - `Sold` badge।
   - Message disabled।
   - Status text:

```text
This book is sold
```

### Exchange Action Panel

Order:

1. Badge:

```text
Exchange
```

2. Offered book:

```text
Offering
```

- Title।
- Author।

3. Wanted book:

```text
Wants
```

- Title।
- Author।
- Wanted section visually slightly highlighted, কারণ exchange decision-এর জন্য important।

4. Primary actions:
   - `Message Owner`
   - `Save` / `Saved`
5. Key details:
   - Condition
   - Category
   - Location
   - Posted date
6. Seller mini info:
   - Avatar
   - Seller name
   - Area
   - `View Profile`
7. Exchanged state if applicable:
   - `Exchanged` badge।
   - Message disabled।
   - Status text:

```text
This exchange is complete
```

### Description Area

Description area main detail area-এর নিচে থাকবে।

Blocks:

```text
About this book
Seller note
```

About this book:

- Official/database description থাকলে দেখাবে।
- Official description না থাকলে block hide হবে।
- এটা বইয়ের general information; real condition note নয়।

Seller note:

- Seller/user-written note থাকলে দেখাবে।
- Condition, edition, page issue, pickup instruction, exchange preference ইত্যাদি এখানে থাকবে।
- Seller note না থাকলে block hide হবে।

Design:

- Full-width simple section।
- Card-এর ভিতরে card না।
- Subtle white/warm panel বা section separation।
- Text readable হবে।

### Seller Info

MVP-তে আলাদা seller block থাকবে না।

Action panel-এর ভিতরে seller mini info থাকবে:

- Avatar।
- Seller name।
- Area/location।
- `View Profile` link।

Reason:

- User trust-এর জন্য seller identity দরকার।
- কিন্তু আলাদা seller section MVP-তে page length বাড়াবে।

### Status And Missing States

Sell:

- Active: `Message Seller` enabled।
- Sold:
  - `Sold` badge।
  - Message button disabled।
  - Text: `This book is sold`

Exchange:

- Active: `Message Owner` enabled।
- Exchanged:
  - `Exchanged` badge।
  - Message button disabled।
  - Text: `This exchange is complete`

Missing data:

- Cover missing: generated fallback cover।
- Seller photos missing: soft placeholder, though post flow requires photos।
- Official description missing: hide `About this book`।
- Seller note missing: hide `Seller note`।
- Logged-out protected action: login redirect/prompt।

### UI Copy

Buttons:

```text
Message Seller
Message Owner
Save
Saved
View Profile
Back to books
Login to message
Login to save
```

Labels:

```text
For Sale
Exchange
Price
Condition
Category
Location
Posted
Wanted book
Offered book
Offering
Wants
About this book
Seller note
Cover
Photo
Exchange view
```

Status:

```text
Sold
Exchanged
This book is sold
This exchange is complete
```

### Colors

Page:

- Page background: `#FAF7EF`
- Main surface: `#FFFDF8`
- Card/panel background: `#FFFFFF`
- Border: `#D6CCBA`
- Soft border: `#E8DFD1`

Text:

- Primary text: `#111827`
- Secondary text: `#4F5865`
- Muted text: `#8A8173`

Badges:

- For Sale background: `#EAF4EE`
- For Sale text: `#14532D`
- Exchange background: `#EAF2FF`
- Exchange text: `#1D4ED8`
- Negotiable background: `#FFE8A3`
- Negotiable text: `#7C2D12`
- Sold background: `#FEE2E2`
- Sold text: `#991B1B`
- Exchanged background: `#EDE9FE`
- Exchanged text: `#6D28D9`

Buttons:

- Primary Message background: `#111827`
- Primary Message text: `#FFFFFF`
- Primary hover: `#1F2937`
- Disabled button background: `#D1D5DB`
- Disabled button text: `#6B7280`
- Secondary Save background: `#FFFFFF`
- Secondary Save border: `#D6CCBA`
- Secondary Save hover: `#F4EFE6`
- Saved background: `#E6F8EF`
- Saved text: `#14532D`
- Saved border: `#A8EBC4`

Gallery:

- Media background: `#F7F4EC`
- Selected thumbnail border: `#111827`
- Normal thumbnail border: `#D6CCBA`

### Mock Data Shape

Book Details page-এর mock data backend future schema মাথায় রেখে বানানো হবে। Component সরাসরি Buy/Sell card data shape use করবে না; details page-এর richer shape থাকবে। তবে card data এবং details data-এর fields consistent থাকবে।

Suggested type:

```ts
type BookDetailsPost = {
  id: string;
  type: 'sell' | 'exchange';
  status: 'active' | 'sold' | 'exchanged';

  book: {
    title: string;
    author: string;
    category: string;
    condition: string;
    officialCoverUrl?: string;
    fallbackCoverColor: string;
    officialDescription?: string;
    source: 'database' | 'manual';
  };

  wantedBook?: {
    title: string;
    author: string;
    officialCoverUrl?: string;
    fallbackCoverColor: string;
    source: 'database' | 'manual';
  };

  sellerPhotos: string[];

  price?: number;
  priceLabel?: string;
  negotiable?: boolean;

  location: string;
  sellerNote?: string;

  seller: {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
    area: string;
  };

  createdAt: string;
};
```

Minimum mock posts:

1. Active Sell post।
2. Active Exchange post।
3. Sold Sell post।
4. Exchanged post।
5. Manual/fallback cover post।

## Profile Page

### লক্ষ্য

Profile page হবে seller/reader identity এবং তার active book posts দেখানোর জায়গা। User এখানে এসে বুঝবে seller কে, কোথায় আছে, এবং তার আর কী কী active বই আছে।

Website-এর visible UI copy আপাতত English থাকবে।

### Route

```text
/profile/:id
```

### MVP Scope

Included:

- Profile header।
- Other profile বনাম own profile action।
- Stats।
- Tabs।
- Active posts grid।
- Empty state।

Excluded for MVP:

- Donate tab।
- Sold/Exchanged history।
- Reviews/ratings।
- Seller verification।
- Saved seller।
- Profile edit modal/page।

### Page Section Order

```text
Back Link -> Profile Header -> Tabs -> Posts Grid -> Empty State
```

Back link:

```text
Back to books
```

### Profile Behavior

Other profile:

- Primary action:

```text
Message
```

- Active posts দেখাবে।
- Edit/manage actions থাকবে না।

Own profile:

- Primary action:

```text
Edit Profile
```

- Secondary action:

```text
Post a Book
```

- `Message` button থাকবে না।
- Own active posts দেখাবে।

MVP mock:

```ts
const currentUserId = 'nadia-rahman';
const isOwnProfile = profile.id === currentUserId;
```

Later backend auth:

```ts
const isOwnProfile = loggedInUser.id === profile.id;
```

Logged-out behavior:

- Other profile দেখা যাবে।
- Protected action যেমন `Message` চাপলে `/login` redirect বা login prompt দেখানো হবে।
- Logged-out অবস্থায় own profile concept থাকবে না।

### Profile Header

Header panel clean bordered surface হবে।

Content:

- Avatar।
- Name।
- Area/location।
- Optional short bio।
- Stats row।
- Actions।

Header label:

```text
Reader Profile
```

Stats:

```text
Active Posts
Sell
Exchange
Joined
```

Rules:

- Donate stat থাকবে না।
- Active posts only count হবে।
- Sold/Exchanged posts count হবে না।
- Joined পরে backend `user.createdAt` থেকে আসবে।

Example:

```text
8 Active Posts
5 Sell
3 Exchange
Joined 2026
```

### Tabs

Tabs:

```text
All
Sell
Exchange
```

Behavior:

- `All` default।
- `Sell` শুধু active sell posts দেখাবে।
- `Exchange` শুধু active exchange posts দেখাবে।
- Donate tab থাকবে না, কারণ MVP-তে donation posting inactive।

### Posts Grid

Profile page-এ marketplace rich card reuse করা হবে না। Profile-specific normalized compact card ব্যবহার করা হবে।

Reason:

- Profile page-এর কাজ seller-এর collection দ্রুত scan করা।
- Buy/Sell এবং Exchange rich cards mixed হলে layout uneven হতে পারে।
- Compact same-size cards profile page clean এবং predictable রাখবে।

Grid:

- Desktop: 3 columns।
- Tablet: 2 columns।
- Mobile: 1 column।
- Active posts only।
- Sold/Exchanged posts hide থাকবে MVP-তে।

Card click:

```text
/books/:id
```

### Profile Post Card

Structure:

- Top image area।
- Type badge।
- Condition badge।
- Title।
- Author।
- Footer with price/status + location।

Image area:

- Fixed ratio: `4:5`
- Background: `#F7F4EC`
- Sell হলে official cover/manual front cover center।
- Exchange হলে offered cover main থাকবে।
- Exchange wanted cover ছোট overlay bottom-right থাকবে।
- Exchange icon optional; badge enough হলেও চলবে।

Badges:

```text
For Sale
Exchange
Good
New
Like New
Fair
Poor
```

Text:

- Title max 2 lines।
- Author 1 line।
- Sell footer: price, e.g. `৳420`
- Exchange footer: `Exchange`
- Location icon/text।

Card style:

- Card background: `#FFFFFF`
- Border: `#D6CCBA`
- Radius: `8px`
- Hover: slight lift + soft shadow।
- Hover/selected border can become `#111827`।

### Empty State

যদি কোনো active post না থাকে:

Title:

```text
No active posts
```

Text:

```text
This reader does not have any active book posts right now.
```

Own profile action:

```text
Post a Book
```

Other profile action:

```text
Browse Books
```

### UI Copy

Buttons:

```text
Message
Edit Profile
Post a Book
Browse Books
Login to message
```

Labels:

```text
Back to books
Reader Profile
Active Posts
Sell
Exchange
Joined
All
For Sale
Condition
Location
```

### Colors

Page:

- Page background: `#FAF7EF`
- Header panel background: `#FFFDF8`
- Card background: `#FFFFFF`
- Border: `#D6CCBA`
- Soft border: `#E8DFD1`

Text:

- Primary: `#111827`
- Secondary: `#4F5865`
- Muted: `#8A8173`

Buttons:

- Primary background: `#111827`
- Primary text: `#FFFFFF`
- Primary hover: `#1F2937`
- Secondary background: `#FFFFFF`
- Secondary border: `#D6CCBA`
- Secondary hover: `#F4EFE6`

Stats chips:

- Chip background: `#F7F2E8`
- Chip border: `#D6CCBA`
- Label: `#8A8173`
- Value: `#111827`

Tabs:

- Active tab background: `#111827`
- Active tab text: `#FFFFFF`
- Inactive tab text: `#4F5865`
- Inactive hover: `#F4EFE6`

Badges:

- For Sale background: `#EAF4EE`
- For Sale text: `#14532D`
- Exchange background: `#EAF2FF`
- Exchange text: `#1D4ED8`
- Condition background: `#F4EFE6`
- Condition text: `#5F6673`

Compact card:

- Image background: `#F7F4EC`
- Card hover shadow: `rgba(17, 24, 39, 0.10)`
- Hover border: `#111827`

### Responsive Behavior

Desktop:

- Profile header horizontal layout।
- Avatar/name left।
- Actions right।
- Stats horizontal chips।
- Posts grid 3 columns।

Tablet:

- Header can wrap।
- Stats 2-4 columns depending width।
- Posts grid 2 columns।

Mobile:

- Single column।
- Header compact।
- Avatar top।
- Name/location below।
- Buttons full-width।
- Stats 2-column grid।
- Tabs full-width or horizontally scrollable segmented control।
- Posts grid 1 column।
- No sticky elements।

### Mock Data Direction

Profile page mock data backend user/post relation মাথায় রেখে বানানো হবে।

Suggested shape:

```ts
type ProfileUser = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  area: string;
  bio?: string;
  joinedLabel: string;
};
```

Posts:

- Existing `sellPosts` এবং `exchangePosts` থেকে seller id/name দিয়ে active posts derive করা যাবে।
- Sold/Exchanged posts MVP profile grid থেকে hide থাকবে।
- Profile compact card-এর জন্য common derived shape বানানো ভালো।

## Messages / Inbox Page

### লক্ষ্য

Messages page হবে buyer এবং seller-এর conversation hub। Backend/Socket.io আসার আগে UI flow mock data দিয়ে clear রাখা হবে, যেন পরে `Conversation` এবং `Message` schema/API shape সহজে connect করা যায়।

Website-এর visible UI copy আপাতত English থাকবে।

### Route

```text
/messages
```

### Layout

Desktop:

- App-like two-column shell।
- বাম পাশে fixed-width conversation list।
- ডান পাশে chat window।

Mobile:

- Default screen conversation list।
- Conversation tap করলে chat window।
- Chat header-এ back button থাকবে।

### Page Section Order

```text
Page Header -> Messages Shell -> Conversation List -> Chat Window -> Empty State
```

### Conversation List

প্রতিটা conversation item-এ থাকবে:

- Avatar/initials।
- User name।
- Related book title।
- Last message preview।
- Time।
- Unread dot/count।

States:

- Active conversation highlighted হবে।
- Unread conversation stronger text হবে।
- No conversation হলে empty state।

### Chat Window

Top header:

- User name।
- Small status text, e.g. `About Atomic Habits`।
- Mobile back button।

Book reference card:

- Chat-এর উপরে visible/sticky থাকবে।
- Cover thumbnail।
- Book title।
- Price/status।
- `View Book` button।

Messages:

- Buyer/seller direction অনুযায়ী bubble alignment আলাদা হবে।
- Current user bubble: right aligned।
- Other user bubble: left aligned।
- Timestamp ছোট করে দেখাবে।
- Optional system note থাকবে:

```text
Order and delivery should be confirmed before payment.
```

Input:

- Text input।
- Send button।
- Attachment icon MVP-তে hidden/disabled রাখা যায়।

### Empty States

No conversation:

```text
No messages yet
Start a conversation from a book post.
```

No conversation selected on desktop:

```text
Select a conversation
Choose a message to view the chat.
```

### Mock Behavior

- 4টি mock conversation থাকবে।
- 1টি unread conversation থাকবে।
- Send করলে local state-এ message add হবে।
- Backend এলে Socket.io-client দিয়ে real-time connect হবে।

### Colors

Page:

- Page background: `#FBF8F1`
- Shell/card background: `#FFFDF8`
- Chat background: `#FFFFFF`
- Border: `#D6CCBA`
- Divider: `#E8DFD1`

Text:

- Primary: `#111827`
- Secondary: `#626B78`
- Muted: `#8A8173`

Conversation:

- Active conversation background: `#F4EFE6`
- Hover background: `#F7F4EC`
- Unread dot: `#F9735B`

Message bubbles:

- Current user bubble background: `#111827`
- Current user bubble text: `#FFFFFF`
- Other bubble background: `#F7F4EC`
- Other bubble text: `#111827`
- System note background: `#FFF3D6`
- System note text: `#7C4A03`

### Responsive Behavior

Desktop:

- Shell height viewport-friendly হবে।
- Conversation list left side।
- Chat window right side।
- Book reference card top area-এ থাকবে।
- Input bottom area-এ থাকবে।

Mobile:

- Single panel view।
- List and chat একই সাথে দেখা যাবে না।
- Conversation select করলে chat screen।
- Back button দিয়ে list screen।
- Input bottom sticky feel থাকবে।

## Saved Books Page

### লক্ষ্য

Saved Books page হবে user-এর পরে দেখার জন্য save করা বইগুলোর দ্রুত scan/compare করার জায়গা। এটি marketplace browsing page না; তাই এখানে বড় rich grid card ব্যবহার করা হবে না।

Website-এর visible UI copy আপাতত English থাকবে।

### Route

```text
/saved
```

### Final Layout Direction

Reference design থেকে left-side list layout idea নেওয়া হবে:

- বামে saved book list থাকবে।
- ডানে summary panel থাকবে।
- List rows horizontal divider দিয়ে আলাদা হবে।
- Cart/order summary-এর মতো checkout concept থাকবে না।
- Tabs/filter থাকবে না; summary count যথেষ্ট।

### Page Structure

```text
Page Header -> Saved List -> Saved Summary Panel -> Empty State
```

Header copy:

```text
Saved Books
Books you saved to check later.
```

### Saved Row

প্রতিটা saved row-তে থাকবে:

- Cover thumbnail।
- Title।
- Author।
- Type badge:
  - `For Sale`
  - `Exchange`
- Condition।
- Location।
- Price/status:
  - Sell হলে price।
  - Exchange হলে `Exchange`।
- Actions:
  - `View Details`
  - `Remove`

Row behavior:

- `View Details` click করলে `/books/:id` route-এ যাবে।
- `Remove` MVP mock action হিসেবে থাকবে; backend পরে আসবে।
- Entire row card-click না করলেও চলবে, কারণ action buttons স্পষ্ট থাকবে।

### Summary Panel

Right-side panel content:

```text
Saved Summary
Total Saved
For Sale
Exchange
Browse Books
```

Rules:

- Desktop-এ summary panel right side-এ থাকবে।
- Panel subtle sticky হতে পারে, কিন্তু mobile-এ sticky থাকবে না।
- `Browse Books` button `/buy-sell` route-এ যাবে।

### Empty State

যদি saved item না থাকে:

Title:

```text
No saved books yet
```

Text:

```text
Save books you like and find them here later.
```

Button:

```text
Browse Books
```

Button route:

```text
/buy-sell
```

### Colors

Page:

- Page background: `#FBF8F1`
- Row/card background: `#FFFDF8`
- Summary panel background: `#FFFFFF`
- Border: `#D6CCBA`
- Divider: `#E8DFD1`

Text:

- Primary: `#111827`
- Secondary: `#626B78`
- Muted: `#8A8173`

Buttons:

- Primary background: `#111827`
- Primary text: `#FFFFFF`
- Primary hover: `#1F2937`
- Secondary/remove border: `#D6CCBA`
- Secondary/remove text: `#626B78`
- Secondary/remove hover: `#F4EFE6`

Badges:

- For Sale background: `#EAF4EE`
- For Sale text: `#14532D`
- Exchange background: `#EAF2FF`
- Exchange text: `#1D4ED8`
- Condition background: `#F4EFE6`
- Condition text: `#5F6673`
- Price accent: `#FFE8A3`

### Responsive Behavior

Desktop:

- Two-column layout।
- Left list wider।
- Right summary panel fixed/narrow।
- Row layout horizontal: text left, cover/actions right।

Tablet:

- Summary panel can stack above or below list।
- Rows stay readable with cover thumbnail on right।

Mobile:

- Single column।
- Summary panel below header or below list।
- Saved rows stack vertically।
- Cover thumbnail can move above or right depending available width।
- Buttons full-width or side-by-side if space allows।

### Mock Data Direction

MVP mock data existing `sellPosts` এবং `exchangePosts` থেকে নেওয়া হবে।

Rules:

- Sold sell posts saved list-এ দেখানো হবে না।
- Exchanged posts saved list-এ দেখানো হবে না।
- 4-6টি saved item যথেষ্ট।
- Backend এলে user-specific saved relation/API থেকে data আসবে।

## Navigation System

### লক্ষ্য

Boi Station-এ দুই ধরনের navigation থাকবে, কারণ Home page একটি landing experience এবং browse/app pages marketplace experience।

### Landing/Public Navbar

Used on:

```text
/
```

Purpose:

- Public user-কে landing page-এর sections explore করতে সাহায্য করবে।
- Login করার আগে platform বোঝার সুযোগ দেবে।
- App-level actions দেখাবে না।

Links:

```text
Home
Why Boi Station
Features
Recent Books
```

Actions:

```text
Login
Sign Up
```

Behavior:

- Links page sections-এ scroll করবে।
- `Login` এবং `Sign Up` আপাতত `/login` route-এ যাবে।
- Mobile-এ section links menu/drawer-এর ভিতরে যাবে।
- Search icon থাকতে পারে, কিন্তু app-level saved/notification/profile actions থাকবে না।

Style:

- Home hero-এর সাথে blend করার জন্য outer background: `#8BE8B1`
- Inner navbar background: `#FFFDF8`
- Border: `#D6CCBA`
- Rounded pill/shelf style।
- Logo mark হবে small book-spine stack।

### Marketplace/App Navbar

Used on:

```text
/buy-sell
/exchange
/donate
/books/:id
/profile/:id
```

Purpose:

- Browse pages এবং logged-in app pages-এর main navigation।
- Public browsing allow করবে।
- Account actions auth state অনুযায়ী দেখাবে।

Main links:

```text
Buy & Sell
Exchange
Donate
```

Logged-out actions:

```text
Search
Login
Sign Up
```

Logged-in actions:

```text
Search
Saved
Notifications
Profile
Post a Book
```

Behavior:

- Public users `/buy-sell`, `/exchange`, `/donate`, এবং future `/books/:id` browse করতে পারবে।
- Posting, saving, messaging, notifications, profile edit protected থাকবে।
- Real auth যোগ হলে navbar auth store/context থেকে user state পড়বে।
- Current implementation mock state ব্যবহার করে:

```text
isAuthenticated = false
```

Later:

```text
isAuthenticated = Boolean(user)
```

Mobile behavior:

- Logged-out mobile: Logo, Search, Menu visible।
- Logged-in mobile: Logo, Search, Notification, Profile, Menu visible।
- Drawer-এ page links এবং auth-specific actions থাকবে।

Style:

- Browse pages outer background: `#FAF7EF`
- Inner navbar background: `#FFFDF8`
- Border: `#D6CCBA`
- Active nav link: `#111827` background, white text।
- Active link-এ small green book-spine strip: `#7DE3A5`
- Icon hover background: `#EEE8DC`

## Homepage Hero Section

### লক্ষ্য

Hero section দেখেই যেন বোঝা যায় Boi Station একটি friendly, trustworthy, book-focused, community-driven বইয়ের প্ল্যাটফর্ম।

এখানে মানুষ বাংলাদেশে বই কিনতে, বিক্রি করতে, বিনিময় করতে এবং দান করতে পারবে। Website-এর visible language আপাতত English থাকবে। পরে Bangla language support যোগ করা হতে পারে।

### Final Hero Direction

- Style হবে mild mint outer background + warm-white rounded hero panel।
- Mood হবে clean, calm, approachable, practical।
- Visual identity হবে modern book marketplace; শুধু online library মনে হওয়া যাবে না।
- Layout হবে left side-এ strong text ও CTA, right side-এ custom bookshelf marketplace illustration।
- Mobile priority হবে আগে message ও CTA, তারপর illustration।

### Hero Structure

Desktop structure:

1. Full-width mint hero background থাকবে।
2. তার ভিতরে max-width container থাকবে।
3. Container-এর ভিতরে বড় warm-white rounded hero panel থাকবে।
4. Hero panel-এর ভিতরে two-column layout থাকবে:
   - Left column: label, headline, subtext, CTA buttons, trust hints।
   - Right column: custom bookshelf marketplace illustration।
5. Hero-এর পরের section lighter mint background ব্যবহার করবে, যাতে opening area connected লাগে কিন্তু section আলাদা বোঝা যায়।

Mobile structure:

1. Mint outer background থাকবে।
2. Hero panel প্রায় full-width হবে, কিন্তু comfortable side padding থাকবে।
3. Content left-aligned থাকবে।
4. Content order হবে:
   - Label
   - H1
   - Subtext
   - CTA buttons
   - Trust hints
   - Illustration
5. Main content এবং CTA প্রথমে দেখা যাবে।
6. Illustration দেখতে সামান্য scroll লাগলে সমস্যা নেই।
7. Mobile viewport-এ text, button, spacing cramped হয়ে গেলে সবকিছু একসাথে fit করানোর চেষ্টা করা যাবে না।

### Hero Copy

Label:

```text
Books for everyone in Bangladesh
```

H1:

```text
Buy, sell, exchange, or donate books in one place
```

Subtext:

```text
Find affordable books, pass on unused ones, and help books reach new readers across Bangladesh.
```

Primary CTA:

```text
Find Books
```

Secondary CTA:

```text
Post a Book
```

Trust hints:

```text
Affordable books
Exchange & donate
Local readers
```

### Colors

Primary section colors:

- Hero outer background: `#8BE8B1`
- Next section background: `#DFF8E9`
- Hero panel background: `#FFFDF8`
- Primary text: `#111827`
- Secondary text: `#5F6673`
- Border: `#E7DFD0`

Button colors:

- Primary button background: `#111827`
- Primary button text: `#FFFFFF`
- Primary button hover: `#243041`
- Secondary button background: `transparent`
- Secondary button text: `#111827`
- Secondary button border: `#D8D2C4`
- Secondary button hover background: `#F4EFE6`

Illustration accent colors:

- Soft green: `#7DE3A5`
- Muted yellow: `#F4D35E`
- Soft purple: `#A78BFA`
- Soft coral: `#F9735B`
- Pale blue: `#93C5FD`
- Line color: `#111827`

### Typography

- Headline font: `Sora`
- Body/UI font: `Inter`

Recommended font usage:

- H1: Sora, weight `700` অথবা `800`
- Body text: Inter, weight `400` অথবা `500`
- Buttons: Inter অথবা Sora, weight `600`

Recommended H1 sizes:

- Desktop: `56px` থেকে `68px`
- Tablet: `44px` থেকে `52px`
- Mobile: `36px` থেকে `42px`
- H1 line-height: `1.05` থেকে `1.12`
- Letter spacing: `0`

### CTA Style

- Primary CTA strong black button হবে।
- Secondary CTA outlined অথবা clean text-style button হবে।
- Very small mobile screen-এ buttons stacked full-width হতে পারে।
- Normal mobile width-এ buttons পাশাপাশি থাকতে পারে, যদি text comfortably fit করে।

### Illustration Direction

Right-side visual হবে custom bookshelf marketplace illustration।

Recommended implementation:

- Custom SVG বা code-native illustration ব্যবহার করা ভালো।
- Lightweight, responsive, theme-friendly হতে হবে।
- Black outline + soft accent fill ব্যবহার করা হবে।
- Heavy gradient বা অতিরিক্ত decorative effect এড়ানো হবে।

Illustration elements:

- দুই বা তিন row-এর bookshelf।
- বিভিন্ন size-এর books।
- কিছু বই vertical, কিছু leaning।
- ছোট tag বা label:
  - `Sell`
  - `Swap`
  - `Donate`
- ছোট `৳` price tag।
- ছোট exchange arrow hint।
- ছোট donation/heart hint।
- Optional book card stack, যাতে marketplace post-এর ধারণা আসে।

Illustration যে message দেবে:

```text
This is not just a library. This is a book marketplace and community platform.
```

### Section Transition

Final selected option:

- Hero outer background: `#8BE8B1`
- Why Boi Station section background: `#DFF8E9`
- Why cards: `#FFFDF8`

এই combination opening area-কে visually connected রাখবে, আবার next section আলাদা বোঝাও যাবে।

## Why Boi Station Section

### লক্ষ্য

Hero section-এর পর এই section user-কে দ্রুত বোঝাবে কেন Boi Station ব্যবহার করা useful। এখানে trust, affordability, reuse, easy posting, এবং broad reader coverage পরিষ্কারভাবে communicate করতে হবে।

### Final Design Direction

Option 1: Clean Card Grid lock করা হয়েছে।

- Background হবে `#DFF8E9`।
- Section header center-aligned থাকবে।
- ৪টা benefit card থাকবে।
- Desktop-এ ৪ column grid।
- Tablet-এ ২ column grid।
- Mobile-এ ১ column grid।
- Cards হবে clean, readable, এবং left-aligned।
- Design হবে simple, trustworthy, এবং easy to scan।

### Section Copy

Title:

```text
Why Boi Station
```

Subtitle:

```text
A simple way to keep books moving between readers.
```

### Cards

Card 1:

```text
Affordable Books
```

```text
Find new and used books at lower prices.
```

Card 2:

```text
Less Book Waste
```

```text
Give unused books a second life through selling, donating, or exchanging.
```

Card 3:

```text
Easy to Post
```

```text
Create a book post with clear details in just a few steps.
```

Card 4:

```text
For Every Reader
```

```text
Browse academic, fiction, children’s, religious, career, and more.
```

### Card Style

- Card background: `#FFFDF8`
- Card border: `#CFE8D8`
- Card radius: `8px`
- Shadow: very subtle, or no shadow if border is enough।
- Card text alignment: left।
- Card spacing: comfortable padding, not cramped।

### Icon Style

- প্রতিটা card-এ small rounded square বা pill icon background থাকবে।
- Icon color হবে `#111827`।
- Icon style হবে simple line icon।
- Icon container overly rounded হবে না; 8px radius enough।

Suggested icon accent backgrounds:

- Affordable Books: `#F4D35E`
- Less Book Waste: `#7DE3A5`
- Easy to Post: `#93C5FD`
- For Every Reader: `#A78BFA`

### Typography

- Section title: Sora, bold।
- Section subtitle: Inter, regular অথবা medium।
- Card title: Sora, `18px` থেকে `20px`, weight `700`।
- Card description: Inter, `14px` থেকে `15px`, color `#5F6673`।

### Spacing

- Desktop section padding: around `88px 24px`।
- Mobile section padding: around `56px 16px`।
- Grid gap: `18px` থেকে `24px`।

### Mobile Behavior

- Mobile-এ cards একটার নিচে একটা stack হবে।
- Text left-aligned থাকবে।
- Icon, title, description clearly readable থাকতে হবে।
- Card height content অনুযায়ী natural হবে; জোর করে সব card একই height করা জরুরি না, তবে desktop grid-এ visually balanced দেখানো ভালো।

## Feature Preview Sections

### লক্ষ্য

এই অংশে homepage থেকে Boi Station-এর ৪টা main feature-এর short preview দেওয়া হবে। এখানে full details থাকবে না, কারণ প্রতিটা feature-এর আলাদা full page আছে।

Features:

- Post a Book -> `/post`
- Buy & Sell -> `/buy-sell`
- Exchange Books -> `/exchange`
- Donate Books -> `/donate`

### Final Design Direction

Option 1: Alternating Feature Rows lock করা হয়েছে।

- প্রতিটা feature আলাদা full-width row হবে।
- Desktop-এ text এবং visual দুই column-এ থাকবে।
- এক row-তে text left, visual right; পরের row-তে visual left, text right।
- Mobile-এ সবসময় text first, visual second থাকবে।
- Visual জায়গাগুলো আপাতত intentionally empty/placeholder রাখা হবে, যাতে পরে সেখানে final visual বা illustration বসানো যায়।

### Feature Group Intro

Feature rows শুরু হওয়ার আগে একটি short intro heading থাকবে।

Title:

```text
What you can do on Boi Station
```

Subtitle:

```text
Choose the way you want to pass books forward.
```

### Background Flow

Why Boi Station section-এর mint background থেকে বের হয়ে feature sections neutral warm zone-এ যাবে।

Background sequence:

- Feature group intro: `#FFFDF8`
- Post a Book row: `#FFFDF8`
- Buy & Sell row: `#F7F4EC`
- Exchange Books row: `#FFFDF8`
- Donate Books row: `#F7F4EC`

### Layout Pattern

Desktop:

- Post a Book: text left, visual placeholder right।
- Buy & Sell: visual placeholder left, text right।
- Exchange Books: text left, visual placeholder right।
- Donate Books: visual placeholder left, text right।

Mobile:

- সব feature row-তে text first, visual placeholder second।
- Visual placeholder বেশি tall করা যাবে না।
- Text, steps, এবং CTA primary focus থাকবে।

### Spacing And Width

- Desktop row padding: around `88px 24px`।
- Mobile row padding: around `56px 16px`।
- Content max-width: hero/why section-এর max-width-এর সাথে consistent হবে।
- Text block max-width: around `480px`।
- Visual placeholder max-width: around `520px`।
- দুই column-এর gap generous হবে, কিন্তু content disconnected লাগা যাবে না।

### Step List Style

প্রতিটা feature row-তে ৩টা step থাকবে।

- Step marker হবে small numbered circle: `01`, `02`, `03`।
- Marker background হবে soft accent color।
- Step text short এবং readable হবে।
- Heavy timeline বা বড় instructional layout করা হবে না।

### Button Style

- সব feature row-এর CTA button একই style হবে।
- Button হবে solid black।
- Button background: `#111827`
- Button text: `#FFFFFF`
- Button hover: `#243041`
- Button radius hero CTA-এর সাথে consistent থাকবে।

### Visual Placeholder Direction

Visual জায়গাগুলো এখন blank/placeholder হিসেবে রাখা হবে।

Placeholder requirements:

- Layout-এ visual column-এর জায়গা reserve থাকবে।
- Placeholder যেন final design-এ broken বা unfinished না লাগে।
- Placeholder simple bordered area, subtle warm background, অথবা minimal empty block হতে পারে।
- পরে এখানে custom visual/illustration/mockup বসানো হবে।

Future visual ideas:

- Post a Book: mini post form preview।
- Buy & Sell: book listing card/grid preview।
- Exchange Books: two book cards with swap arrows।
- Donate Books: donation book card with heart/hand hint।

### Feature Copy

#### Post a Book

Title:

```text
Post a Book
```

Description:

```text
Share a book you want to sell, exchange, or donate in just a few steps.
```

Steps:

```text
Add book details
Upload photos and set terms
Publish your post
```

Button:

```text
Post a Book
```

## Auth Implementation Decisions

এই অংশ auth implementation-এর locked decision হিসেবে থাকবে। Backend এবং frontend দুই জায়গাতেই এই flow follow করা হবে।

### Scope

- MVP auth email/password দিয়ে শুরু হবে।
- Google login button UI-তে থাকবে, কিন্তু OAuth credentials ready না হওয়া পর্যন্ত inactive/coming soon থাকবে।
- Email verification MVP-তে থাকবে না।

### Signup

- Fields: `Name`, `Email`, `Password`, `Confirm Password`।
- `username` signup form-এ নেওয়া হবে না।
- Backend `name`/`email` থেকে username auto-generate করবে।
- Duplicate username হলে number suffix যোগ হবে।
- Password minimum 8 characters।
- Signup success হলে user auto logged-in হবে।

### Login

- Fields: `Email`, `Password`।
- Login success হলে token save হবে।
- Wrong credential error copy: `Invalid email or password`।
- Direct login success হলে `/buy-sell` route-এ যাবে।

### Token And Current User

- MVP-তে token `localStorage`-এ থাকবে।
- API request header:

```text
Authorization: Bearer <token>
```

- App load হলে token থাকলে `/api/auth/me` call হবে।
- Token invalid/expired হলে local session clear হবে।
- Future production hardening-এ httpOnly cookie + refresh token consider করা হবে।

### Protected Behavior

- Protected pages: `/post`, `/saved`, `/messages`।
- Protected actions: Save, Message Seller, Post a Book।
- Logged-out user protected target খুললে `/login?redirect=/target-page` যাবে।
- Login/signup success হলে redirect target থাকলে সেখানে ফিরবে।

### Logout

- Frontend token remove করবে।
- Current user clear হবে।
- Navbar logged-out state দেখাবে।

### Auth Response Shape

```js
{
  success: true,
  token,
  user
}
```

## Backend Data Contract

এই অংশ backend শুরু করার আগে locked decision হিসেবে থাকবে। Frontend এখন mock data ব্যবহার করছে, কিন্তু backend connect করার সময় এই schema এবং API route list follow করা হবে।

### Backend Stack

```text
Node.js + Express.js + MongoDB + Mongoose + JWT + bcrypt + Socket.io + Cloudinary
```

- MongoDB data store হিসেবে থাকবে।
- Mongoose schema/model এবং validation handle করবে।
- JWT auth session/token handle করবে।
- bcrypt password hash করবে।
- Socket.io realtime messaging handle করবে।
- Cloudinary image upload/storage handle করবে।

### User Schema

```js
User {
  name,
  username,
  email,
  password,
  avatar,
  location,
  bio,
  authProvider,
  role,
  createdAt,
  updatedAt
}
```

Rules:

- `name` required।
- `username` required এবং unique।
- `email` required এবং unique।
- `password` শুধু local email/password account-এর জন্য required।
- `avatar`, `location`, `bio` optional।
- `authProvider`: `"local"` অথবা `"google"`।
- `role`: default `"user"`।
- Email verification MVP-তে থাকবে না।

### BookPost Schema

```js
BookPost {
  type,
  status,

  title,
  author,
  category,
  condition,

  officialBook,
  frontImage,
  sellerImages,

  price,
  isNegotiable,

  wantedBook,

  officialDescription,
  sellerNote,

  owner,
  location,

  createdAt,
  updatedAt
}
```

Rules:

- `type`: `"sell" | "exchange" | "donate"`।
- MVP-তে `donate` visible থাকবে, কিন্তু posting disabled/coming soon।
- `status`: `"active" | "sold" | "exchanged" | "unavailable"`।
- Feed/grid-এ শুধু `active` post দেখানো হবে।
- Sell post হলে `price` required।
- Sell post হলে `isNegotiable` optional/default `false`।
- Exchange post হলে `wantedBook` required।
- `frontImage` required, কারণ official cover না পাওয়া গেলে এটিই main poster হবে।
- `sellerImages` ১-৪টা condition photo।
- `officialBook`, `officialDescription` optional।
- `sellerNote` optional কিন্তু recommended।
- `owner` required user reference।
- `location` required/recommended।

### Conversation Schema

```js
Conversation {
  participants,
  buyer,
  seller,
  bookPost,

  lastMessage,
  lastMessageAt,

  readBy,
  archivedBy,
  blockedBy,

  status,

  createdAt,
  updatedAt
}
```

Rules:

- `participants`: buyer এবং seller দুইজন user reference।
- `buyer`: যে user message শুরু করছে।
- `seller`: book post owner।
- `bookPost`: যে বই নিয়ে conversation।
- একই `buyer + seller + bookPost` duplicate conversation তৈরি করবে না।
- `lastMessage` এবং `lastMessageAt` inbox preview-এর জন্য।
- `readBy`: কোন user conversation read করেছে।
- `archivedBy`: future inbox hide support।
- `blockedBy`: future safety support।
- `status`: `"active" | "closed"`।

### Message Schema

```js
Message {
  conversation,
  sender,

  type,
  text,
  attachments,

  readBy,
  editedAt,
  deletedFor,

  createdAt,
  updatedAt
}
```

Rules:

- `conversation`: Conversation reference।
- `sender`: User reference; system message হলে null হতে পারে।
- `type`: `"text" | "image" | "system"`।
- `text`: text message হলে required।
- `attachments`: future image/file support।
- `readBy`: কোন user message read করেছে।
- `editedAt`: future edit support।
- `deletedFor`: future delete-for-me support।
- MVP-তে active use হবে `conversation`, `sender`, `type`, `text`, `readBy`।

### SavedBook Schema

```js
SavedBook {
  user,
  bookPost,
  createdAt
}
```

Rules:

- `user`: User reference।
- `bookPost`: BookPost reference।
- same `user + bookPost` duplicate হবে না।
- Saved page শুধু logged-in user-এর saved books দেখাবে।
- কোনো book post delete হলে saved record clean করা যাবে অথবা response থেকে ignore করা যাবে।

### API Route List

Professional route design resource-based থাকবে। Public routes login ছাড়া দেখা যাবে, protected routes auth token ছাড়া access করা যাবে না।

#### Auth Routes

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/google
POST /api/auth/logout
GET  /api/auth/me
```

- Signup/login public।
- Logout এবং me auth required।
- Email verification MVP-তে নেই।

#### Books Routes

```text
GET    /api/books
GET    /api/books/:id
POST   /api/books
PATCH  /api/books/:id
PATCH  /api/books/:id/status
DELETE /api/books/:id
```

- `GET /api/books` public।
- `GET /api/books/:id` public।
- Create/update/delete/status update auth required।
- Status update শুধু post owner করতে পারবে।
- Book list query দিয়ে filter/search/pagination handle করবে:

```text
GET /api/books?type=sell&category=Novel&search=atomic&minPrice=100&maxPrice=500&page=1&limit=20
```

#### Upload Routes

```text
POST /api/uploads/images
```

- Auth required।
- Front image এবং seller condition photos Cloudinary-তে upload হবে।
- Response হিসেবে uploaded image URL/metadata return করবে।
- MongoDB-তে image binary রাখা হবে না, শুধু URL/reference রাখা হবে।

#### Official Book Search Routes

```text
GET /api/book-search?q=deep%20work
GET /api/book-search/:sourceId
```

- Frontend সরাসরি Open Library/Google Books call করবে না।
- Backend proxy external book database থেকে official cover/details আনবে।
- Match না পেলে frontend manual entry flow দেখাবে।

#### Users/Profile Routes

```text
GET   /api/users/:id
GET   /api/users/:id/posts
GET   /api/users/me/posts
PATCH /api/users/me
GET   /api/users/check-username?username=labu-cake
```

- Public profile এবং public user posts দেখা যাবে।
- `me/posts`, profile edit, username check logged-in flow-এর জন্য।

#### Saved Routes

```text
GET    /api/saved
POST   /api/saved/:bookId
DELETE /api/saved/:bookId
```

- সব saved routes auth required।
- Same user same book duplicate save করতে পারবে না।

#### Conversations And Messages Routes

```text
GET   /api/conversations
POST  /api/conversations
GET   /api/conversations/:id/messages
POST  /api/conversations/:id/messages
PATCH /api/conversations/:id/read
```

- সব routes auth required।
- `POST /api/conversations` body:

```js
{
  bookPostId
}
```

- Backend current logged-in user-কে buyer ধরবে।
- Seller book post owner থেকে বের হবে।
- Existing `buyer + seller + bookPost` conversation থাকলে সেটাই return করবে।
- না থাকলে নতুন conversation create করবে।
- Socket.io realtime update পরে এই routes-এর সাথে connect হবে।

#### Reports Route

```text
POST /api/reports
```

- MVP-তে optional/future।
- Trust platform হিসেবে fake/scam post বা user report করার জন্য রাখা হবে।

#### Later Routes

```text
Notifications
Order/Delivery
```

- Notification backend পরে messaging/order event-এর সাথে যুক্ত হবে।
- Order/Delivery নিয়ে আলাদা discussion হবে, তাই এখন schema/API locked না।

## Post a Book Page

### লক্ষ্য

Post a Book page হবে user-এর বই post করার guided flow। MVP-তে user শুধু Sell অথবা Exchange post করতে পারবে। Donate platform-এ visible থাকবে, কিন্তু donation posting এখন active হবে না।

Website-এর visible UI copy আপাতত English থাকবে।

### Route

```text
/post
```

Route query support রাখা যায়:

```text
/post?type=sell
/post?type=exchange
```

এই query থাকলে post type pre-selected হতে পারে। যেমন Buy & Sell page থেকে এলে Sell, Exchange page থেকে এলে Exchange।

### Final Layout Direction

Page layout হবে one-step-at-a-time wizard।

Desktop:

- Background: `#FAF7EF`
- Center container max-width: around `1180px`
- Top page header থাকবে।
- Header-এর নিচে horizontal progress indicator থাকবে।
- Main content single focused wizard panel হবে।
- Desktop sticky preview থাকবে না।
- Form panel subtle bordered হবে।
- Final review ছাড়া live preview দেখানো হবে না।

Mobile:

- Single column layout।
- Sticky preview থাকবে না।
- Header compact হবে।
- Progress indicator হবে compact step count + progress bar।
- Current step panel full width হবে।
- Preview শুধু final Preview step-এ দেখানো হবে।
- Option cards, inputs, upload area সব full-width হবে।
- Photo thumbnails ২ column grid হতে পারে।

### Page Header Copy

Title:

```text
Post a Book
```

Subtitle:

```text
Add your book details, choose how you want to share it, and preview before publishing.
```

### Step Flow

Sell flow:

```text
Your Book -> Photos -> Type -> Details -> Preview
```

Exchange flow:

```text
Your Book -> Photos -> Type -> Wanted Book -> Details -> Preview
```

Donate:

- Post type selector-এ Donate option থাকবে।
- Donate disabled থাকবে।
- Donate-এর পাশে `Coming soon` badge থাকবে।
- Donate select করা যাবে না।
- Click/hover করলে helper দেখানো যেতে পারে:

```text
Donation posts are coming soon.
```

### Progress Indicator

Step names:

```text
Your Book
Photos
Type
Wanted Book
Details
Preview
```

Behavior:

- Current step dark state হবে।
- Completed step mint check state হবে।
- Upcoming step muted state হবে।
- Type select করার আগে `Wanted Book` step দেখানো বাধ্যতামূলক নয়।
- Exchange select করলে `Wanted Book` step dynamically add হবে।
- Sell select করলে `Wanted Book` step skip হবে।
- Mobile-এ example:

```text
Step 2 of 5
Step 4 of 6
```

### Preview Direction

Final decision:

- Desktop sticky preview বাদ।
- Mobile/desktop দুই জায়গাতেই preview শুধু শেষ `Review your post` step-এ দেখানো হবে।
- Review step-এ actual browse page card component reuse করা হবে:
  - Sell হলে `SellPostCard`
  - Exchange হলে `ExchangePostCard`
- এতে post preview এবং live feed card একই visual system follow করবে।
- Preview card নতুন করে আলাদা handmade component দিয়ে recreate করা যাবে না, কারণ এতে layout mismatch হওয়ার risk থাকে।

Review card behavior:

- Uploaded seller photos fixed `4:3` thumbnail tile-এর ভেতরে `object-cover` হয়ে বসবে।
- Screenshot/portrait/landscape যেকোনো image card grid নষ্ট করবে না।
- Official cover থাকলে official cover poster area-তে যাবে।
- Manual offered book হলে uploaded front cover photo poster area-তে যাবে।
- Wanted book manual হলে generated fallback cover ব্যবহার হবে।
- Wanted book official match হলে database cover ব্যবহার হবে।

### Step 1: Your Book

Purpose:

- User যে বই post করছে সেটা identify করা।

Title:

```text
Which book are you posting?
```

Subtitle:

```text
Search the book database or add the book manually.
```

Search input placeholder:

```text
Search by book title
```

Suggestion list:

- Small cover thumbnail
- Book title
- Author
- Publisher/year if available
- `Select` action

Selected book summary:

- Cover
- Title
- Author
- Badge:

```text
Selected book
```

- Action:

```text
Change
```

No result:

```text
No matching books found.
```

Manual action:

```text
Add manually
```

Manual fields:

```text
Book title
Author
Publisher or year (optional)
Short description (optional)
Front cover photo
```

Manual offered book rule:

- User যদি database match না নিয়ে manual book add করে, তাহলে `Front cover photo` required।
- এই front cover photo official poster/cover-এর জায়গায় ব্যবহার হবে।
- User-এর condition photos এই step-এ নয়; condition photos পরের `Photos` step-এ যাবে।

Required:

- Database book selected, অথবা
- Manual `Book title` + `Author` + `Front cover photo`

### Step 2: Photos

Purpose:

- Seller-এর নিজের বইয়ের real condition দেখানো।

Title:

```text
Add photos of your book
```

Subtitle:

```text
Upload clear photos that show the real condition.
```

Upload text:

```text
Drop photos here or browse
```

Helper:

```text
1-4 photos, image files only.
```

Thumbnail behavior:

- Minimum 1 photo required।
- Maximum 4 photos।
- First uploaded photo হবে main photo।
- First thumbnail badge:

```text
Main photo
```

- Remove action:

```text
Remove
```

MVP decision:

- Photo reorder এখন থাকবে না।
- Later drag reorder যোগ করা যাবে।

### Step 3: Type

Purpose:

- User বইটি Sell করবে নাকি Exchange করবে তা select করা।

Title:

```text
What do you want to do with this book?
```

Subtitle:

```text
Choose one option for this post.
```

Option cards:

```text
Sell
Set a price and find a buyer.
```

```text
Exchange
Trade this book for another one.
```

```text
Donate
Coming soon
```

Donate helper:

```text
Donation posts are coming soon.
```

Required:

- `Sell` অথবা `Exchange`
- `Donate` valid selection নয়, কারণ disabled।

### Step 4: Wanted Book

Only for Exchange flow।

Purpose:

- User যে বইটি বিনিময়ে নিতে চায় সেটা identify করা।

Important rule:

- Exchange post করতে wanted book required।
- Wanted book ছাড়া Next করা যাবে না।
- Skip/decide later option থাকবে না।

Title:

```text
Which book do you want in exchange?
```

Subtitle:

```text
Search the book database or add the wanted book manually.
```

Search input placeholder:

```text
Search wanted book title
```

Suggestion list:

- Small cover thumbnail
- Book title
- Author
- Publisher/year if available
- `Select` action

Selected wanted book summary:

- Cover
- Title
- Author
- Badge:

```text
Wanted book
```

- Action:

```text
Change
```

No result:

```text
No matching books found.
```

Manual action:

```text
Add manually
```

Manual fields:

```text
Wanted book title
Author
Publisher or year (optional)
```

Manual wanted book rule:

- Wanted book user-এর কাছে না-ও থাকতে পারে, তাই manual wanted book-এর জন্য front cover photo required নয়।
- Wanted book manual হলে title/author দিয়ে generated fallback cover দেখানো হবে।

Required:

- Database wanted book selected, অথবা
- Manual `Wanted book title` + `Author`

### Step 5: Details

Sell title:

```text
Add selling details
```

Exchange title:

```text
Add exchange details
```

Sell fields:

```text
Price
Negotiable
Category
Condition
Location
Note (optional)
```

Exchange fields:

```text
Category
Condition
Location
Note (optional)
```

Placeholders:

```text
Enter price
Select category
Select condition
Enter your area or city
Add anything buyers should know
Mention what kind of exchange you prefer
```

Category options:

```text
Academic
Admission
Novel
Story Book
Religious
Self-help
Reference
Other
```

Condition options:

```text
New
Like New
Good
Fair
Poor
```

Location:

- MVP-তে simple text input থাকবে।
- Placeholder:

```text
Enter your area or city
```

- Later backend/location data ready হলে district/area autocomplete যোগ করা যাবে।

### Step 6: Preview

Title:

```text
Review your post
```

Subtitle:

```text
This is how your post will appear before publishing.
```

Preview behavior:

- Sell হলে actual `SellPostCard` reuse করে preview দেখাবে।
- Exchange হলে actual `ExchangePostCard` reuse করে preview দেখাবে।
- Preview এবং browse feed card এক component family থেকে আসবে।
- Uploaded seller photos `photoUrls` হিসেবে card component-এ যাবে।
- Mock/fallback state-এ existing `photoColors` illustration tile থাকবে।

Actions:

```text
Confirm & Publish
Back to edit
```

Publish states:

```text
Confirm & Publish
Publishing...
Your post is live.
Could not publish post. Try again.
```

MVP:

- Mock publish success state দেখানো যাবে।
- Backend connect হওয়ার পরে successful publish হলে `/books/:id` route-এ redirect করা হবে।

### Validation Rules

Your Book:

- Database book select করলে valid।
- Manual হলে `Book title` + `Author` + `Front cover photo` required।
- Empty search দিয়ে Next হবে না।

Photos:

- Minimum 1 photo required।
- Maximum 4 photos।
- Image file only।
- Suggested max size: 5MB each।

Type:

- Sell অথবা Exchange required।
- Donate disabled, তাই valid selection নয়।

Wanted Book:

- শুধু Exchange flow-এ required।
- Database wanted book select করলে valid।
- Manual হলে `Wanted book title` + `Author` required।
- Manual wanted book-এর জন্য front cover photo required নয়।
- Wanted book ছাড়া Next হবে না।

Details:

- Sell:
  - Price required।
  - Price positive number হতে হবে।
  - Category required।
  - Condition required।
  - Location required।
  - Negotiable optional toggle।
- Exchange:
  - Category required।
  - Condition required।
  - Location required।
  - Note optional।

Preview:

- Publish button active হবে শুধু সব required data valid হলে।

Validation/error copy:

```text
Select or add a book to continue.
Add at least one photo to continue.
Choose Sell or Exchange to continue.
Select or add a wanted book to continue.
Complete the required details to continue.
Upload image files only.
You can upload up to 4 photos.
Could not search books. Try again.
Could not publish post. Try again.
Your post is live.
```

### States And Interactions

Book search states:

- Idle: input empty, no list।
- Searching:

```text
Searching books...
```

- Results: suggestion list।
- No results: `No matching books found.` + `Add manually`
- Selected: selected book summary card।
- Error: `Could not search books. Try again.` + manual option।

Photo upload states:

- Empty: drag/drop area।
- Uploading/processing: thumbnail skeleton বা loading state।
- Uploaded: thumbnail grid।
- Invalid file: `Upload image files only.`
- Too many files: `You can upload up to 4 photos.`
- Remove photo দিলে preview update হবে।
- Uploaded photos preview/feed card-এ fixed `4:3` tile-এর মধ্যে crop হবে।

Post type interactions:

- Sell/Exchange card click করলে selected state।
- Selected state dark border/background।
- Donate disabled থাকবে।
- Donate click করলে helper message দেখাবে, কিন্তু select হবে না।

Step navigation:

- Back previous step-এ যাবে।
- Next current step valid না হলে disabled থাকবে।
- Exchange select হলে next step `Wanted Book`।
- Sell select হলে `Wanted Book` skip।

### Colors

Page:

- Page background: `#FAF7EF`
- Main panel: `#FFFDF8`
- Final review card background: `#FFFFFF`
- Border: `#D8CDBB`
- Soft border: `#E8DFD1`

Text:

- Primary text: `#111827`
- Secondary text: `#5F6675`
- Muted text: `#8A8173`

Primary/action:

- Primary button background: `#111827`
- Primary button text: `#FFFFFF`
- Primary hover: `#1F2937`

Brand/accent:

- Mint accent: `#7DE3A5`
- Mint soft background: `#E6F8EF`
- Mint border: `#A8EBC4`

Warning/coming soon:

- Soft yellow background: `#FFF3D6`
- Yellow text: `#8A5A00`
- Yellow border: `#F2CE73`

Error:

- Error text: `#B42318`
- Error background: `#FFF1F0`
- Error border: `#FDA29B`

Selected/progress states:

- Selected card border: `#111827`
- Selected card background: `#F7F2E8`
- Completed step dot: `#7DE3A5`
- Current step dot: `#111827`
- Upcoming step dot: `#D8CDBB`

Inputs:

- Input background: `#FFFFFF`
- Input border: `#D8CDBB`
- Focus border: `#111827`
- Focus ring: `rgba(125, 227, 165, 0.35)`

### Data/API Direction

MVP frontend:

- Book suggestions mock data দিয়ে functional করা যাবে।
- Manual book entry functional করা যাবে।
- Photo upload preview local browser state দিয়ে functional করা যাবে।
- Publish mock success দেখানো যাবে।

Backend connect হলে:

- Frontend সরাসরি external book database API call করবে না।
- Backend book database proxy ব্যবহার করবে।
- Backend Open Library/Google Books-এর মতো free source থেকে official cover/details আনবে।
- Upload server storage-এ যাবে।
- Publish real `BookPost` create করবে।
- Success হলে user-কে `/books/:id` route-এ নেওয়া হবে।

## Login/Signup Page

### লক্ষ্য

Login/Signup page হবে auth entry point। User এখান থেকে login অথবা signup করতে পারবে একই page-এর মধ্যে tab/toggle switch করে। Backend auth connect করার আগে UI flow ready থাকবে।

Website-এর visible UI copy আপাতত English থাকবে।

### Route

```text
/login
```

### Final Layout Direction

Layout হবে split-screen।

Desktop:

- Left side: full-height illustration/brand panel।
- Right side: clean centered auth form।
- Form side আলাদা card-heavy feel করবে না; reference layout-এর মতো open clean form area হবে।
- Illustration left side-এ থাকবে।

Mobile:

- Illustration panel hidden থাকবে।
- Form full screen/full width focus নেবে।

### Left Illustration Panel

Purpose:

- Boi Station-এর book/community identity reinforce করবে।
- Login form-এর থেকে বেশি attention নেবে না।

Content:

- Small label:

```text
Books for every reader
```

- Headline:

```text
Give books a second life.
```

- Supporting text:

```text
Join readers across Bangladesh to buy, sell, exchange, and donate books.
```

Visual:

- Code-native bookshelf/campus themed illustration।
- Bookshelf illustration compact থাকবে।
- Illustration বেশি বড় হবে না।
- Panel full-height হলেও content balanced থাকবে।

Colors:

- Panel background: `#8BE8B1`
- Text: `#111827`
- Supporting text: `#253142`
- Book accents:
  - `#7DE3A5`
  - `#F4D35E`
  - `#A78BFA`
  - `#F9735B`

### Right Auth Form

Top:

- Boi Station logo mark।
- Brand title:

```text
Boi Station
```

- Supporting text:

```text
Welcome to your book community
```

Tabs:

```text
Login
Sign Up
```

Behavior:

- Tabs switch form state in the same page।
- No redirect between login/signup।
- Later URL query support can be added, e.g. `/login?mode=signup`।

### Login Form

Fields:

- Email
- Password

Actions:

- Primary submit button:

```text
Login
```

- Secondary Google button:

```text
Continue with Google
```

- Link:

```text
Forgot password?
```

- Toggle shortcut:

```text
Don't have an account? Sign up
```

### Signup Form

Fields:

- Name
- Email
- Password
- Confirm Password

Actions:

- Primary submit button:

```text
Sign Up
```

- Secondary Google button:

```text
Continue with Google
```

- Toggle shortcut:

```text
Already have an account? Login
```

### Form Style

Page:

- Page background: `#FFFDF8`
- Split uses full viewport height।

Tabs:

- Tabs background: `#F4EFE6`
- Active tab background: `#111827`
- Active tab text: `#FFFFFF`
- Inactive tab text: `#4F5865`

Inputs:

- Input background: `#FFFFFF`
- Input border: `#CFC4B2`
- Input focus border: `#111827`
- Input focus ring: `rgba(17, 24, 39, 0.10)`
- Placeholder text: `#8A8175`
- Input text: `#111827`

Buttons:

- Primary button background: `#111827`
- Primary button text: `#FFFFFF`
- Primary hover: `#243041`
- Google button background: `#FFFFFF`
- Google button border: `#CFC4B2`
- Google button text: `#111827`
- Google button hover background: `#F4EFE6`

### Backend/Auth Notes

- Form submit আপাতত UI only/mock হতে পারে।
- Backend যোগ হলে email/password login, signup, Google auth connect হবে।
- Navbar-এর auth-aware state পরে real auth store/context থেকে user state পড়বে।
- Protected pages যেমন `/post`, `/messages`, `/saved` login ছাড়া access করলে `/login` বা login prompt ব্যবহার করবে।

## Buy & Sell Page

### লক্ষ্য

Buy & Sell page হবে Boi Station-এর main marketplace browsing page। এখানে user বই খুঁজবে, filter করবে, এবং sell posts দেখবে। Homepage card compact হলেও এই page-এ richer/advanced sell card layout থাকবে।

Website-এর visible UI copy আপাতত English থাকবে।

### Final Page Structure

উপর থেকে নিচে:

1. Page Header
2. Sticky Filter Bar
3. Mixed Book Cards Grid
4. Infinite Scroll
5. Empty State

### Page Header

Title:

```text
Buy & Sell Books
```

Subtitle:

```text
Find affordable books from readers around you, or list books you no longer need.
```

Optional CTA:

```text
Post a Book
```

CTA route:

```text
/post
```

### Sticky Filter Bar

Filter bar grid-এর ঠিক উপরে থাকবে এবং scroll করলে sticky থাকবে।

Fields:

- Search
- Category
- Price Range
- Reset Filters

Search placeholder:

```text
Search by title or author
```

Category options:

```text
All Categories
Academic
Novel
Story Book
Children
Religious
Career
Admission
Job Prep
Other
```

Price Range options:

```text
Any Price
Under ৳200
৳200 - ৳500
৳500 - ৳1000
Above ৳1000
```

Reset Filters:

```text
Reset Filters
```

Reset Filters button শুধু search/filter active থাকলে দেখানো হবে।

### Book Cards Grid

Grid type হবে mixed responsive grid।

Card types:

- Database matched sell card
- Database unmatched fallback sell card

### Database Matched Sell Card

Database matched sell post হলে card হবে wider/richer।

Structure:

- বামে official book cover/poster থাকবে।
- Official cover/poster free book database থেকে book name/author match করে auto-fetch হবে।
- ডানে seller uploaded book photos-এর ছোট ছোট thumbnail preview থাকবে।
- Seller thumbnails-এর মধ্যে clear gap থাকবে।
- Thumbnail layout simple 2x2 grid হতে পারে।
- ২টা বা ৩টা thumbnail দেখানো যাবে।
- বেশি ছবি থাকলে শেষ thumbnail-এ `+2` type overlay দেখানো যেতে পারে।
- Real uploaded photos `photoUrls` হিসেবে support করবে।
- Thumbnail tile fixed `4:3` ratio হবে এবং image `object-cover` হবে, যাতে screenshot/portrait image layout নষ্ট না করে।
- Book title এবং author seller thumbnail area-এর উপরে বা নিচে balanced ভাবে থাকবে।
- Top-right corner-এ seller profile picture থাকবে।
- Seller avatar hover করলে seller name tooltip দেখাবে।
- Seller avatar click করলে seller profile page-এ যাবে।
- Footer-এ price থাকবে।
- Seller negotiable করলে `Negotiable` tag থাকবে।

Suggested layout:

```text
[ Official Cover ]   Title / Author        seller avatar
                     [ img ] [ img ]
                     [ img ] [ +2  ]

Footer: ৳350   Negotiable
```

### Database Unmatched Fallback Sell Card

Database-এ book match না পেলে card হবে smaller/compact।

Structure:

- Official cover area থাকবে না।
- Seller uploaded photos carousel হিসেবে পুরো card visual area জুড়ে দেখানো হবে।
- ডান পাশে আলাদা seller photo thumbnail area থাকবে না।
- Seller-provided title এবং author দেখানো হবে।
- Footer-এ price থাকবে।
- Seller negotiable করলে `Negotiable` tag থাকবে।

Reason:

Official poster না থাকলে seller image repeat করে split layout বানানোর দরকার নেই। তাই unmatched/fallback card compact থাকবে।

### Sold State

- Default Buy & Sell feed-এ sold posts দেখানো হবে না।
- Sold posts seller profile, user dashboard, অথবা future `Show sold items` filter-এ দেখানো যেতে পারে।
- Sold post কোনো context-এ দেখালে card grid থেকে remove হবে না।
- তখন card-এর উপর `Sold` overlay/tag দেখানো হবে।
- Sold card visually muted/dim হতে পারে।
- Layout একই থাকবে।

### Infinite Scroll

- Pagination button থাকবে না।
- User scroll করলে আরও books auto-load হবে।
- Loading state হিসেবে bottom skeleton cards বা নিচের text ব্যবহার করা যাবে:

```text
Loading more books...
```

### Empty State

Search/filter অনুযায়ী কোনো বই না পাওয়া গেলে:

Title:

```text
No books found
```

Text:

```text
Try changing your search or filters to find more books.
```

Button:

```text
Reset Filters
```

### Colors

Page:

- Page background: `#FAF7EF`
- Header background: `#FAF7EF`
- Filter bar background: `rgba(250, 247, 239, 0.92)`
- Filter bar border: `#D6CCBA`
- Sticky filter bar: use `backdrop-blur`
- Sticky filter bar shadow: `0 10px 30px rgba(17, 24, 39, 0.07)`

Text:

- Primary text: `#111827`
- Secondary text: `#4F5865`
- Muted text: `#626B78`

Filter inputs:

- Input background: `#FFFFFF`
- Input border: `#CFC4B2`
- Input hover/focus border: `#111827`
- Input focus ring: `rgba(17, 24, 39, 0.10)`
- Input placeholder: `#8A8175`
- Input text: `#111827`

Cards:

- Matched card background: `#FFFFFF`
- Matched card border: `#D6CCBA`
- Official cover area background: `#F7F4EC`
- Seller thumbnail area background: `#FAF8F2`
- Fallback card background: `#FFFFFF`
- Fallback card border: `#D6CCBA`
- Fallback carousel background: `#F7F4EC`
- Card base shadow: `rgba(17, 24, 39, 0.04)`
- Card hover shadow: `rgba(17, 24, 39, 0.12)`

Badges:

- For Sale background: `#EAF4EE`
- For Sale text: `#14532D`
- Negotiable background: `#FFE8A3`
- Negotiable text: `#7C2D12`
- Sold overlay background: `rgba(17, 24, 39, 0.68)`
- Sold tag background: `#FEE2E2`
- Sold tag text: `#991B1B`
- Sold overlay text: `#FFFFFF`

Database/source indicators for future use:

- Verified Details background: `#EAF4EE`
- Verified Details text: `#166534`
- Seller Photos background: `#F4EFE6`
- Seller Photos text: `#5F6673`

Price:

- Normal price text: `#111827`
- Soft/discount price support later: `#166534`

CTA:

- Reusable primary button ব্যবহার হবে।
- Button background: `#111827`
- Button text: `#FFFFFF`
- Button hover: `#243041`

Accent colors for UI details:

- Soft green: `#7DE3A5`
- Muted yellow: `#F4D35E`
- Pale blue: `#93C5FD`
- Soft purple: `#A78BFA`

### Data Fetch Flow

Seller যখন book post করবে:

1. Seller book title/author দেবে।
2. System free book database-এ search করবে।
3. Match পাওয়া গেলে official cover/details suggest বা auto-fetch করবে।
4. Seller নিজের actual book photos upload করবে।
5. Matched card-এ official cover + seller photo thumbnails দুটোই দেখানো হবে।
6. Match না পেলে fallback card seller uploaded photos carousel ব্যবহার করবে।
7. Manual/offline preview context-এ uploaded image URL না থাকলে existing `photoColors` mock tile fallback ব্যবহার করা যাবে।

## Exchange Page

### লক্ষ্য

Exchange page হবে বই বিনিময়ের dedicated browsing page। এখানে user active exchange posts দেখবে, category দিয়ে filter করবে, এবং নিজের বইয়ের বদলে অন্য বই খোঁজার flow বুঝবে।

Website-এর visible UI copy আপাতত English থাকবে।

### Final Page Structure

উপর থেকে নিচে:

1. Page Header
2. Sticky Filter Bar
3. Exchange Cards Grid
4. Infinite Scroll
5. Empty State

### Page Header

Title:

```text
Exchange Books
```

Subtitle:

```text
Trade books with other readers instead of buying new ones.
```

Optional CTA:

```text
Post an Exchange
```

CTA route:

```text
/post
```

### Sticky Filter Bar

Exchange page-এ price অর্থহীন, তাই price filter থাকবে না।

MVP filter:

- Category only

Category options:

```text
All Categories
Academic
Novel
Story Book
Children
Religious
Career
Admission
Job Prep
Other
```

Reset Filters:

```text
Reset Filters
```

Reset Filters button শুধু category active থাকলে দেখানো হবে।

### Exchange Cards Grid

Grid type responsive card grid হবে।

Default feed:

- শুধু active exchange posts দেখাবে।
- Exchanged posts default feed থেকে hide হবে।
- Exchanged posts future seller profile, user dashboard, অথবা history context-এ দেখানো যেতে পারে।

### Exchange Card Structure

Exchange card Buy & Sell card থেকে আলাদা হবে।

Left side: Poster Box

- একই poster box-এর মধ্যে দুইটা book cover থাকবে।
- Top-left: seller's offered book cover।
- Bottom-right: wanted book cover।
- Center: exchange icon।
- Poster hover expand থাকবে না।
- Cover না থাকলে fallback cover block দেখানো হবে।

Right side: Seller Photos

- Seller uploaded book photos-এর small thumbnail grid থাকবে।
- Thumbnail images-এর মধ্যে clear gap থাকবে।
- ২-৪টা thumbnail দেখানো যাবে।
- বেশি ছবি থাকলে শেষ thumbnail-এ `+2` type overlay দেখানো যেতে পারে।
- Real uploaded photos `photoUrls` হিসেবে support করবে।
- Thumbnail tile fixed `4:3` ratio হবে এবং image `object-cover` হবে।

Text/content:

- Offered book title এবং author।
- Wanted book title এবং author।
- Seller avatar top-right থাকবে।
- Seller avatar hover করলে seller name tooltip দেখাবে।
- Seller avatar click করলে seller profile page-এ যাবে।
- Location দেখানো হবে।

Suggested layout:

```text
[ Offered cover      ]   Offered: Book title        seller avatar
[        ⇄           ]   Wanted: Book title
[      Wanted cover  ]   [ img ] [ img ]
                         [ img ] [ +2  ]

Footer: Location
```

### Exchanged State

- Exchanged posts default Exchange feed থেকে remove/hide হবে।
- কোনো future context-এ exchanged post দেখালে `Exchanged` tag ব্যবহার করা যাবে।
- Exchanged tag:
  - Background: `#EDE9FE`
  - Text: `#6D28D9`

### Infinite Scroll

- Pagination button থাকবে না।
- User scroll করলে আরও exchange posts auto-load হবে।
- Loading state হিসেবে bottom text ব্যবহার করা যাবে:

```text
Loading more exchanges...
```

### Empty State

Category filter অনুযায়ী কোনো exchange post না পাওয়া গেলে:

Title:

```text
No exchange posts found
```

Text:

```text
Try changing the category filter to find more exchange posts.
```

Button:

```text
Reset Filters
```

### Colors

Buy & Sell page-এর stronger marketplace palette reuse করা হবে।

Page:

- Page background: `#FAF7EF`
- Header background: `#FAF7EF`
- Filter bar background: `rgba(250, 247, 239, 0.92)`
- Filter bar border: `#D6CCBA`
- Sticky filter bar: use `backdrop-blur`
- Sticky filter bar shadow: `0 10px 30px rgba(17, 24, 39, 0.07)`

Text:

- Primary text: `#111827`
- Secondary text: `#4F5865`
- Muted text: `#626B78`

Filter:

- Input/select background: `#FFFFFF`
- Input/select border: `#CFC4B2`
- Input/select hover/focus border: `#111827`
- Input/select focus ring: `rgba(17, 24, 39, 0.10)`

Cards:

- Card background: `#FFFFFF`
- Card border: `#D6CCBA`
- Poster box background: `#F7F4EC`
- Seller thumbnail area background: `#FAF8F2`
- Card base shadow: `rgba(17, 24, 39, 0.04)`
- Card hover shadow: `rgba(17, 24, 39, 0.12)`

Exchange icon:

- Icon background: `#111827`
- Icon color: `#FFFFFF`

Badges:

- Exchange background: `#EAF2FF`
- Exchange text: `#1D4ED8`
- Exchanged background: `#EDE9FE`
- Exchanged text: `#6D28D9`

### Data Fetch Flow

Exchange post তৈরি করার সময়:

1. Seller offered book title/author দেবে।
2. System free book database-এ offered book search করবে।
3. Wanted book title/author বা category দেওয়া হলে wanted book-এর cover/details search করা যাবে।
4. Match পাওয়া গেলে covers auto-fetch হবে।
5. Seller নিজের offered book-এর actual photos upload করবে।
6. Exchange card-এ offered cover + wanted cover + seller uploaded photo thumbnails দেখানো হবে।
7. Cover না পাওয়া গেলে fallback cover block ব্যবহার হবে।
8. Manual/offline preview context-এ uploaded image URL না থাকলে existing `photoColors` mock tile fallback ব্যবহার করা যাবে।

Route:

```text
/post
```

#### Buy & Sell

Title:

```text
Buy & Sell
```

Description:

```text
Browse books from nearby readers and find what you need at a better price.
```

Steps:

```text
Search by title or category
Compare price, condition, and location
Contact the seller
```

Button:

```text
Browse Books
```

Route:

```text
/buy-sell
```

#### Exchange Books

Title:

```text
Exchange Books
```

Description:

```text
Trade books with other readers instead of buying new ones.
```

Steps:

```text
List the book you have
Mention what you want in return
Match and exchange
```

Button:

```text
Explore Exchanges
```

Route:

```text
/exchange
```

#### Donate Books

Title:

```text
Donate Books
```

Description:

```text
Pass your unused books to someone who can read and benefit from them.
```

Steps:

```text
Add donation details
Review interested requests
Hand over the book
```

Button:

```text
Donate a Book
```

Route:

```text
/donate
```

## Donation Page

### লক্ষ্য

Donation page হবে বই দানের browsing page। এখানে user free donation posts খুঁজবে, category/location দিয়ে filter করবে, এবং donor-এর সাথে পরে যোগাযোগ করতে পারবে।

Website-এর visible UI copy আপাতত English থাকবে।

### Final Page Structure

উপর থেকে নিচে:

1. Page Header
2. Sticky Filter Bar
3. Donation Cards Grid
4. Infinite Scroll
5. Empty State

### Page Header

Title:

```text
Donate Books
```

Subtitle:

```text
Pass your unused books to someone who can read and benefit from them.
```

CTA:

```text
Post a Donation
```

CTA route:

```text
/post
```

### Sticky Filter Bar

Donation page-এ price filter থাকবে না।

MVP filters:

- Category
- Location

Category options:

```text
All Categories
Academic
Novel
Story Book
Children
Religious
Career
Admission
Job Prep
Other
```

Location options:

```text
All Locations
Dhaka
Chattogram
Sylhet
Rajshahi
Khulna
Barishal
Rangpur
Mymensingh
Other
```

Reset Filters:

```text
Reset Filters
```

Reset Filters button শুধু category/location active থাকলে দেখানো হবে।

### Donation Cards Grid

- Card grid normalized হবে।
- Donation page-এ Buy & Sell-এর মতো wide/compact mixed layout থাকবে না।
- Desktop grid ৪ column হতে পারে।
- Tablet grid ২ column।
- Mobile grid ১ column।
- Donated/completed posts default feed থেকে hide হবে।
- Donated posts future profile/dashboard/history context-এ `Donated` tag সহ দেখানো যেতে পারে।

### Donation Card Structure

Card content:

- Main book cover/photo area।
- Donation badge।
- Condition badge।
- Book title।
- Author/publisher।
- Donor avatar top-right।
- Footer:
  - `Free Donation`
  - Location

Donor note:

- Donation card-এ donor note component রাখা হবে না।
- Card clean এবং easy-to-scan থাকবে।
- Donor note later details page বা message context-এ রাখা যেতে পারে।

### Infinite Scroll

- Pagination button থাকবে না।
- User scroll করলে আরও donation posts auto-load হবে।
- Loading state:

```text
Loading more donations...
```

### Empty State

Filter অনুযায়ী কোনো donation না পাওয়া গেলে:

Title:

```text
No donations found
```

Text:

```text
Try changing your filters or check again later.
```

Button:

```text
Reset Filters
```

### Colors

Buy & Sell এবং Exchange page-এর stronger marketplace palette reuse করা হবে, তবে donation feel-এর জন্য warm amber/soft green accents ব্যবহার করা হবে।

Page:

- Page background: `#FAF7EF`
- Header background: `#FAF7EF`
- Card background: `#FFFFFF`
- Main border: `#D6CCBA`

Text:

- Primary text: `#111827`
- Secondary text: `#4F5865`
- Muted text: `#626B78`

Filter bar:

- Filter bar background: `rgba(250, 247, 239, 0.92)`
- Filter bar border: `#D6CCBA`
- Filter bar shadow: `0 10px 30px rgba(17, 24, 39, 0.07)`
- Select background: `#FFFFFF`
- Select border: `#CFC4B2`
- Focus border: `#111827`
- Focus ring: `rgba(17, 24, 39, 0.10)`

Donation card:

- Card background: `#FFFFFF`
- Card border: `#D6CCBA`
- Image area background: `#F7F4EC`
- Base shadow: `rgba(17, 24, 39, 0.04)`
- Hover shadow: `rgba(17, 24, 39, 0.12)`

Badges:

- Donation badge background: `#FFF3D6`
- Donation badge text: `#92400E`
- Free Donation label background: `#EAF4EE`
- Free Donation label text: `#166534`
- Donated tag background: `#EDE9FE`
- Donated tag text: `#6D28D9`
- Condition badge background: `#EEE8DC`
- Condition badge text: `#374151`

CTA:

- Reusable primary button ব্যবহার হবে।
- Button background: `#111827`
- Button text: `#FFFFFF`
- Button hover: `#243041`

## Recent Books Section

### লক্ষ্য

এই section homepage-এর marketplace preview হিসেবে কাজ করবে। User যেন দ্রুত বুঝতে পারে Boi Station-এ real book posts আছে এবং চাইলে full Buy & Sell page-এ গিয়ে browse করতে পারে।

এই section full browsing experience না; শুধু recent/featured posts-এর clean preview।

### Final Design Direction

- Homepage-এ normalized compact book cards ব্যবহার করা হবে।
- সব card same width হবে।
- Advanced variable-width card layout homepage-এ ব্যবহার করা হবে না।
- Carousel, hover-expand poster, এবং rich seller interaction homepage card-এ থাকবে না।
- Advanced card design full Buy/Sell এবং Exchange pages-এর জন্য রাখা হবে।

Full page card direction:

- Database matched sell post: wider/richer card।
- Database unmatched fallback sell post: smaller card।
- Exchange post: special two-poster layout।
- Carousel, hover expand, seller avatar hover/click interaction full page-এ থাকবে।

### Section Copy

Title:

```text
Recent Books
```

Subtitle:

```text
Freshly posted books from the community.
```

Button:

```text
View All Books
```

Button route:

```text
/buy-sell
```

### Layout

Desktop:

- Section header row হবে।
- Title এবং subtitle left side-এ থাকবে।
- `View All Books` button right side-এ থাকবে।
- নিচে book cards grid থাকবে।
- Grid হবে ৪ column।

Tablet:

- Grid হবে ২ column।

Mobile:

- Grid হবে ১ column।
- Title/subtitle আগে থাকবে।
- Button title/subtitle-এর নিচে থাকবে।

### Card Fields

Homepage compact book card-এ থাকবে:

- Book image অথবা cover।
- Post type badge:
  - `For Sale`
  - `Exchange`
  - `Donation`
- Condition badge:
  - `New`
  - `Used`
  - `Good`
  - `Fair`
- Book title।
- Author অথবা publisher।
- Price/status:
  - Sale হলে price।
  - Exchange হলে `Exchange`।
  - Donation হলে `Free Donation`।
- Location।

Database indicator homepage card-এ এখন না দেখালেও চলবে। Post type badge যথেষ্ট।

### Card Behavior

- Card click আপাতত `/buy-sell` route-এ যাবে।
- পরে detail route তৈরি হলে card link update করা হবে।
- Hover-এ subtle lift/shadow হবে।
- Card design practical marketplace style হবে, বেশি decorative হবে না।

### Image Handling

- Database match থাকলে official cover দেখানো যাবে।
- Database match না থাকলে seller uploaded image দেখানো যাবে।
- Image না থাকলে soft placeholder box দেখাতে হবে।
- Broken image দেখানো যাবে না।
- Image area book cover-এর জন্য natural ratio রাখবে।

Recommended image ratio:

```text
4:5
```

### Colors

Section:

- Section background: `#FFFDF8`
- Card background: `#FFFFFF`
- Card border: `#E7DFD0`
- Card hover shadow: `rgba(17, 24, 39, 0.08)`
- Primary text: `#111827`
- Secondary text: `#5F6673`
- Muted text: `#7A7280`
- Image placeholder background: `#F7F4EC`

Button:

- Reusable primary button ব্যবহার হবে।
- Button background: `#111827`
- Button text: `#FFFFFF`
- Button hover: `#243041`

Post type badge colors:

- For Sale background: `#EAF4EE`
- For Sale text: `#166534`
- Exchange background: `#EAF2FF`
- Exchange text: `#1D4ED8`
- Donation background: `#FFF3D6`
- Donation text: `#92400E`

Condition badge:

- Background: `#F4EFE6`
- Text: `#5F6673`
- Border: `#E7DFD0`

Status badge colors for future use:

- Sold background: `#FEE2E2`
- Sold text: `#991B1B`
- Exchanged background: `#EDE9FE`
- Exchanged text: `#6D28D9`

Database match indicator colors for future use:

- Verified Details background: `#EAF4EE`
- Verified Details text: `#166534`
- Seller Photos background: `#F4EFE6`
- Seller Photos text: `#5F6673`

### Mock Data

API connect না হওয়া পর্যন্ত homepage preview-এর জন্য ৪টা mock recent book post রাখা যাবে।

Suggested mock posts:

1. `Higher Math - Class 10`
   - Author/publisher: `NCTB`
   - Type: `For Sale`
   - Price/status: `৳220`
   - Condition: `Good`
   - Location: `Mirpur, Dhaka`

2. `The Alchemist`
   - Author/publisher: `Paulo Coelho`
   - Type: `Exchange`
   - Price/status: `Exchange`
   - Condition: `Used`
   - Location: `Dhanmondi, Dhaka`

3. `English Grammar`
   - Author/publisher: `Raymond Murphy`
   - Type: `For Sale`
   - Price/status: `৳380`
   - Condition: `Good`
   - Location: `Chattogram`

4. `Story Books Bundle`
   - Author/publisher: `Children's Collection`
   - Type: `Donation`
   - Price/status: `Free Donation`
   - Condition: `Fair`
   - Location: `Sylhet`

### Empty State For Future API

API connect করার পরে যদি কোনো book না থাকে:

Title:

```text
No books posted yet
```

Text:

```text
Be the first to post a book on Boi Station.
```

Button:

```text
Post a Book
```
