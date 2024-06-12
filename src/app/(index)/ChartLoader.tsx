const ChartLoader = () => (
  <div className="mx-auto w-full rounded-2xl bg-sand-1 p-4 shadow-custom-lg ring-1 ring-black/[0.03] sm:p-6 md:max-w-lg lg:max-w-none">
    <div className="animate-pulse">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 rounded-full bg-sand-4 sm:h-16 sm:w-16" />
        <div>
          <div className="h-7 w-32 rounded-lg bg-sand-4" />
          <div className="mt-1.5 h-6 w-12 rounded-lg bg-sand-4" />
        </div>
      </div>
      <div className="mt-6 h-24 w-full rounded-lg bg-sand-4" />
    </div>
  </div>
);

export default ChartLoader;
