import type { User } from "../types/user";

interface ApiAddress {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
}

interface ApiCompany {
  name?: string;
  catchPhrase?: string;
  bs?: string;
}

interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  address?: ApiAddress | string;
  company?: ApiCompany;
}

const API_URL = "https://jsonplaceholder.typicode.com/users";

const DEFAULT_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Management",
  "Operations",
];

/**
 * GET
 * Fetch all users
 * URL: https://jsonplaceholder.typicode.com/users
 */
export async function getUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch users (status: ${response.status}).`);
  }

  const apiUsers: ApiUser[] = await response.json();

  return apiUsers.map((user) => {
    const location =
      typeof user.address === "object" && user.address?.city
        ? user.address.city
        : typeof user.address === "string"
        ? user.address
        : "San Francisco, CA";

    const department =
      DEFAULT_DEPARTMENTS[(user.id - 1) % DEFAULT_DEPARTMENTS.length];

    const status: User["status"] = user.id % 4 === 0 ? "Inactive" : "Active";

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "—",
      department,
      role: user.username || "Developer",
      location,
      status,
    };
  });
}

/**
 * GET
 * Fetch single user by ID
 * URL: https://jsonplaceholder.typicode.com/users/:id
 */
export async function getUserById(
  id: number,
  signal?: AbortSignal
): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch user #${id} (status: ${response.status}).`);
  }

  const user: ApiUser = await response.json();
  const location =
    typeof user.address === "object" && user.address?.city
      ? user.address.city
      : typeof user.address === "string"
      ? user.address
      : "San Francisco, CA";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "—",
    department: DEFAULT_DEPARTMENTS[(user.id - 1) % DEFAULT_DEPARTMENTS.length],
    role: user.username || "Developer",
    location,
    status: user.id % 4 === 0 ? "Inactive" : "Active",
  };
}

/**
 * POST
 * Add a user / Create a sample user
 * URL: https://jsonplaceholder.typicode.com/users
 */
export async function addUser(userData: Omit<User, "id">): Promise<User> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to add user (status: ${response.status}).`);
  }

  const data = await response.json();
  return {
    ...userData,
    id: typeof data.id === "number" ? data.id : Date.now(),
  };
}

// Alias for addUser
export const createUser = addUser;

/**
 * Convenience helper to create a sample user via POST
 * URL: https://jsonplaceholder.typicode.com/users
 */
export async function createSampleUser(): Promise<User> {
  return addUser({
    name: "Sample User",
    email: "sample.user@example.com",
    phone: "+1 (555) 019-2834",
    department: "Engineering",
    role: "Developer",
    location: "New York, NY",
    status: "Active",
  });
}

/**
 * PUT
 * Update a user / Replace user data
 * URL: https://jsonplaceholder.typicode.com/users/:id (e.g. https://jsonplaceholder.typicode.com/users/1)
 */
export async function updateUser(
  id: number,
  userData: Omit<User, "id">
): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ id, ...userData }),
  });

  if (!response.ok && id <= 10) {
    throw new Error(`Failed to update user #${id} (status: ${response.status}).`);
  }

  return { id, ...userData };
}

/**
 * DELETE
 * Delete a user / Delete user with ID (e.g. Delete the sample user with ID 1)
 * URL: https://jsonplaceholder.typicode.com/users/:id (e.g. https://jsonplaceholder.typicode.com/users/1)
 */
export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok && id <= 10) {
    throw new Error(`Failed to delete user #${id} (status: ${response.status}).`);
  }
}
