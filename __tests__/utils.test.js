const {
  createCategoryData,
  createUserData,
  createReviewData,
  createCommentData,
  createRevRef,
} = require('../db/utils/data-manipulation');

describe('create column values', () => {
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
    it('returns nested array with values as elements', () => {
      const originalArray = [{ slug: 'Juliette', description: 27 }];
      expect(createCategoryData(originalArray)).toEqual([['Juliette', 27]]);
    });
    it('returns nested array with values as elements for multiple categories', () => {
      const originalArray = [
        { slug: 'Juliette', description: 27 },
        { slug: 'Steffen', description: 28 },
      ];
      expect(createCategoryData(originalArray)).toEqual([
        ['Juliette', 27],
        ['Steffen', 28],
      ]);
    });
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
          designer: 'Big Brain Studios',
          owner: 'Mine',
          review_body: 'blah',
          created_at: new Date(1610964020514),
          category: 'Something',
          votes: 2,
          review_img_url: 'coolpig.jpeg',
        },
      ];
      expect(createReviewData(originalArray)).toEqual([
        [
          'Best Game',
          'Big Brain Studios',
          'Mine',
          'blah',
          new Date(1610964020514),
          'Something',
          2,
          'coolpig.jpeg',
        ],
      ]);
    });
    it('returns array of review data with default review_img_url', () => {
      const originalArray = [
        {
          title: 'Best Game',
          designer: 'Big Brain Studios',
          owner: 'Mine',
          review_body: 'blah',
          created_at: new Date(1610964020514),
          category: 'Something',
          votes: 2,
          review_img_url: undefined,
        },
      ];
      expect(createReviewData(originalArray)).toEqual([
        [
          'Best Game',
          'Big Brain Studios',
          'Mine',
          'blah',
          new Date(1610964020514),
          'Something',
          2,
          'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        ],
      ]);
    });
  });

  describe('comment data', () => {
    it('returns array of comment data', () => {
      const originalArray = [
        {
          body: 'I loved this game too!',
          belongs_to: 'Jenga',
          created_by: 'bainesface',
          votes: 16,
          created_at: new Date(1511354613389),
        },
        {
          body: 'My dog loved this game too!',
          belongs_to: 'Ultimate Werewolf',
          created_by: 'mallionaire',
          votes: 13,
          created_at: new Date(1610964545410),
        },
      ];
      const dic = {
        Agricola: 1,
        Jenga: 2,
        'Ultimate Werewolf': 3,
        'Dolor reprehenderit': 4,
        'Proident tempor et.': 5,
      };
      expect(createCommentData(originalArray, dic)).toEqual([
        [
          'bainesface',
          2,
          16,
          new Date(1511354613389),
          'I loved this game too!',
        ],
        [
          'mallionaire',
          3,
          13,
          new Date(1610964545410),
          'My dog loved this game too!',
        ],
      ]);
    });
  });
});

describe('createRevRef', () => {
  it('returns an object when given an array', () => {
    expect(createRevRef([])).toEqual({});
  });
  it('returns a key-value pair for the object in the array', () => {
    expect(createRevRef([{ review_id: 8, title: 'Wizzard' }])).toEqual({
      Wizzard: 8,
    });
  });
  it('returns a key-value pair for any object in the array', () => {
    expect(
      createRevRef([
        { review_id: 8, title: 'Wizzard' },
        { review_id: 13, title: 'BioShock' },
      ])
    ).toEqual({
      Wizzard: 8,
      BioShock: 13,
    });
  });
  it('does not mutate the original array', () => {
    const comments = [
      { review_id: 8, title: 'Wizzard' },
      { review_id: 13, title: 'BioShock' },
    ];
    createRevRef(comments);

    expect(comments).toEqual([
      { review_id: 8, title: 'Wizzard' },
      { review_id: 13, title: 'BioShock' },
    ]);
  });
});
