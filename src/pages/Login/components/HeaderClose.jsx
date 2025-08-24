export default function HeaderClose({ onBack }) {
  return (
    <div className="h-12 flex items-center px-4">
      <button
        className="text-2xl leading-none text-gray-600"
        aria-label="close"
        onClick={onBack}
      >
        ×
      </button>
    </div>
  );
}