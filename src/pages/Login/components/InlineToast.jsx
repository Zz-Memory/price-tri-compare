export default function InlineToast({ visible, message, type }) {
  if (!visible) return null;
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 bottom-20 px-4 py-2 text-white text-sm rounded-lg shadow
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}