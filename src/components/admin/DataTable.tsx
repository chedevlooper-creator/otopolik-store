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
      <div className="border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-surface-hover">
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 text-foreground ${col.className ?? ""}`}>
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
