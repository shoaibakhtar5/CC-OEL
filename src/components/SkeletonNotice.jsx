export default function SkeletonNotice() {
  return (
    <div className="notice-card">
      <div className="skeleton h-5 w-28 rounded-full" />
      <div className="mt-4 skeleton h-7 w-3/4 rounded-xl" />
      <div className="mt-3 skeleton h-4 w-1/2 rounded-xl" />
      <div className="mt-6 space-y-2">
        <div className="skeleton h-4 w-full rounded-xl" />
        <div className="skeleton h-4 w-11/12 rounded-xl" />
        <div className="skeleton h-4 w-2/3 rounded-xl" />
      </div>
    </div>
  );
}
