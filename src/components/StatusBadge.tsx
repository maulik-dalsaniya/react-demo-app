interface StatusBadgeProps {
  status: "Active" | "Inactive";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
          : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
}