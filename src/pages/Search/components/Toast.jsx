export default function Toast({ open = false, message = "" }) {
  if (!open) return null;
  return (
    <div className="fixed left-1/2 top-14 -translate-x-1/2 z-50">
      <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-full shadow">
        {message}
      </div>
    </div>
  );
}