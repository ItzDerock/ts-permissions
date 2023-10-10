import { type StandardEnum, assert } from "./utils";
enum DefaultFlags {}

/**
 * Creates a class representing a set of permissions
 */
export class Permission<T> {
  public static Flags: StandardEnum<number> = DefaultFlags;
  private permissions = 0n;

  /**
   * Creates a helper class for working with permissions
   * @param allPermissions The permissions enum
   * @param givenPermissions The permissions to start with
   */
  constructor(givenPermissions?: number | bigint | T[keyof T][]) {
    if (
      typeof givenPermissions === "number" ||
      typeof givenPermissions === "bigint"
    ) {
      this.permissions = BigInt(givenPermissions);
    } else if (Array.isArray(givenPermissions)) {
      givenPermissions.forEach((permission) => {
        this.add(permission);
      });
    }
  }

  /**
   * Creates a new instance of Permission
   * @param permission The default permissions
   * @returns a new instance of Permission
   */
  static from(permission: number | bigint) {
    return new Permission(permission);
  }

  /**
   * Converts a permission index to a bitmask
   * @param index The 0-based index of the permission
   * @returns the permission as a bitmask
   */
  private toPermissionBitmask(permission: T[keyof T]): bigint {
    let permissionIndex = -1;

    // if is a string, that means we reversed the enum
    if (typeof permission === "string") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const resolved = (this.constructor as unknown as typeof Permission).Flags[
        permission
      ];

      assert(typeof resolved === "number", "Invalid permission");
      permissionIndex = resolved;
    } else if (typeof permission === "number") {
      permissionIndex = permission;
    }

    assert(permissionIndex >= 0, "Failed to resolve permission");
    return 1n << BigInt(permissionIndex);
  }

  /**
   * Adds a permission to the set
   * @param permission The permission to add
   */
  public add(permission: T[keyof T]) {
    this.permissions |= this.toPermissionBitmask(permission);
  }

  /**
   * Removes a permission from the set
   * @param permission The permission to remove
   */
  public remove(permission: T[keyof T]) {
    this.permissions &= ~this.toPermissionBitmask(permission);
  }

  /**
   * Checks if the set has a permission
   * @param permission The permission(s) to check
   * @returns true if the set has the permission
   */
  public has(permission: T[keyof T] | T[keyof T][]): boolean {
    if (Array.isArray(permission)) {
      return permission.every((perm) => this.has(perm));
    }

    return (this.permissions & this.toPermissionBitmask(permission)) !== 0n;
  }

  /**
   * Returns a new instance of Permission for a new set of permissions
   * @param permissions The permissions to start with
   */
  public for(permissions: number | bigint | T[keyof T][]) {
    return new Permission<T>(permissions);
  }

  /**
   * Creates a copy of the current set of permissions
   * @returns a new instance of Permission
   */
  public copy() {
    return new Permission<T>(this.permissions);
  }

  /**
   * Returns the permissions as a bitmask
   * @returns the permissions as a bitmask
   */
  public toBits() {
    return this.permissions;
  }
}
