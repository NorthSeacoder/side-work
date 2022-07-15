# Pagination

Pagination is the process of dividing data into discrete pages. In Appwrite, it is achieved by using an offset or a cursor, which both come with their own use case and benefits.

在 Appwrite 中，它是通过使用 offset 或 cursor 来实现的，它们都有自己的用法和好处。

## Offset Pagination

Using limit and offset you can achieve one of the most common approaches to pagination.With limit you can define to how many documents that can be returned from one request, which can be up to a maximum of 100 documents. The offset is simply the number of records you wish to skip before selecting records.

使用 limit 和 offset，您可以实现最常见的分页方法之一。通过 limit，您可以定义一个请求可以返回多少个文档，最多可以是 100 个文档。offset 是您在选择记录之前希望跳过的记录数。

```js
import {Databases} from 'appwrite';
const databases = new Databases(client, '[DATABASE_ID]'); // 'client' comes from setup

// Page 1
const page1 = await databases.listDocuments('movies', [], 25, 0);

// Page 2
const page2 = await databases.listDocuments('movies', [], 25, 25);
```

The maximum offset is 5000, since the request gets slower as the number of records increases because the database has to read up to the offset number of rows to know where it should start selecting data. Also when there is data added in high frequency - the individual pages might skip results.

最大 offset 是 5000，随着记录数的增加，请求会变慢，因为数据库必须读取到 offset 的行数才能知道应该从哪里开始选择数据.此外，当高频添加数据时,各个页面可能会跳过结果。

## Cursor Pagination

The cursor is a unique identifier for a specific record, which acts as a pointer to the next record we want to start querying from to get the next page of results. Additionally to the cursor you can pass the cursor position as the cursorDirection before and after allowing you to get paginate back and forth.

cursor 是特定记录的唯一标识符，它指向当前数据的最后一条。除了 cursor 之外，您还可以传递 cursorDirection(before | after) 来控制来回分页

```js
import {Databases} from 'appwrite';
const databases = new Databases(client, '[DATABASE_ID]'); // 'client' comes from setup

// Page 1
const page1 = await databases.listDocuments('movies', [], 25, 0);
const lastId = results.documents[results.documents.length - 1].$id;

// Page 2
const page2 = await databases.listDocuments('movies', [], 25, 0, lastId);
```

## When to use what?

The different scenarios in which offset or cursor pagination make the most sense depends on the data itself and how often new records are added. When querying static data, the performance cost alone may not be enough for you to use a cursor, as the added complexity that comes with it may be more than you need.

使用 offset 或 cursor 分页取决于数据本身以及添加新记录的频率。在查询静态数据时，仅凭性能成本可能不足以让您使用 cursor，因为随之而来的附加复杂性可能超出您的需要。

Offset pagination should be used for static data with an indicator to what is the current page and how many pages are available in total. For example a list with up to 20 pages or static data like a list of countries or currencies.

offset 分页应用于静态数据，并指明当前页面以及总页数.例如，最多 20 页的列表或静态数据（如国家或货币列表）。

Cursor pagination should be used high-frequency data which is lazy-loaded with infinite scrolling. For example a feed, comment section, chat history or high volume datasets.

cursor 分页应该使用无限滚动的懒加载的高频数据。例如提要、评论部分、聊天记录或大量数据集。
