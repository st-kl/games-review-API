const {
  createCategoryData,
  createUserData,
  createReviewData,
  createCommentData,
} = require("../db/utils/data-manipulation");

describe("Create category data", () => {
  test("returns an empty array when passed empty array", () => {
    expect(createCategoryData([])).toEqual([]);
  });
  test("does return new array", () => {
    const originalArray = [{ slug: "Juliette", description: 27 }];
    expect(createCategoryData(originalArray)).not.toBe(originalArray);
  });
  test("does not mutate original array", () => {
    const originalArray = [{ slug: "Juliette", description: 27 }];
    const newArray = [{ slug: "Juliette", description: 27 }];
    createCategoryData(originalArray);
    expect(originalArray).toEqual(newArray);
  });
  test("returns nested array with key/value pairs as elements", () => {
    const originalArray = [{ slug: "Juliette", description: 27 }];
    expect(createCategoryData(originalArray)).toEqual([["Juliette", 27]]);
  });
  test("returns nested array for multiple categories", () => {
    const originalArray = [
      { slug: "Juliette", description: 27 },
      { slug: "Steffen", description: 28 },
    ];
    expect(createCategoryData(originalArray)).toEqual([
      ["Juliette", 27],
      ["Steffen", 28],
    ]);
  });
});
describe("Create user data", () => {
  test("returns array of user data", () => {
    const originalArray = [
      { username: "JIsCool", avatar_url: "blah", name: "Juliette" },
      { username: "SIsNotCool", avatar_url: "blahdy", name: "Steffen" },
    ];
    expect(createUserData(originalArray)).toEqual([
      ["JIsCool", "blah", "Juliette"],
      ["SIsNotCool", "blahdy", "Steffen"],
    ]);
  });
});

describe("Create review data", () => {
  test("returns array of review data", () => {
    const originalArray = [
      {
        title: "Best Game",
        designer: "Big Brain Studios",
        owner: "Mine",
        review_body: "blah",
        created_at: new Date(1610964020514),
        category: "Something",
        votes: 2,
        review_img_url: "coolpig.jpeg",
      },
    ];
    expect(createReviewData(originalArray)).toEqual([
      [
        "Best Game",
        "Big Brain Studios",
        "Mine",
        "blah",
        new Date(1610964020514),
        "Something",
        2,
        "coolpig.jpeg",
      ],
    ]);
  });
  test("returns array of review data with default review_img_url", () => {
    const originalArray = [
      {
        title: "Best Game",
        designer: "Big Brain Studios",
        owner: "Mine",
        review_body: "blah",
        created_at: new Date(1610964020514),
        category: "Something",
        votes: 2,
        review_img_url: undefined,
      },
    ];
    console.log(originalArray[0].review_img_url);
    expect(createReviewData(originalArray)).toEqual([
      [
        "Best Game",
        "Big Brain Studios",
        "Mine",
        "blah",
        new Date(1610964020514),
        "Something",
        2,
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      ],
    ]);
  });
});

describe("Create comment data", () => {
  test("returns array of comment data", () => {
    const originalArray = [
      {
        author: "Thranduil",
        review_id: 4,
        votes: 12,
        created_at: new Date(1610964020514),
        body: "Do not talk to me of dragon fire!",
      },
      {
        author: "Arwen",
        review_id: 9,
        votes: 30,
        created_at: new Date(1610964020514),
        body: "If you want him, come and claim him!",
      },
    ];
    expect(createCommentData(originalArray)).toEqual([
      [
        "Thranduil",
        4,
        12,
        new Date(1610964020514),
        "Do not talk to me of dragon fire!",
      ],
      [
        "Arwen",
        9,
        30,
        new Date(1610964020514),
        "If you want him, come and claim him!",
      ],
    ]);
  });
});
