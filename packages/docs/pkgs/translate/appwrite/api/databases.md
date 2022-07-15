# Databases API

The Databases service allows you to create structured collections of documents, query and filter lists of documents, and manage an advanced set of read and write access permissions.

Databases 服务允许您创建结构化的文档(documents)集合(collections)、查询(query)和过滤(filter)文档列表，以及进一步管理读写权限。

All data returned by the Databases service are represented as structured JSON documents.

Databases 服务以 JSON 格式返回所有数据

The Databases service can contain multiple databases, each database can contain multiple collections. A collection is a group of similarly structured documents. The accepted structure of documents is defined by collection attributes. The collection attributes help you ensure all your user-submitted data is validated and stored according to the collection structure.

Databases 服务可以包含多个数据库(databases)，每个数据库(database)可以包含多个集合(collection)。集合(collection)是一组结构相似的文档(document)。文档结构由集合属性(attributes)定义。集合属性可帮助您确保根据集合结构验证和存储所有用户提交的数据。

Using Appwrite permissions architecture, you can assign read or write access to each collection or document in your project for either a specific user, team, user role, or even grant it with public access (role:all). You can learn more about how Appwrite handles permissions and access control.

使用 Appwrite 权限架构，您可以为特定用户、团队、用户角色分配项目中每个集合(collection)或文档(document)的读写权限，甚至授予它公共访问权限 (role:all)。您可以了解更多关于 Appwrite 如何处理权限和访问控制的信息。

## Create Document

::: tip POST
/v1/databases/{databaseId}/collections/{collectionId}/documents
:::

### HTTP Request

|     Name     | isRequired |   Type   | Description                                                                                                                                         |
| :----------: | :--------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|  databaseId  |  required  |  string  | Database ID.                                                                                                                                        |
| collectionId |  required  |  string  | Collection ID.确保在创建文档(document)之前定义属性(attributes)                                                                                      |
|  documentId  |  required  |  string  | Document ID.选择您自己的 unique ID 或传递字符串“unique()”以自动生成。有效字符为 a-z、A-Z、0-9、.、-和\_。不能以特殊字符开头。最大长度为 36 个字符。 |
|     data     |  required  |  object  | Document data as JSON object.                                                                                                                       |
|     read     |  optional  | string[] | 读取权限字符串数组,默认只有当前用户有此权限                                                                                                         |
|    write     |  optional  | string[] | 写入权限字符串数组,默认只有当前用户有此权限                                                                                                         |

### HTTP Response

| Status Code |   Content Type   | Payload                             |
| :---------: | :--------------: | ----------------------------------- |
| 201 Created | application/json | [Document Object](#document-object) |

#### Document Object

|    Name     |   Type   | Description           |
| :---------: | :------: | --------------------- |
|     $id     |  string  | Document ID.          |
| $collection |  string  | Collection ID.        |
| $createdAt  | integer  | 创建日期(Unix 时间戳) |
| $updatedAt  | integer  | 更新日期(Unix 时间戳) |
|    $read    | string[] | 文档读取权限。        |
|   $write    | string[] | 文档写入权限。        |

#### Document List Object

|   Name    |    Type    | Description                      |
| :-------: | :--------: | -------------------------------- |
|   total   |  integer   | 与您的查询相匹配的文档文档总数。 |
| documents | document[] | List of documents.               |

## List Documents

::: tip GET
/v1/databases/{databaseId}/collections/{collectionId}/documents
:::

### HTTP Request

|      Name       | isRequired |   Type   | Description                                                                                                      |
| :-------------: | :--------: | :------: | ---------------------------------------------------------------------------------------------------------------- |
|   databaseId    |  required  |  string  | Database ID.                                                                                                     |
|  collectionId   |  required  |  string  | Collection ID                                                                                                    |
|     queries     |  optional  | string[] | [Query class 返回的查询语句](#query-class) 字符串数组                                                            |
|      limit      |  optional  | integer  | res 中的最大文档数量,默认 25 个 ,每个请求最多 100 个                                                             |
|     offset      |  optional  | integer  | 使用 limit 来管理[分页](../advanced/pagination),默认 0                                                           |
|     cursor      |  optional  |  string  | 用作查询起点的文档 ID,不包括文档本身,用于处理大量数据的分页                                                      |
| cursorDirection |  optional  |  string  | cursor 的方向，可以是“before”或“after”。                                                                         |
| orderAttributes |  optional  | string[] | 用于对结果进行排序的属性数组,最多允许 100 个 order 属性，每个 4096 个字符。                                      |
|   orderTypes    |  optional  | string[] | 用于排序属性的顺序方向数组。 DESC 表示降序，或 ASC 表示升序。最多允许 100 种 order 类型(与 orderAttributes 对应) |

#### Query Class

To find specific documents in a collection, pass an array of query strings as a parameter to the listDocuments endpoint. The SDKs provide a Query class to make query building simpler:

要在集合中查找特定文档，请将查询字符串数组作为参数传递给 listDocuments 端点。 SDK 提供了一个 Query 类来简化查询构建：

```js
import {Databases, Query} from 'appwrite';
const databases = new Databases(client, '[DATABASE_ID]'); // 'client' comes from setup

databases.listDocuments('movies', [Query.equal('title', ['Avatar', 'Lord of the Rings'])]); //OR
```

The following operators are currently supported:

当前支持以下运算符：

|  operators   | Description   |
| :----------: | ------------- |
|    equal     | 等于          |
|   notEqual   | 不等于        |
|    lesser    | 少于          |
| lesserEqual  | 少于等于      |
|   greater    | 多于          |
| greaterEqual | 多于等于      |
|    search    | 需要全文索引? |

### HTTP Response

| Status Code |   Content Type   | Payload                                        |
| :---------: | :--------------: | ---------------------------------------------- |
|   200 OK    | application/json | [Documents List Object](#document-list-object) |

## Get Document

::: tip GET
/v1/databases/{databaseId}/collections/{collectionId}/documents/{documentId}
:::

### HTTP Request

|     Name     | isRequired |  Type  | Description                                         |
| :----------: | :--------: | :----: | --------------------------------------------------- |
|  databaseId  |  required  | string | Database ID.                                        |
| collectionId |  required  | string | Database ID.您可以使用 server 端 api 来创建新集合。 |
|  documentId  |  required  | string | Database ID.                                        |

### HTTP Response

| Status Code |   Content Type   | Payload                             |
| :---------: | :--------------: | ----------------------------------- |
|   200 OK    | application/json | [Document Object](#document-object) |

## Update Document

::: tip PATCH
/v1/databases/{databaseId}/collections/{collectionId}/documents/{documentId}
:::

### HTTP Request

|     Name     | isRequired |   Type   | Description                                             |
| :----------: | :--------: | :------: | ------------------------------------------------------- |
|  databaseId  |  required  |  string  | Database ID.                                            |
| collectionId |  required  |  string  | Database ID.                                            |
|  documentId  |  required  |  string  | Database ID.                                            |
|     data     |  required  |  object  | Document data as JSON object.仅包括要更新的属性和值对。 |
|     read     |  optional  | string[] | 读取权限字符串数组,默认情况下继承现有的读取权限         |
|    write     |  optional  | string[] | 写入权限字符串数组,默认情况下继承现有的写入权限         |

### HTTP Response

| Status Code |   Content Type   | Payload                             |
| :---------: | :--------------: | ----------------------------------- |
|   200 OK    | application/json | [Document Object](#document-object) |

## Delete Document

::: tip DELETE
/v1/databases/{databaseId}/collections/{collectionId}/documents/{documentId}
:::

### HTTP Request

|     Name     | isRequired |  Type  | Description                                         |
| :----------: | :--------: | :----: | --------------------------------------------------- |
|  databaseId  |  required  | string | Database ID.                                        |
| collectionId |  required  | string | Database ID.您可以使用 server 端 api 来创建新集合。 |
|  documentId  |  required  | string | Database ID.                                        |

### HTTP Response

|  Status Code   | Content Type | Payload |
| :------------: | :----------: | ------- |
| 204 No Content |      -       | -       |
