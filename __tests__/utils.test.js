const {
  createCategoryData,
  createUserData,
  createReviewData,
<<<<<<< HEAD
} = require('../db/utils/data-manipulation');

describe('CREATE TABLE DATA', () => {
  describe('category data', () => {
    it('returns an empty array when passed empty array', () => {
      expect(createCategoryData([])).toEqual([]);
    });
    it('returns a new array', () => {
      const originalArray = [{ slug: 'Juliette', description: 27 }];
      expect(createCategoryData(originalArray)).not.toBe(originalArray);
    });
    it('does not mutate original array', () => {
      const originalArray = [{ slug: 'Juliette', description: 27 }];
      const newArray = [{ slug: 'Juliette', description: 27 }];
      createCategoryData(originalArray);
      expect(originalArray).toEqual(newArray);
    });
    it('returns nested array with keys as elements', () => {
      const originalArray = [{ slug: 'Juliette', description: 27 }];
      expect(createCategoryData(originalArray)).toEqual([['Juliette', 27]]);
    });
    it('returns nested arrays with keys as elements for multiple categories', () => {
      const originalArray = [
        { slug: 'Juliette', description: 27 },
        { slug: 'Steffen', description: 28 },
      ];
      expect(createCategoryData(originalArray)).toEqual([
        ['Juliette', 27],
        ['Steffen', 28],
      ]);
    });
=======
  createCommentData,
} = require("../db/utils/data-manipulation");

describe("Create category data", () => {
  test("returns an empty array when passed empty array", () => {
    expect(createCategoryData([])).toEqual([]);
>>>>>>> ac6dd208b05ad4f97332c1c6b3e4f696c10e5812
  });
  
  describe('user data', () => {
    it('returns array of user data', () => {
      const originalArray = [
        { username: 'JIsCool', avatar_url: 'blah', name: 'Juliette' },
        { username: 'SIsNotCool', avatar_url: 'blahdy', name: 'Steffen' },
      ];
      expect(createUserData(originalArray)).toEqual([
        ['JIsCool', 'blah', 'Juliette'],
        ['SIsNotCool', 'blahdy', 'Steffen'],
      ]);
    });
  });

  describe('review data', () => {
    it('returns array of review data', () => {
      const originalArray = [
        {
          title: 'Best Game',
          review_body: 'nice game',
          designer: 'Brain Studios',
          review_img_url: 'coolpic.jpeg',
          votes: 2,
          category: 'treasure hunt',
          owner: 'Mine',
          created_at: new Date(1610964020514),
        },
      ];
      expect(createReviewData(originalArray)).toEqual([
        [
          'Best Game',
          'Brain Studios',
          'Mine',
          'coolpic.jpeg',
          'nice game',
          'treasure hunt',
          new Date(1610964020514),
          2,
        ],
      ]);
    });
  });
});
describe("Create comment data", () => {
  test("returns array of comment data", () => {
    const originalArray = [
      { author: "Thranduil", review_id: 4 },
      { author: "Arwen", review_id: 9 },
    ];
    expect(createCommentData(originalArray)).toEqual([
      ["Thranduil", 4],
      ["Arwen", 9],
    ]);
  });
});
