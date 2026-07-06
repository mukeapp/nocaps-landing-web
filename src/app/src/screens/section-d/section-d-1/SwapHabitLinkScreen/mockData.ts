import { HabitLinkComponent } from '@/core/models/section-b/habit';

const BANNER =
  'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2F554B2774-4935-405B-AC95-10B6D2490902.jpg?alt=media&token=c48dd018-986f-4ff8-899e-9d40a83cc202';

const SCORE_INFO_UNKNOWN = { code: 'UNKNOWN', color: 'GRAY',   rgb: 'rgb(128,128,128)', label: 'UNKNOWN'   };
const SCORE_INFO_GOOD    = { code: 'GOOD',    color: 'GREEN',  rgb: 'rgb(0,128,0)',     label: 'GOOD'      };
const SCORE_INFO_EXCL    = { code: 'EXCELLENT', color: 'GOLD', rgb: 'rgb(255,215,0)',   label: 'EXCELLENT' };
const SCORE_INFO_BAD     = { code: 'BAD',     color: 'RED',    rgb: 'rgb(255,0,0)',     label: 'BAD'       };
const SCORE_INFO_AVG     = { code: 'AVERAGE', color: 'ORANGE', rgb: 'rgb(255,165,0)',   label: 'AVERAGE'   };

export const MOCK_CURRENT_LINK: HabitLinkComponent = {
  id: 'current',
  name: 'Hamburger (Home Cook)',
  iconColor: 'rgba(45,156,219,1)',
  location: 'Georgia, USA',
  bannerImage: BANNER,
  scoreComponent: { score: 0, cost: 37.02, scoreInfo: SCORE_INFO_UNKNOWN },
  habitLinkItemComponentsData: [
    {
      documentId: 'i1', id: 'i1', habitLinkId: 'current', originId: 'i1',
      yearActivated: 2025, monthActivated: 1, dayActivated: 1,
      isConstant: true, isActive: true, canUpdate: false,
      name: 'Onion', description: 'Onion', companyName: '', location: '',
      price: 3.54, cost: 3.54, quantity: 1, score: 0, scoreCode: 'UNKNOWN',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2FF9CEEC38-3F0A-440C-A779-0C18EFD3843B.jpg?alt=media&token=4d0cf23a-caa1-435b-ae74-72004e9f23ca',
      scoreObject: { habitLinkId: 'current', habitLinkItemId: 'i1', cost: 3.54, score: 0, scoreInfo: SCORE_INFO_UNKNOWN },
      habitLinkItemLikes: [],
    },
    {
      documentId: 'i2', id: 'i2', habitLinkId: 'current', originId: 'i2',
      yearActivated: 2025, monthActivated: 1, dayActivated: 1,
      isConstant: true, isActive: true, canUpdate: false,
      name: 'Brioche Bun', description: 'Buns', companyName: '', location: '',
      price: 7.68, cost: 7.68, quantity: 1, score: 0, scoreCode: 'UNKNOWN',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2F7EC9DB60-4DD9-48C7-AB53-DA43E278EF00.jpg?alt=media&token=94959c46-29a9-4a5e-84d1-03dbcac68918',
      scoreObject: { habitLinkId: 'current', habitLinkItemId: 'i2', cost: 7.68, score: 0, scoreInfo: SCORE_INFO_UNKNOWN },
      habitLinkItemLikes: [],
    },
    {
      documentId: 'i3', id: 'i3', habitLinkId: 'current', originId: 'i3',
      yearActivated: 2025, monthActivated: 1, dayActivated: 1,
      isConstant: true, isActive: true, canUpdate: false,
      name: 'American Cheese', description: 'Cheese', companyName: '', location: '',
      price: 1.88, cost: 1.88, quantity: 1, score: 0, scoreCode: 'UNKNOWN',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2F882FAC3A-EB0B-44E2-B798-15E4AE7D4E43.png?alt=media&token=3bc211d5-1ca6-4afb-92d7-01aecfd4b3b9',
      scoreObject: { habitLinkId: 'current', habitLinkItemId: 'i3', cost: 1.88, score: 0, scoreInfo: SCORE_INFO_UNKNOWN },
      habitLinkItemLikes: [],
    },
    {
      documentId: 'i4', id: 'i4', habitLinkId: 'current', originId: 'i4',
      yearActivated: 2025, monthActivated: 1, dayActivated: 1,
      isConstant: true, isActive: true, canUpdate: false,
      name: 'Ground Beef (bulk pack)', description: 'Ground beef', companyName: '', location: '',
      price: 17.93, cost: 17.93, quantity: 1, score: 0, scoreCode: 'UNKNOWN',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2FC66F7581-2B9E-4A2C-AEC9-B435759E6A23.jpg?alt=media&token=73f94a74-8380-4e19-aabc-da236d5a41ca',
      scoreObject: { habitLinkId: 'current', habitLinkItemId: 'i4', cost: 17.93, score: 0, scoreInfo: SCORE_INFO_UNKNOWN },
      habitLinkItemLikes: [],
    },
    {
      documentId: 'i5', id: 'i5', habitLinkId: 'current', originId: 'i5',
      yearActivated: 2025, monthActivated: 1, dayActivated: 1,
      isConstant: true, isActive: true, canUpdate: false,
      name: 'Lettuce', description: 'Lettuce', companyName: '', location: '',
      price: 2.00, cost: 2.00, quantity: 1, score: 0, scoreCode: 'UNKNOWN',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2F9A3CBAE6-42FD-4589-92DE-9FB161EF3236.jpg?alt=media&token=34c201c9-adb6-46c7-9f5f-43dfe70d3f5b',
      scoreObject: { habitLinkId: 'current', habitLinkItemId: 'i5', cost: 2.00, score: 0, scoreInfo: SCORE_INFO_UNKNOWN },
      habitLinkItemLikes: [],
    },
    {
      documentId: 'i6', id: 'i6', habitLinkId: 'current', originId: 'i6',
      yearActivated: 2025, monthActivated: 1, dayActivated: 1,
      isConstant: true, isActive: true, canUpdate: false,
      name: 'Pickle Jar', description: 'Pickle', companyName: '', location: '',
      price: 5.99, cost: 5.99, quantity: 1, score: 0, scoreCode: 'UNKNOWN',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2F8AFCC53D-476F-4EE5-83B8-14EFC3152166.jpg?alt=media&token=1b71a147-b28e-4509-b3a4-9ad486b466dc',
      scoreObject: { habitLinkId: 'current', habitLinkItemId: 'i6', cost: 5.99, score: 0, scoreInfo: SCORE_INFO_UNKNOWN },
      habitLinkItemLikes: [],
    },
  ],
};

export const MOCK_SWAP_LINKS: HabitLinkComponent[] = [
  {
    id: 'link-001',
    name: "McDonald's",
    iconColor: 'rgba(230,57,70,1)',
    location: 'Jonesboro, GA',
    bannerImage: BANNER,
    scoreComponent: { score: 85, cost: 14.99, scoreInfo: SCORE_INFO_GOOD },
    habitLinkItemComponentsData: [
      { documentId: 'j1', id: 'j1', habitLinkId: 'link-001', originId: 'j1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Quarter Pounder', description: 'Burger', companyName: "McDonald's", location: 'Jonesboro, GA', price: 5.99, cost: 5.99, quantity: 1, score: 85, scoreCode: 'GOOD', scoreObject: { habitLinkId: 'link-001', habitLinkItemId: 'j1', cost: 5.99, score: 85, scoreInfo: SCORE_INFO_GOOD }, habitLinkItemLikes: [] },
      { documentId: 'j2', id: 'j2', habitLinkId: 'link-001', originId: 'j2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Large Fries',    description: 'Fries',   companyName: "McDonald's", location: 'Jonesboro, GA', price: 3.79, cost: 3.79, quantity: 1, score: 85, scoreCode: 'GOOD', scoreObject: { habitLinkId: 'link-001', habitLinkItemId: 'j2', cost: 3.79, score: 85, scoreInfo: SCORE_INFO_GOOD }, habitLinkItemLikes: [] },
      { documentId: 'j3', id: 'j3', habitLinkId: 'link-001', originId: 'j3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Large Drink',    description: 'Drink',   companyName: "McDonald's", location: 'Jonesboro, GA', price: 2.19, cost: 2.19, quantity: 1, score: 85, scoreCode: 'GOOD', scoreObject: { habitLinkId: 'link-001', habitLinkItemId: 'j3', cost: 2.19, score: 85, scoreInfo: SCORE_INFO_GOOD }, habitLinkItemLikes: [] },
      { documentId: 'j4', id: 'j4', habitLinkId: 'link-001', originId: 'j4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Apple Pie',      description: 'Dessert', companyName: "McDonald's", location: 'Jonesboro, GA', price: 1.69, cost: 1.69, quantity: 1, score: 85, scoreCode: 'GOOD', scoreObject: { habitLinkId: 'link-001', habitLinkItemId: 'j4', cost: 1.69, score: 85, scoreInfo: SCORE_INFO_GOOD }, habitLinkItemLikes: [] },
      { documentId: 'j5', id: 'j5', habitLinkId: 'link-001', originId: 'j5', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'McFlurry',       description: 'Dessert', companyName: "McDonald's", location: 'Jonesboro, GA', price: 1.33, cost: 1.33, quantity: 1, score: 15, scoreCode: 'BAD',  scoreObject: { habitLinkId: 'link-001', habitLinkItemId: 'j5', cost: 1.33, score: 15, scoreInfo: SCORE_INFO_BAD  }, habitLinkItemLikes: [] },
    ],
    comparisonHabitLink: {
      currentItem: MOCK_CURRENT_LINK,
      swapItem: { id: 'link-001', habitLinkId: 'link-001', name: "McDonald's", location: 'Jonesboro, GA', scoreComponent: { score: 85, cost: 14.99, scoreInfo: SCORE_INFO_GOOD } },
      score: 0.85, scoreCode: 'GOOD', save: 22,
      comparisonHabitLinkItems: [
        { currentItem: { id: 'i1', habitLinkId: 'current', originId: 'i1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Onion',           cost: 3.54  }, swapItem: { id: 'j1', habitLinkId: 'link-001', originId: 'j1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Quarter Pounder', cost: 5.99 }, score: 0.85, scoreCode: 'GOOD', save: -2 },
        { currentItem: { id: 'i2', habitLinkId: 'current', originId: 'i2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Brioche Bun',     cost: 7.68  }, swapItem: { id: 'j2', habitLinkId: 'link-001', originId: 'j2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Large Fries',     cost: 3.79 }, score: 0.85, scoreCode: 'GOOD', save:  4 },
        { currentItem: { id: 'i3', habitLinkId: 'current', originId: 'i3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'American Cheese', cost: 1.88  }, swapItem: { id: 'j3', habitLinkId: 'link-001', originId: 'j3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Large Drink',     cost: 2.19 }, score: 0.85, scoreCode: 'GOOD', save: -1 },
        { currentItem: { id: 'i4', habitLinkId: 'current', originId: 'i4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Ground Beef',     cost: 17.93 }, swapItem: { id: 'j4', habitLinkId: 'link-001', originId: 'j4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Apple Pie',       cost: 1.69 }, score: 0.85, scoreCode: 'GOOD', save: 16 },
        { currentItem: { id: 'i5', habitLinkId: 'current', originId: 'i5', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Lettuce',         cost: 2.00  }, swapItem: { id: 'j5', habitLinkId: 'link-001', originId: 'j5', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'McFlurry',        cost: 1.33 }, score: 0.85, scoreCode: 'GOOD', save:  1 },
      ],
    },
  },
  {
    id: 'link-002',
    name: 'Shake Shack',
    iconColor: 'rgba(46,196,182,1)',
    location: 'Atlanta, GA',
    bannerImage: BANNER,
    scoreComponent: { score: 92, cost: 21.50, scoreInfo: SCORE_INFO_EXCL },
    habitLinkItemComponentsData: [
      { documentId: 'k1', id: 'k1', habitLinkId: 'link-002', originId: 'k1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'ShackBurger',  description: 'Burger',  companyName: 'Shake Shack', location: 'Atlanta, GA', price: 9.29, cost: 9.29, quantity: 1, score: 92, scoreCode: 'EXCELLENT', scoreObject: { habitLinkId: 'link-002', habitLinkItemId: 'k1', cost: 9.29, score: 92, scoreInfo: SCORE_INFO_EXCL }, habitLinkItemLikes: [] },
      { documentId: 'k2', id: 'k2', habitLinkId: 'link-002', originId: 'k2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Cheese Fries', description: 'Fries',   companyName: 'Shake Shack', location: 'Atlanta, GA', price: 5.29, cost: 5.29, quantity: 1, score: 92, scoreCode: 'EXCELLENT', scoreObject: { habitLinkId: 'link-002', habitLinkItemId: 'k2', cost: 5.29, score: 92, scoreInfo: SCORE_INFO_EXCL }, habitLinkItemLikes: [] },
      { documentId: 'k3', id: 'k3', habitLinkId: 'link-002', originId: 'k3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Lemonade',     description: 'Drink',   companyName: 'Shake Shack', location: 'Atlanta, GA', price: 3.79, cost: 3.79, quantity: 1, score: 92, scoreCode: 'EXCELLENT', scoreObject: { habitLinkId: 'link-002', habitLinkItemId: 'k3', cost: 3.79, score: 92, scoreInfo: SCORE_INFO_EXCL }, habitLinkItemLikes: [] },
      { documentId: 'k4', id: 'k4', habitLinkId: 'link-002', originId: 'k4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Milkshake',    description: 'Dessert', companyName: 'Shake Shack', location: 'Atlanta, GA', price: 3.13, cost: 3.13, quantity: 1, score: 92, scoreCode: 'EXCELLENT', scoreObject: { habitLinkId: 'link-002', habitLinkItemId: 'k4', cost: 3.13, score: 92, scoreInfo: SCORE_INFO_EXCL }, habitLinkItemLikes: [] },
    ],
    comparisonHabitLink: {
      currentItem: MOCK_CURRENT_LINK,
      swapItem: { id: 'link-002', habitLinkId: 'link-002', name: 'Shake Shack', location: 'Atlanta, GA', scoreComponent: { score: 92, cost: 21.50, scoreInfo: SCORE_INFO_EXCL } },
      score: 0.92, scoreCode: 'EXCELLENT', save: 16,
      comparisonHabitLinkItems: [
        { currentItem: { id: 'i1', habitLinkId: 'current', originId: 'i1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Onion',           cost: 3.54  }, swapItem: { id: 'k1', habitLinkId: 'link-002', originId: 'k1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'ShackBurger',  cost: 9.29 }, score: 0.92, scoreCode: 'EXCELLENT', save: -6 },
        { currentItem: { id: 'i2', habitLinkId: 'current', originId: 'i2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Brioche Bun',     cost: 7.68  }, swapItem: { id: 'k2', habitLinkId: 'link-002', originId: 'k2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Cheese Fries', cost: 5.29 }, score: 0.92, scoreCode: 'EXCELLENT', save:  2 },
        { currentItem: { id: 'i3', habitLinkId: 'current', originId: 'i3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'American Cheese', cost: 1.88  }, swapItem: { id: 'k3', habitLinkId: 'link-002', originId: 'k3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Lemonade',     cost: 3.79 }, score: 0.92, scoreCode: 'EXCELLENT', save: -2 },
        { currentItem: { id: 'i4', habitLinkId: 'current', originId: 'i4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Ground Beef',     cost: 17.93 }, swapItem: { id: 'k4', habitLinkId: 'link-002', originId: 'k4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Milkshake',    cost: 3.13 }, score: 0.92, scoreCode: 'EXCELLENT', save: 15 },
      ],
    },
  },
  {
    id: 'link-003',
    name: 'Burger King',
    iconColor: 'rgba(218,242,74,1)',
    location: 'Morrow, GA',
    bannerImage: BANNER,
    scoreComponent: { score: 45, cost: 44.00, scoreInfo: SCORE_INFO_BAD },
    habitLinkItemComponentsData: [
      { documentId: 'l1', id: 'l1', habitLinkId: 'link-003', originId: 'l1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Whopper',      description: 'Burger', companyName: 'Burger King', location: 'Morrow, GA', price: 6.99, cost: 6.99, quantity: 1, score: 45, scoreCode: 'BAD', scoreObject: { habitLinkId: 'link-003', habitLinkItemId: 'l1', cost: 6.99, score: 45, scoreInfo: SCORE_INFO_BAD }, habitLinkItemLikes: [] },
      { documentId: 'l2', id: 'l2', habitLinkId: 'link-003', originId: 'l2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Onion Rings',  description: 'Side',   companyName: 'Burger King', location: 'Morrow, GA', price: 3.99, cost: 3.99, quantity: 1, score: 45, scoreCode: 'BAD', scoreObject: { habitLinkId: 'link-003', habitLinkItemId: 'l2', cost: 3.99, score: 45, scoreInfo: SCORE_INFO_BAD }, habitLinkItemLikes: [] },
    ],
    comparisonHabitLink: {
      currentItem: MOCK_CURRENT_LINK,
      swapItem: { id: 'link-003', habitLinkId: 'link-003', name: 'Burger King', location: 'Morrow, GA', scoreComponent: { score: 45, cost: 44.00, scoreInfo: SCORE_INFO_BAD } },
      score: 0.45, scoreCode: 'BAD', save: -7,
      comparisonHabitLinkItems: [
        { currentItem: { id: 'i1', habitLinkId: 'current', originId: 'i1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Onion',       cost: 3.54 }, swapItem: { id: 'l1', habitLinkId: 'link-003', originId: 'l1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Whopper',     cost: 6.99 }, score: 0.45, scoreCode: 'BAD', save: -3 },
        { currentItem: { id: 'i2', habitLinkId: 'current', originId: 'i2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Brioche Bun', cost: 7.68 }, swapItem: { id: 'l2', habitLinkId: 'link-003', originId: 'l2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Onion Rings', cost: 3.99 }, score: 0.45, scoreCode: 'BAD', save:  4 },
      ],
    },
  },
  {
    id: 'link-004',
    name: 'Five Guys',
    iconColor: 'rgba(168,85,247,1)',
    location: 'Stockbridge, GA',
    bannerImage: BANNER,
    scoreComponent: { score: 72, cost: 29.75, scoreInfo: SCORE_INFO_AVG },
    habitLinkItemComponentsData: [
      { documentId: 'm1', id: 'm1', habitLinkId: 'link-004', originId: 'm1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Little Burger',  description: 'Burger',  companyName: 'Five Guys', location: 'Stockbridge, GA', price: 8.69, cost: 8.69, quantity: 1, score: 72, scoreCode: 'AVERAGE', scoreObject: { habitLinkId: 'link-004', habitLinkItemId: 'm1', cost: 8.69, score: 72, scoreInfo: SCORE_INFO_AVG }, habitLinkItemLikes: [] },
      { documentId: 'm2', id: 'm2', habitLinkId: 'link-004', originId: 'm2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Large Fries',    description: 'Side',    companyName: 'Five Guys', location: 'Stockbridge, GA', price: 7.49, cost: 7.49, quantity: 1, score: 72, scoreCode: 'AVERAGE', scoreObject: { habitLinkId: 'link-004', habitLinkItemId: 'm2', cost: 7.49, score: 72, scoreInfo: SCORE_INFO_AVG }, habitLinkItemLikes: [] },
      { documentId: 'm3', id: 'm3', habitLinkId: 'link-004', originId: 'm3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Milkshake',      description: 'Dessert', companyName: 'Five Guys', location: 'Stockbridge, GA', price: 7.29, cost: 7.29, quantity: 1, score: 72, scoreCode: 'AVERAGE', scoreObject: { habitLinkId: 'link-004', habitLinkItemId: 'm3', cost: 7.29, score: 72, scoreInfo: SCORE_INFO_AVG }, habitLinkItemLikes: [] },
      { documentId: 'm4', id: 'm4', habitLinkId: 'link-004', originId: 'm4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Fountain Drink', description: 'Drink',   companyName: 'Five Guys', location: 'Stockbridge, GA', price: 3.29, cost: 3.29, quantity: 1, score: 72, scoreCode: 'AVERAGE', scoreObject: { habitLinkId: 'link-004', habitLinkItemId: 'm4', cost: 3.29, score: 72, scoreInfo: SCORE_INFO_AVG }, habitLinkItemLikes: [] },
      { documentId: 'm5', id: 'm5', habitLinkId: 'link-004', originId: 'm5', yearActivated: 2025, monthActivated: 1, dayActivated: 1, isConstant: true, isActive: true, canUpdate: false, name: 'Bacon Topping',  description: 'Topping', companyName: 'Five Guys', location: 'Stockbridge, GA', price: 2.99, cost: 2.99, quantity: 1, score: 72, scoreCode: 'AVERAGE', scoreObject: { habitLinkId: 'link-004', habitLinkItemId: 'm5', cost: 2.99, score: 72, scoreInfo: SCORE_INFO_AVG }, habitLinkItemLikes: [] },
    ],
    comparisonHabitLink: {
      currentItem: MOCK_CURRENT_LINK,
      swapItem: { id: 'link-004', habitLinkId: 'link-004', name: 'Five Guys', location: 'Stockbridge, GA', scoreComponent: { score: 72, cost: 29.75, scoreInfo: SCORE_INFO_AVG } },
      score: 0.72, scoreCode: 'AVERAGE', save: 7,
      comparisonHabitLinkItems: [
        { currentItem: { id: 'i1', habitLinkId: 'current', originId: 'i1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Onion',           cost: 3.54  }, swapItem: { id: 'm1', habitLinkId: 'link-004', originId: 'm1', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Little Burger',  cost: 8.69 }, score: 0.72, scoreCode: 'AVERAGE', save: -5 },
        { currentItem: { id: 'i2', habitLinkId: 'current', originId: 'i2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Brioche Bun',     cost: 7.68  }, swapItem: { id: 'm2', habitLinkId: 'link-004', originId: 'm2', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Large Fries',    cost: 7.49 }, score: 0.72, scoreCode: 'AVERAGE', save:  0 },
        { currentItem: { id: 'i3', habitLinkId: 'current', originId: 'i3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'American Cheese', cost: 1.88  }, swapItem: { id: 'm3', habitLinkId: 'link-004', originId: 'm3', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Milkshake',      cost: 7.29 }, score: 0.72, scoreCode: 'AVERAGE', save: -5 },
        { currentItem: { id: 'i4', habitLinkId: 'current', originId: 'i4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Ground Beef',     cost: 17.93 }, swapItem: { id: 'm4', habitLinkId: 'link-004', originId: 'm4', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Fountain Drink', cost: 3.29 }, score: 0.72, scoreCode: 'AVERAGE', save: 15 },
        { currentItem: { id: 'i5', habitLinkId: 'current', originId: 'i5', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Lettuce',         cost: 2.00  }, swapItem: { id: 'm5', habitLinkId: 'link-004', originId: 'm5', yearActivated: 2025, monthActivated: 1, dayActivated: 1, name: 'Bacon Topping',  cost: 2.99 }, score: 0.72, scoreCode: 'AVERAGE', save: -1 },
      ],
    },
  },
];

export default {};
