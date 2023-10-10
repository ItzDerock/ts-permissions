import type { StandardEnum } from "./utils";
import { Permission } from "./permission";

/**
 * Creates a new Permissions class for a given permissions enum.
 *
 * @example ```ts
 * enum Permissions { View, Edit, Manage };
 * const UserPermissions = createPermissionsClass<Permissions>(
 *  Permissions, "UserPermissions"
 * );
 *
 * UserPermissions.from(0b111).has(UserPermissions.Flags.View);
 * ```
 *
 * @param permissionsEnum The permissions enum
 * @param name Optional class name (doesn't do much)
 * @returns The custom class
 */
export default function <T extends StandardEnum<number>>(
  permissionsEnum: T,
  name?: string
) {
  // @ts-expect-error - im tired of fighting with typescript
  const Class = class extends Permission<T> {
    public static Flags = permissionsEnum;
    static from(permission: number | bigint | T[keyof T][]) {
      return new Permission(permission);
    }
  };

  if (name) {
    Object.defineProperty(Class, "name", { value: name });
  }

  return Class;
}
