/**
 * Tests involving typescript.
 * This file should compile to pass.
 */
import { createPermissionsClass } from "../src";

enum PermissionsEnum1 {
  View,
  Edit,
  Share,
}

enum PermissionsEnum2 {
  View,
  Delete,
}

const Perms = createPermissionsClass(PermissionsEnum1);
const perms = Perms.from(PermissionsEnum1.Edit);

// should work with all enum values
perms.has(PermissionsEnum1.View);
perms.add(PermissionsEnum1.Edit);
perms.remove(PermissionsEnum1.Share);

// should raise an error if wrong enum used
// @ts-expect-error deliberately use wrong enum
perms.has(PermissionsEnum2.Delete);
// @ts-expect-error even with same enum name
perms.add(PermissionsEnum2.View);
