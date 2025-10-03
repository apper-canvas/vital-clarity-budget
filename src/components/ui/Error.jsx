import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="p-12">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex p-4 bg-error/10 rounded-full mb-4">
          <ApperIcon name="AlertCircle" size={48} className="text-error" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Error Loading Data</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;