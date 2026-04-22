Base URL: http://localhost:8081/api

## Auth
| Method | Endpoint          | Auth | Deskripsi       |
|--------|-------------------|------|-----------------|
| POST   | /auth/register    | ❌   | Register user   |
| POST   | /auth/login       | ❌   | Login + JWT     |

## Posts  
| Method | Endpoint          | Auth | Deskripsi            |
|--------|-------------------|------|----------------------|
| GET    | /posts            | ❌   | Get semua post       |
| GET    | /posts/:id        | ❌   | Get detail post      |
| POST   | /posts            | ✅   | Buat post baru       |
| PUT    | /posts/:id        | ✅   | Edit post            |
| DELETE | /posts/:id        | ✅   | Hapus post           |
| GET    | /posts/search     | ❌   | Search post ?q=      |

## Bookmarks
| Method | Endpoint          | Auth | Deskripsi            |
|--------|-------------------|------|----------------------|
| GET    | /bookmarks        | ✅   | Get bookmark user    |
| POST   | /bookmarks        | ✅   | Tambah bookmark      |
| DELETE | /bookmarks/:id    | ✅   | Hapus bookmark       |

## Users
| Method | Endpoint          | Auth  | Deskripsi          |
|--------|-------------------|-------|--------------------|
| GET    | /users/:id        | ✅    | Get profil         |
| PUT    | /users/:id        | ✅    | Edit profil        |
| GET    | /admin/users      | ADMIN | List semua user    |
| DELETE | /admin/users/:id  | ADMIN | Hapus user         |