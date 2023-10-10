import { test, expect } from "bun:test";
import { createPermissionsClass } from "../src";

enum TestPermissions {
  View,
  Edit,
  Share,
  Download,
}

test("no preloaded permissions should result in all false", () => {
  const perms = createPermissionsClass(TestPermissions).from(0);

  expect(perms.has(TestPermissions.Download)).toBeFalse();
  expect(perms.has(TestPermissions.Edit)).toBeFalse();
  expect(perms.has(TestPermissions.Share)).toBeFalse();
  expect(perms.has(TestPermissions.View)).toBeFalse();
});

test("preloaded with all should result in true", () => {
  const perms = createPermissionsClass(TestPermissions).from(0b1111);

  expect(perms.has(TestPermissions.View)).toBeTrue();
  expect(perms.has(TestPermissions.Edit)).toBeTrue();
  expect(perms.has(TestPermissions.Share)).toBeTrue();
  expect(perms.has(TestPermissions.Download)).toBeTrue();
});

test("preload using array should work", () => {
  const perms = createPermissionsClass(TestPermissions).from([
    TestPermissions.Edit,
    TestPermissions.View,
  ]);

  expect(perms.has(TestPermissions.View)).toBeTrue();
  expect(perms.has(TestPermissions.Download)).toBeFalse();
  expect(perms.has(TestPermissions.Edit)).toBeTrue();
  expect(perms.has(TestPermissions.Share)).toBeFalse();
});

test("a combination of adding and removing", () => {
  const perms = createPermissionsClass(TestPermissions).from(0);

  expect(perms.has(TestPermissions.View)).toBeFalse();
  perms.add(TestPermissions.View);
  expect(perms.has(TestPermissions.View)).toBeTrue();
  perms.remove(TestPermissions.View);
  expect(perms.has(TestPermissions.View)).toBeFalse();
});

test("double adding should keep true", () => {
  const perms = createPermissionsClass(TestPermissions).from(0);

  expect(perms.has(TestPermissions.View)).toBeFalse();
  perms.add(TestPermissions.View);
  expect(perms.has(TestPermissions.View)).toBeTrue();
  perms.add(TestPermissions.View);
  expect(perms.has(TestPermissions.View)).toBeTrue();
});

test("double removing should keep false", () => {
  const perms = createPermissionsClass(TestPermissions).from([
    TestPermissions.View,
  ]);

  expect(perms.has(TestPermissions.View)).toBeTrue();
  perms.remove(TestPermissions.View);
  expect(perms.has(TestPermissions.View)).toBeFalse();
  perms.remove(TestPermissions.View);
  expect(perms.has(TestPermissions.View)).toBeFalse();
});

test("cloning should create a copy", () => {
  const perms = createPermissionsClass(TestPermissions).from([
    TestPermissions.Edit,
  ]);

  const perms2 = perms.copy();
  perms2.remove(TestPermissions.Edit);

  expect(perms2.has(TestPermissions.Edit)).toBeFalse();
  expect(perms.has(TestPermissions.Edit)).toBeTrue();
});

test("has should work with array of enum values", () => {
  const perms = createPermissionsClass(TestPermissions).from([
    TestPermissions.Download,
    TestPermissions.View,
  ]);

  expect(
    perms.has([TestPermissions.Download, TestPermissions.View])
  ).toBeTrue();
  expect(
    perms.has([TestPermissions.Download, TestPermissions.Edit])
  ).toBeFalse();
  expect(perms.has([TestPermissions.Edit, TestPermissions.Share])).toBeFalse();
});

test("toBits should work properly", () => {
  const perms = createPermissionsClass(TestPermissions).from(0);

  perms.add(TestPermissions.View); // 0
  perms.add(TestPermissions.Share); // 2

  expect(perms.toBits()).toStrictEqual(0b0101n);
});
