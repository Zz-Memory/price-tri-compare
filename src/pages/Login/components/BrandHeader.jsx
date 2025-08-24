export default function BrandHeader({ brandColor }) {
  return (
    <>
      <div
        className="text-4xl font-extrabold"
        style={{ color: brandColor, letterSpacing: '2px' }}
      >
        货三家
      </div>
      <div className="text-sm text-gray-500 mt-1">买到 “全网真低价”</div>
    </>
  );
}