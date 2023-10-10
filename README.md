# ts-permissions
A simple lightweight and typesafe bitwise permissions library built around enums. Makes it impossible (assuming you have typecheck) to accidentally use the wrong enum when checking permissions. Zero runtime dependencies!

```ts
// If you use the wrong enum, you'll get a TypeError!
userperms.has(APITokenPermissions.Flags.ListProjects);
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//            Argument of type 'ApiTokenPermissions.ListProjects' is not assignable to parameter of type 'UserPermissions'
```

## Installation
```
npm install --save ts-permissions
```

## Usage
Start by creating an Enum that stores all the flags you want:

```ts
enum EUserPermissions {
  Administrator,
  View,
  Edit
};

enum EAPITokenPermissions {
  ListProjects,
  // etc
}
```

Then import the package and create the updated Permissions class by using the helper function `createPermissionsClass`:
```ts
// you can then create a permissions class using the helper
import { createPermissionsClass } from "ts-permissions";

export const UserPermissions = createPermissionsClass(EUserPermissions);
export const APITokenPermissions = createPermissionsClass(EAPITokenPermissions);
```

This will create a class that has the Enum stored in a static `Flags` parameter.
```ts
// and now you can create instances like this:
const userperms = UserPermissions.from(0);

// or like this
const userperms = UserPermissions.from([
  UserPermissions.Flags.Administrator
]);

// or with the new keyword
const userperms = new UserPermissions(0);
```

Lastly, you can use the `.has`, `.add`, `.remove` to check or modify the permissions. Use `.toBits()` to get the final bigint.
```ts
// and you can modify like this:
userperms.add(UserPermissions.Flags.Administrator);
userperms.remove(UserPermissions.Flags.Administrator);

// and you can check for permissions like this
userperms.has(UserPermissions.Flags.Administrator);
userperms.has([UserPermissions.Flags.View, UserPermissions.Flags.Edit]); 

// and if you use the wrong enum, you'll get a typeerror!
userperms.has(APITokenPermissions.Flags.ListProjects);
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//            Argument of type 'EApiTokenPermissions.ListProjects' is not assignable to parameter of type 'EUserPermissions'

// then to save the bits into your DB,
userperms.toBits(); // returns bigint
```