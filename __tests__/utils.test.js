const { createArray } = require("../db/utils/data-manipulation");

describe("createArray", () => {
  test("returns an empty array when passed empty array", () => {
    expect(createArray([])).toEqual([]);
  });
  test("does return new array", () => {
    const originalArray = [{ slug: "Juliette", description: 27 }];
    expect(createArray(originalArray)).not.toBe(originalArray);
  });
  test("does not mutate original array", () => {
    const originalArray = [{ slug: "Juliette", description: 27 }];
    const newArray = [{ slug: "Juliette", description: 27 }];
    createArray(originalArray);
    expect(originalArray).toEqual(newArray);
  });
  test("returns nested array with key/value pairs as elements", () => {
    const originalArray = [{ slug: "Juliette", description: 27 }];
    expect(createArray(originalArray)).toEqual([["Juliette", 27]]);
  });
  test("returns nested array for multiple categories", () => {
    const originalArray = [
      { slug: "Juliette", description: 27 },
      { slug: "Steffen", description: 28 },
    ];
    expect(createArray(originalArray)).toEqual([
      ["Juliette", 27],
      ["Steffen", 28],
    ]);
  });
});
