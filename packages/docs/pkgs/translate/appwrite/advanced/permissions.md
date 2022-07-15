# Permissions

Appwrite permission mechanism offers a simple and yet flexible way to manage which users, teams, or roles can access a specific resource of your project, like documents and files.

Appwrite 权限机制提供了一种简单而灵活的方式来管理哪些用户、团队或角色可以访问项目的特定资源，例如文档和文件。

Using permissions, you can decide that only user A and user B will have read access to a specific database document, while user C and team X will be the only ones with write access.

使用 permissions，您可以决定只有用户 A 和用户 B 对特定数据库文档具有读取权限，而用户 C 和团队 X 将是唯一具有写入权限的人。

As the name suggests, read permission will allow users and teams to view a resource while with write permission, they will be able to both update or delete it.

顾名思义，读取权限将允许用户和团队查看资源，而具有写入权限时，他们将能够更新或删除它。

Read and write permissions can be given to specific users, entire teams, or only to a particular group of role members inside a team.

读写权限可以授予特定用户、整个团队或仅授予团队内的特定角色成员组。

A project user can only grant a resource with permissions he or she owns. For example, if a user is trying to share a document with a team, he or she are not members of, they will encounter a 401 not authorized error.

项目用户只能授予他拥有的权限的资源。例如，如果用户尝试与团队共享文档，但他或她不是团队 ​​ 成员，他们将遇到 401 未授权错误

::: tip Appwrite Resource
An Appwrite resource can be a database collection, database document, or a storage file. Each resource has both read and write permissions to define who can access it.

Appwrite 资源可以是数据库集合、数据库文档或存储文件。每个资源都有读写权限来定义谁可以访问它。

Using the Appwrite permissions mechanism, you can share resources between users, teams, and members with different roles.

使用 Appwrite 权限机制，您可以在不同角色的用户、团队和成员之间共享资源。
:::

## Default Values

When not providing a resource with read or write permissions, the default value will be empty. When a read or write permissions is missing, no one will be granted access control to the resource.

当不提供具有读取或写入权限的资源时，默认值为空。当缺少读取或写入权限时，将不会授予任何人对该资源的访问控制权。

::: tip Note
You will need an active session to handle database transactions for your collections.

您将需要一个活动会话来处理集合的数据库事务。

Using the Appwrite permissions mechanism, you can share resources between users, teams, and members with different roles.

使用 Appwrite 权限机制，您可以在不同角色的用户、团队和成员之间共享资源。
:::

## Permission Types

|         Type          | Description                                                                                                                           |
| :-------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|       role:all        | 通配符权限。授予任何人读取或写入权限                                                                                                  |
|    user:[USER_ID]     | 通过其 UID 设置特定用户。                                                                                                             |
|    team:[TEAM_ID]     | 特定团队的任何成员。 要获得此权限，用户必须是团队创建者（所有者），或者接收并接受加入此团队的邀请。                                   |
| team:[TEAM_ID]/[ROLE] | 在团队中拥有特定角色的任何成员,要获得此权限，用户必须是特定团队的成员并具有分配给他的给定角色。邀请用户成为团队成员时可以分配团队角色 |
|  member:[MEMBER_ID]   | 团队的特定成员,与基本用户权限不同，此权限仅在用户仍是特定团队的活跃成员时才有效。要查看用户成员 ID，请获取团队成员列表。              |
|      role:guest       | 任何来宾用户。登录用户无权访问此角色。                                                                                                |
|      role:member      | 任何登录的用户。登录用户是具有有效会话的用户。登录用户无权访问 `role:guest` 角色。对于通配符访问，使用 `*` 角色。                     |
