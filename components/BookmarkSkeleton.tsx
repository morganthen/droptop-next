export default function BookmarkSkeleton() {
  return (
    <div className="bg-screen border border-phosphor/10 overflow-hidden animate-pulse">
      <div className="h-32 bg-phosphor/5" />
      <div className="p-3 space-y-3">
        <div className="h-3 bg-phosphor/10 w-3/4" />
        <div className="h-2 bg-phosphor/5 w-full" />
        <div className="h-2 bg-phosphor/5 w-2/3" />
        <div className="flex justify-between pt-2 border-t border-phosphor/10">
          <div className="h-2 bg-phosphor/10 w-12" />
          <div className="h-2 bg-phosphor/10 w-12" />
        </div>
      </div>
    </div>
  );
}
