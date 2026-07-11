type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "Henüz kayıt bulunmuyor.",
}: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-600 bg-[#141414] px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-700 bg-[#141414]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-neutral-800/50">
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 text-neutral-300 ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
