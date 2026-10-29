import type { User } from "../types/user";
import StatusBadge from "./StatusBadge";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500">
        <svg
          className="mx-auto h-10 w-10 text-slate-300 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-sm font-medium">No users found</p>
        <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 -mb-6 sm:mx-0 sm:mb-0">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75">
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              User
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Phone
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Department
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Role
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Location
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {users.map((user) => {
            const initials = (user.name || "")
              .trim()
              .split(/\s+/)
              .map((part) => part[0] || "")
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <tr
                key={user.id}
                className="hover:bg-slate-50/80 transition-colors duration-100"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                  {user.phone || "—"}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    {user.department || "General"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                  {user.role}
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                  {user.location || "—"}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
