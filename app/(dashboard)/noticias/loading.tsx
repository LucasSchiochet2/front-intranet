export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
            <div className="p-5 flex flex-col flex-1">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2 mb-4 flex-1">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mt-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
