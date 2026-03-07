const SkeletonBox = ({ className }: { className: string }) => (
  <div
    className={`rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:400%_100%] animate-shimmer ${className}`}
  />
);

const ListadoPDISkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm overflow-hidden"
        >
          <SkeletonBox className="h-44 w-full rounded-none" />

          <div className="flex flex-col p-4 gap-3">
            <SkeletonBox className="h-5 w-3/4" />
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-5/6" />
            <SkeletonBox className="h-8 w-2/5 rounded-full mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListadoPDISkeleton;
