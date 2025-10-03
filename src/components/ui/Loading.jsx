import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Loading = ({ type = "default" }) => {
  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-8 bg-slate-200 rounded w-32"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "budgets") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-slate-200 rounded-full w-24"></div>
              <div className="h-6 bg-slate-200 rounded w-28"></div>
              <div className="h-2 bg-slate-200 rounded-full w-full"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-3 bg-slate-200 rounded w-40"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (type === "chart") {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
          <div className="flex items-center justify-center h-80">
            <div className="h-64 w-64 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="inline-block">
          <div className="h-12 w-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;