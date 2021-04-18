import { Asserts } from "DepsTest";
import { HelpersUtilities as H$ } from "Utilities";
const { assertEquals } = Asserts;
const assert: any = Asserts.assert;

Deno.test({
  name: "suite :: UTILITIES/HELPERS/TIME",
  ignore: true,
  fn() {},
});

Deno.test("getYear() should return the year", () => {
  const date = new Date();
  const year = date.getFullYear();
  assertEquals(H$.getYear(date), year);
});

Deno.test("getMonth() should return the month", () => {
  const date = new Date();
  const month = 1 + date.getMonth(); // JS months are 0-indexed.
  assertEquals(H$.getMonth(date), month);
});

Deno.test("getDay() should return the day", () => {
  const date = new Date();
  const day = date.getDate();
  assertEquals(H$.getDay(date), day);
});

Deno.test("getHour() should return the hour", () => {
  const date = new Date();
  const hour = date.getHours();
  assertEquals(H$.getHour(date), hour);
});

Deno.test("getMinute() should return the minutes", () => {
  const date = new Date();
  const minute = date.getMinutes();
  assertEquals(H$.getMinute(date), minute);
});

Deno.test("getSecond() should return the seconds", () => {
  const date = new Date();
  const second = date.getSeconds();
  assertEquals(H$.getSecond(date), second);
});

Deno.test("getTimestamp() should return a numeric timestamp based on the pattern %Y%m%d%H%M%S", () => {
  const timestamp = H$.getTimestamp();
  assert(timestamp >= 2020_09_07_17_46_14);
  assert(timestamp < 9999_12_31_23_59_59);
});
