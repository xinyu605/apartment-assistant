import { dayStartInSelectedMonth } from "./lib";
describe("dayStartInSelectedMonth", () => {
  test("case1", () => {
    expect(dayStartInSelectedMonth(2009, 5)).toEqual(5);
  });

  test("case2", () => {
    expect(dayStartInSelectedMonth(2012, 12)).toEqual(6);
  });

  test("case3", () => {
    expect(dayStartInSelectedMonth(2021, 1)).toEqual(5);
  });
});
// describe("test function2", () => {});
// describe("test function3", () => {});
