# Project Rules — React + Vite + TanStack Query + Zustand

> Frontend coding conventions. Both AI and developer must follow.
> This is the single source of truth — all AI tools read this file.

---

## 0. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.x |
| Build | Vite |
| Routing | React Router 7 |
| Server State | TanStack Query (React Query) v5 |
| Client State | Zustand |
| HTTP Client | Axios |
| Styling | Tailwind CSS 4 |
| Table | TanStack Table v8 |
| Form | React Hook Form + Zod validation |
| Icons | Lucide React |
| Date | Day.js |

---

## 1. Project Structure

```
src/
├── app/                           # App-level setup
│   ├── App.tsx                    # Root component + providers
│   ├── routes.tsx                 # All route definitions
│   └── providers.tsx              # QueryClientProvider, AuthProvider
│
├── config/                        # Configuration
│   ├── api.ts                     # Axios instance + interceptors
│   ├── queryClient.ts            # TanStack Query defaults
│   └── constants.ts              # API_BASE_URL, PAGE_SIZE, etc.
│
├── features/                      # Business features
│   └── {feature}/
│       ├── CONTEXT.md            # Implementation snapshot
│       ├── components/           # Feature-specific UI
│       ├── hooks/                # React Query hooks
│       ├── api.ts                # Axios API functions
│       ├── types.ts              # Request/Response types
│       └── store.ts              # Zustand (only if needed)
│
├── components/                    # Shared components
│   ├── ui/                        # Primitives (Button, Input, Modal)
│   ├── layout/                    # AdminLayout, Sidebar, Header
│   └── common/                    # DataTable, Pagination, SearchBar, ConfirmDialog
│
├── hooks/                         # Shared hooks
├── utils/                         # Pure utility functions
├── types/                         # Shared types (ApiResponse, Pagination)
│
└── main.tsx
```

### Rules
- 1 feature = 1 folder containing components, hooks, api, types
- Feature components stay inside the feature folder, NOT in shared `components/`
- Shared `components/` only for truly reusable UI used by 2+ features
- Shared `hooks/` only for hooks used by 2+ features
- If a hook/component is only used by 1 feature → keep it inside that feature

---

## 2. Naming Convention

### Files
| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `UserTable.tsx`, `LoginForm.tsx` |
| Hook | camelCase, `use` prefix | `useUsers.ts`, `useCreateUser.ts` |
| API file | camelCase | `api.ts` |
| Types file | camelCase | `types.ts` |
| Store file | camelCase | `store.ts` |
| Utility | camelCase | `format.ts`, `storage.ts` |
| Constant | camelCase | `constants.ts` |

### Components
```tsx
// File name = Component name = PascalCase
// UserTable.tsx
export function UserTable() { ... }
```

### Hooks
```tsx
// 1 hook = 1 API call
// Naming: use{Action}{Entity}
useUsers()          // GET /users (list)
useUser(id)         // GET /users/:id (single)
useCreateUser()     // POST /users
useUpdateUser()     // PUT /users
useDeleteUser()     // DELETE /users/:id
useLogin()          // POST /auth/login
useCurrentUser()    // GET /auth/me
```

### Variables & Functions
- `camelCase` for variables, functions, hooks
- `PascalCase` for components, types, interfaces
- `UPPER_SNAKE_CASE` for constants
- Boolean: `is/has/can` prefix — `isLoading`, `hasPermission`, `canDelete`

---

## 3. Feature Pattern — The Core Pattern AI Must Follow

Every feature follows this exact structure. AI copies this pattern for every new feature.

### Step 1: `types.ts` — Mirror Backend DTOs

```tsx
// types.ts — matches backend DTOs exactly

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  age: number | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  address: string | null;
  avatar: string | null;
  company: { id: number; name: string } | null;
  roles: { id: number; name: string }[];
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  companyId?: number;
  roleIds?: number[];
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  companyId?: number;
  roleIds?: number[];
}
```

### Step 2: `api.ts` — Pure Axios Functions (No Hooks, No State)

```tsx
// api.ts — pure functions, no React dependency

import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from "./types";

export const userApi = {
  getAll(params?: { page?: number; size?: number }) {
    return api.get<ApiResponse<PaginatedResponse<UserResponse>>>("/users", { params });
  },

  getById(id: number) {
    return api.get<ApiResponse<UserResponse>>(`/users/${id}`);
  },

  create(data: CreateUserRequest) {
    return api.post<ApiResponse<UserResponse>>("/users", data);
  },

  update(data: UpdateUserRequest) {
    return api.put<ApiResponse<UserResponse>>("/users", data);
  },

  delete(id: number) {
    return api.delete<ApiResponse<void>>(`/users/${id}`);
  },
};
```

### Step 3: `hooks/` — 1 Hook = 1 API Call

```tsx
// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";

export function useUsers(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getAll(params).then((res) => res.data),
  });
}

// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApi.getById(id).then((res) => res.data),
    enabled: id > 0,
  });
}

// hooks/useCreateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { CreateUserRequest } from "../types";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) =>
      userApi.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// hooks/useUpdateUser.ts — same pattern as create

// hooks/useDeleteUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

### Step 4: `components/` — UI Calls Hooks

```tsx
// components/UserTable.tsx
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";

export function UserTable() {
  const { data, isLoading, isError } = useUsers({ page: 1, size: 10 });
  const deleteUser = useDeleteUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  const users = data?.data.result ?? [];

  return (
    <table>
      {/* render users */}
    </table>
  );
}
```

---

## 4. Shared Types — `types/api.ts`

```tsx
// Mirror backend ApiResponse wrapper exactly

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  result: T[];
}
```

These types are used by ALL features. Never redefine them inside a feature.

---

## 5. Axios Config — `config/api.ts`

```tsx
import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,        // Send cookies (refresh token)
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → try refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });
        const newToken = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
```

### Rules
- ONE Axios instance for the entire app — imported from `@/config/api`
- NEVER create `new axios` inside a feature
- Token attach and refresh handled by interceptors — features don't know about tokens
- `withCredentials: true` for cookie-based refresh token (ADR-001)

---

## 6. Auth Store — Zustand

```tsx
// features/auth/store.ts
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: { id: number; name: string; email: string } | null;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  logout: () => set({ accessToken: null, user: null }),
}));
```

### When to Use Zustand vs React Query

| Data | Tool | Why |
|------|------|-----|
| User list from API | React Query | Server state — cached, auto-refetch |
| Current logged-in user | Zustand | Client state — set once at login |
| Sidebar open/closed | Zustand | UI state — no API involved |
| Company detail from API | React Query | Server state |
| Selected table rows | React `useState` | Local component state |
| Form input values | React Hook Form | Form library handles it |

**Rule:** if data comes from API → React Query. If not → Zustand or useState.

---

## 7. Component Rules

### Function Components Only
```tsx
// ✅ CORRECT
export function UserTable() { ... }

// ❌ WRONG — no class components
class UserTable extends React.Component { ... }

// ❌ WRONG — no default export
export default function UserTable() { ... }
```

### Named Export Only
```tsx
// ✅ CORRECT
export function UserTable() { ... }
export function useUsers() { ... }

// ❌ WRONG
export default function UserTable() { ... }
```

### Component Structure
```tsx
export function UserTable() {
  // 1. Hooks (query, mutation, state, refs)
  const { data, isLoading } = useUsers();
  const [search, setSearch] = useState("");

  // 2. Derived values
  const users = data?.data.result ?? [];
  const filteredUsers = users.filter(u => u.name.includes(search));

  // 3. Handlers
  function handleDelete(id: number) { ... }

  // 4. Early returns (loading, error)
  if (isLoading) return <LoadingSpinner />;

  // 5. Main render
  return ( ... );
}
```

### Props — Use Interface, Not Inline

```tsx
// ✅ CORRECT
interface UserCardProps {
  user: UserResponse;
  onDelete: (id: number) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) { ... }

// ❌ WRONG — inline props
export function UserCard({ user, onDelete }: { user: any; onDelete: any }) { ... }
```

---

## 8. Form Handling — React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.number().min(1).max(120).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export function CreateUserForm() {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  function onSubmit(data: CreateUserFormData) {
    createUser.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* ... */}
    </form>
  );
}
```

### Rules
- ALL forms use React Hook Form + Zod
- Zod schema defined in the same file as the form component
- NEVER use uncontrolled form with manual `onChange` + `useState` per field
- Validation messages in English

---

## 9. Routing — React Router 7

```tsx
// app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: () => import("@/features/auth/components/LoginPage"),
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "users", lazy: () => import("@/features/user/components/UserListPage") },
      { path: "users/:id", lazy: () => import("@/features/user/components/UserDetailPage") },
      { path: "companies", lazy: () => import("@/features/company/components/CompanyListPage") },
      { path: "roles", lazy: () => import("@/features/role/components/RoleListPage") },
      { path: "permissions", lazy: () => import("@/features/permission/components/PermissionListPage") },
    ],
  },
]);
```

### Rules
- ALL routes defined in one file: `app/routes.tsx`
- Use `lazy()` for code splitting — every page is lazy loaded
- Protected routes wrapped in `AdminLayout` (checks auth)
- Public routes (login, register) outside layout

---

## 10. Styling — Tailwind CSS

### Rules
- Tailwind utility classes directly on JSX elements
- NO inline `style={{}}` — use Tailwind instead
- NO CSS modules, NO styled-components, NO separate `.css` files per component
- ONE global CSS file only: `src/index.css` (for Tailwind directives + global resets)
- Extract repeated patterns into shared components, NOT into custom CSS classes

```tsx
// ✅ CORRECT — Tailwind utilities
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Save
</button>

// ✅ CORRECT — extract to component if repeated
<Button variant="primary">Save</Button>

// ❌ WRONG — inline style
<button style={{ backgroundColor: "blue", color: "white" }}>Save</button>

// ❌ WRONG — CSS module
import styles from "./Button.module.css"
```

### Conditional Classes
```tsx
// Use template literals or clsx/cn utility
<div className={`p-4 rounded-lg ${isActive ? "bg-blue-100" : "bg-gray-100"}`}>
```

---

## 11. Error Handling

### API Errors in Hooks
```tsx
// React Query handles error state automatically
const { data, isLoading, isError, error } = useUsers();

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### Mutation Errors
```tsx
const createUser = useCreateUser();

function handleSubmit(data: CreateUserRequest) {
  createUser.mutate(data, {
    onSuccess: () => {
      toast.success("User created");
      navigate("/users");
    },
    onError: (error) => {
      // Extract backend error message
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
}
```

### Rules
- NEVER use `try/catch` around React Query hooks — they handle errors internally
- Use `onError` callback in `useMutation` for user-facing error messages
- Global 401 handling in Axios interceptor — features don't handle auth errors
- Show user-friendly messages, not raw error objects

---

## 12. TypeScript Rules

### Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Rules
- NEVER use `any` — use proper types or `unknown` if truly unknown
- NEVER use `@ts-ignore` or `@ts-expect-error`
- NEVER use type assertion (`as`) unless absolutely necessary
- Always define return types for API functions
- Use `interface` for object shapes, `type` for unions/intersections

```tsx
// ✅ CORRECT
interface UserResponse {
  id: number;
  name: string;
}

type Gender = "MALE" | "FEMALE" | "OTHER";

// ❌ WRONG
const user: any = response.data;
const name = (user as any).name;
```

---

## 13. Code Size Limits

| Metric | Limit | Action |
|--------|-------|--------|
| Component file | < 200 lines | Extract sub-components |
| Hook file | < 50 lines | Typically 15-30 lines |
| API file | < 100 lines | Split if too many endpoints |
| Types file | < 100 lines | Split by domain if needed |
| Utility function | < 30 lines | Extract helpers |

---

## 14. Import Path — Use Alias

```json
// vite.config.ts → resolve.alias
// tsconfig.json → paths
"@/*" → "src/*"
```

```tsx
// ✅ CORRECT — alias
import { useUsers } from "@/features/user/hooks/useUsers";
import { Button } from "@/components/ui/Button";

// ❌ WRONG — relative hell
import { useUsers } from "../../../features/user/hooks/useUsers";
```

---

## 15. DO NOT

- Do NOT use `any`
- Do NOT use `export default`
- Do NOT use class components
- Do NOT use inline `style={{}}`
- Do NOT create Axios instances inside features
- Do NOT store server data in Zustand — use React Query
- Do NOT write `try/catch` around React Query hooks
- Do NOT put feature-specific components in shared `components/`
- Do NOT create files > 200 lines
- Do NOT handle auth token manually in features — interceptor does it

---

## 16. When Adding a New Feature

Follow this exact order:
1. Create feature folder in `features/{name}/`
2. Write `types.ts` — mirror backend DTOs from `API_SPEC.md`
3. Write `api.ts` — pure Axios functions
4. Write `hooks/` — 1 hook per API call
5. Write `components/` — pages and UI
6. Add route in `app/routes.tsx`
7. Write `CONTEXT.md` if module has non-obvious decisions
8. Update `PROJECT-STATUS.md`

---

## 17. Documentation Requirements

| When | Action |
|------|--------|
| End of every coding session | Update `docs/PROJECT-STATUS.md` |
| New feature with non-obvious logic | Create `CONTEXT.md` inside feature folder |
| Architecture decision | Create new file in `docs/decisions/` |
| New pages/routes | Update route comments in `app/routes.tsx` |

---

## 18. Table — TanStack Table v8

All admin CRUD tables use a shared `DataTable` component powered by TanStack Table.
This ensures consistent behavior (pagination, sorting, filtering) across all features.

### Shared `DataTable` Component — `components/common/DataTable.tsx`

```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { PaginationMeta } from "@/types/api";

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  meta,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // server-side pagination
    pageCount: meta?.pages ?? -1,
  });

  // render table header, body, pagination controls
}
```

### Column Definitions — Inside Each Feature

```tsx
// features/user/components/UserListPage.tsx
import { createColumnHelper } from "@tanstack/react-table";
import type { UserResponse } from "../types";

const columnHelper = createColumnHelper<UserResponse>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("company", {
    header: "Company",
    cell: (info) => info.getValue()?.name ?? "—",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <>
        <Button onClick={() => handleEdit(row.original)}>Edit</Button>
        <Button onClick={() => handleDelete(row.original.id)}>Delete</Button>
      </>
    ),
  }),
];
```

### Server-Side Pagination & Filtering

```tsx
// Each list page manages query params and passes them to the hook
export function UserListPage() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useUsers({ page, size, search });

  return (
    <DataTable
      columns={columns}
      data={data?.data.result ?? []}
      meta={data?.data.meta}
      isLoading={isLoading}
      onPageChange={setPage}
      onPageSizeChange={setSize}
    />
  );
}
```

### Toolbar — Filter Bar Above Table

Each feature's list page renders a toolbar above `DataTable` with:
- Search input (debounced, sends `search` param to backend)
- Filter dropdowns (feature-specific: e.g. company, role, method)
- "Create" button

```tsx
<div className="flex items-center justify-between mb-4">
  <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
  <Button onClick={() => setShowCreateModal(true)}>
    <Plus className="w-4 h-4 mr-2" /> Add User
  </Button>
</div>
<DataTable columns={columns} data={users} meta={meta} ... />
```

### Rules
- ALL list pages use `DataTable` — no custom `<table>` elements
- Column definitions live inside the feature's list page component file
- Pagination is always **server-side** (`manualPagination: true`)
- Filtering/search params are managed by the list page via `useState` → passed to React Query hook
- `DataTable` does NOT fetch data — it receives `data` and `meta` as props
- Sorting: send `sort` query param to backend, NOT client-side sort