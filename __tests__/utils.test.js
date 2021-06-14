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
        review_body: "blah",
        designer: "Big Brain Studios",
        review_img_url: "coolpig.jpeg",
        votes: 2,
        category: "Something",
        owner: "Mine",
        created_at: new Date(1610964020514),
      },
    ];
    expect(createReviewData(originalArray)).toEqual([
      [
        "Best Game",
        "blah",
        "Big Brain Studios",
        "coolpig.jpeg",
        2,
        "Something",
        "Mine",
        new Date(1610964020514),
      ],
    ]);
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
