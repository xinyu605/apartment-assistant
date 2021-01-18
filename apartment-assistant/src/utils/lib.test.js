import {
  dayStartInSelectedMonth,
  daysInThisMonth,
  checkPasswordLength,
  checkEmailFormat,
} from "./lib";
describe("Calculate Date", () => {
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
});

describe("Check string format", () => {
  test("Check password length", () => {
    expect(checkPasswordLength("123")).toEqual("密碼需超過6個字元");
    expect(checkPasswordLength("")).toEqual("密碼需超過6個字元");
    expect(checkPasswordLength("3dk4idijk")).toEqual(true);
    expect(checkPasswordLength("djeijk")).toEqual(true);
  });

  test("Check Email format", () => {
    expect(checkEmailFormat("ejw")).toEqual("Email格式錯誤");
    expect(checkEmailFormat("")).toEqual("Email欄位不可留空");
    expect(checkEmailFormat("ww!kdj.clk")).toEqual("Email格式錯誤");
    expect(checkEmailFormat("ww@kdj.clk")).toEqual(true);
  });
});
