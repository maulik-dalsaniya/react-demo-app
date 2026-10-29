interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({
  search,
  onSearchChange,
}: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by name, email, department, role, or location..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150"
      />
    </div>
  );
}