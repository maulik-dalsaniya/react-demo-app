import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  createSampleUser,
} from "../services/userService";
import type { User } from "../types/user";

interface ToastNotification {
  type: "success" | "error";
  message: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUsers(signal);
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching users."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadUsers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadUsers]);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText) ||
      (user.phone || "").toLowerCase().includes(searchText) ||
      (user.department || "").toLowerCase().includes(searchText) ||
      (user.role || "").toLowerCase().includes(searchText) ||
      (user.location || "").toLowerCase().includes(searchText)
    );
  });

  function handleDeleteUser(user: User) {
    setDeletingUser(user);
  }

  /**
   * DELETE - Delete a user
   * URL: https://jsonplaceholder.typicode.com/users/:id
   */
  async function confirmDeleteUser() {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      await deleteUser(deletingUser.id);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== deletingUser.id)
      );

      setToast({
        type: "success",
        message: `DELETE 200 OK: User #${deletingUser.id} (${deletingUser.name}) removed via https://jsonplaceholder.typicode.com/users/${deletingUser.id}`,
      });

      setDeletingUser(null);
    } catch (err: unknown) {
      setToast({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : `Failed to delete user #${deletingUser.id} via API.`,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const activeUsers = users.filter((user) => user.status === "Active").length;

  function handleAddUser() {
    setEditingUser(null);
    setShowForm(true);
  }

  function handleEditUser(user: User) {
    setEditingUser(user);
    setShowForm(true);
  }

  /**
   * POST / PUT - Add or Update a user
   * POST: https://jsonplaceholder.typicode.com/users
   * PUT:  https://jsonplaceholder.typicode.com/users/:id
   */
  async function handleSaveUser(userData: Omit<User, "id">) {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // PUT https://jsonplaceholder.typicode.com/users/:id
        await updateUser(editingUser.id, userData);

        setUsers((previousUsers) =>
          previousUsers.map((user) =>
            user.id === editingUser.id ? { ...userData, id: user.id } : user
          )
        );

        setToast({
          type: "success",
          message: `PUT 200 OK: Replaced data for user #${editingUser.id} via https://jsonplaceholder.typicode.com/users/${editingUser.id}`,
        });
      } else {
        // POST https://jsonplaceholder.typicode.com/users
        const created = await addUser(userData);
        const newId =
          created.id && !users.some((user) => user.id === created.id)
            ? created.id
            : users.length > 0
            ? Math.max(...users.map((user) => user.id)) + 1
            : 1;

        setUsers((previousUsers) => [
          { ...userData, id: newId },
          ...previousUsers,
        ]);

        setToast({
          type: "success",
          message: `POST 201 Created: Added user #${newId} via https://jsonplaceholder.typicode.com/users`,
        });
      }

      setShowForm(false);
      setEditingUser(null);
    } catch (err: unknown) {
      setToast({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to save user via API.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * POST - Create sample user helper
   * URL: https://jsonplaceholder.typicode.com/users
   */
  async function handleCreateSampleUser() {
    setIsSubmitting(true);
    try {
      const sample = await createSampleUser();
      const newId =
        sample.id && !users.some((user) => user.id === sample.id)
          ? sample.id
          : users.length > 0
          ? Math.max(...users.map((user) => user.id)) + 1
          : 1;

      const newUser: User = { ...sample, id: newId };
      setUsers((previous) => [newUser, ...previous]);

      setToast({
        type: "success",
        message: `POST 201 Created: Added sample user #${newId} via https://jsonplaceholder.typicode.com/users`,
      });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to create sample user via API.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingUser(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-rose-50 text-rose-900 border-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}

            <div className="flex-1 font-medium">{toast.message}</div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Header
          title="Users"
          description="Manage and view your team members and users."
          onAddUser={handleAddUser}
        />

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Users
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? "—" : users.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Active Users
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? "—" : activeUsers}
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Inactive Users
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? "—" : users.length - activeUsers}
            </h2>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Users List</h2> 
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {isLoading
                  ? "Loading..."
                  : `${filteredUsers.length} ${
                      filteredUsers.length === 1 ? "user" : "users"
                    }`}
              </span> 
              <button
                type="button"
                onClick={() => loadUsers()}
                disabled={isLoading}
                title="Refresh user list (GET)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                <svg
                  className={`w-3.5 h-3.5 text-slate-600 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>
          </div>

          <SearchBar search={search} onSearchChange={setSearch} />

          {isLoading && users.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <div className="inline-block w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-700">
                Loading users from API...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Fetching https://jsonplaceholder.typicode.com/users
              </p>
            </div>
          ) : error ? (
            <div className="py-10 px-4 text-center bg-rose-50 rounded-xl border border-rose-200">
              <svg
                className="mx-auto h-10 w-10 text-rose-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm font-semibold text-rose-800">
                Failed to load users
              </p>
              <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">
                {error}
              </p>
              <button
                type="button"
                onClick={() => loadUsers()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Try Again
              </button>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </section>

        {showForm && (
          <UserForm
            key={editingUser?.id ?? "new-user"}
            initialUser={editingUser}
            existingUsers={users}
            onSave={handleSaveUser}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        )}

        {deletingUser && (
          <DeleteConfirmModal
            user={deletingUser}
            onConfirm={confirmDeleteUser}
            onCancel={() => setDeletingUser(null)}
            isDeleting={isDeleting}
          />
        )}
      </main>
    </div>
  );
}
