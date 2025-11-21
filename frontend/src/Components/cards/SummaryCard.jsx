export default function SummaryCard({ title, value, className }) {
  return (
    <div className={`p-5 bg-white shadow-lg rounded-2xl border-l-4 ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-3">{value}</p>
    </div>
  );
}
