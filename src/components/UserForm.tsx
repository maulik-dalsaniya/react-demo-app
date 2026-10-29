import { useState, type FormEvent } from "react";
import type { User } from "../types/user";

interface UserFormProps {
  initialUser: User | null;
  existingUsers: User[];
  onSave: (user: Omit<User, "id">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: string;
  location?: string;
}

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Management",
  "Human Resources",
  "Finance",
  "Operations",
];

export default function UserForm({
  initialUser,
  existingUsers,
  onSave,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  const [name, setName] = useState(initialUser?.name ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [phone, setPhone] = useState(initialUser?.phone ?? "");
  const [department, setDepartment] = useState(
    initialUser?.department ?? "Engineering"
  );
  const [role, setRole] = useState(initialUser?.role ?? "");
  const [location, setLocation] = useState(initialUser?.location ?? "");
  const [status, setStatus] = useState<User["status"]>(
    initialUser?.status ?? "Active"
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address.";
    } else {
      const duplicate = existingUsers.some(
        (user) =>
          user.email.toLowerCase() === email.trim().toLowerCase() &&
          user.id !== initialUser?.id
      );

      if (duplicate) {
        newErrors.email = "This email is already in use.";
      }
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!department.trim()) {
      newErrors.department = "Department is required.";
    }

    if (!role.trim()) {
      newErrors.role = "Role is required.";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required.";
    }

    return newErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      role: role.trim(),
      location: location.trim(),
      status,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <section
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 id="user-form-title" className="text-lg font-bold text-slate-900">
              {initialUser ? "Edit User" : "Add New User"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the user details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close form"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((previous) => ({ ...previous, name: undefined }));
                }}
                placeholder="e.g. Alex Johnson"
                aria-invalid={Boolean(errors.name)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((previous) => ({ ...previous, email: undefined }));
                }}
                placeholder="alex@example.com"
                aria-invalid={Boolean(errors.email)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setErrors((previous) => ({ ...previous, phone: undefined }));
                }}
                placeholder="+1 (555) 000-0000"
                aria-invalid={Boolean(errors.phone)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.phone
                    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Department *
              </label>
              <select
                id="department"
                value={department}
                onChange={(event) => {
                  setDepartment(event.target.value);
                  setErrors((previous) => ({ ...previous, department: undefined }));
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.department}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Role *
              </label>
              <input
                id="role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setErrors((previous) => ({ ...previous, role: undefined }));
                }}
                placeholder="e.g. Frontend Engineer"
                aria-invalid={Boolean(errors.role)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.role
                    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />
              {errors.role && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Location *
              </label>
              <input
                id="location"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setErrors((previous) => ({ ...previous, location: undefined }));
                }}
                placeholder="Location"
                aria-invalid={Boolean(errors.location)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.location
                    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />
              {errors.location && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as User["status"])
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              {isSubmitting
                ? "Saving..."
                : initialUser
                ? "Update User"
                : "Save User"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
