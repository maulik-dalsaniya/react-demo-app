interface HeaderProps {
  title: string;
  description: string;
  onAddUser: () => void;
}

export default function Header({
  title,
  description,
  onAddUser,
}: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onAddUser}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer self-start sm:self-auto"
      >
        <span className="text-lg leading-none font-bold">+</span>
        <span>Add User</span>
      </button>
    </header>
  );
}