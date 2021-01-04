import { dayStartInSelectedMonth, daysInThisMonth } from "./lib";
describe("calculate Date", () => {
  test("Get the first day in selected month", () => {
    expect(dayStartInSelectedMonth(2009, 5)).toEqual(5);
    expect(dayStartInSelectedMonth(2012, 12)).toEqual(6);
    expect(dayStartInSelectedMonth(2021, 1)).toEqual(5);
  });

  test("Get total days in assigned month", () => {
    expect(daysInThisMonth(2016, 2)).toEqual(29);
    expect(daysInThisMonth(2018, 6)).toEqual(30);
    expect(daysInThisMonth(2021, 2)).toEqual(28);
  });

  // test("case3", () => {

  // });
});
// describe("test function2", () => {});
// describe("test function3", () => {});
