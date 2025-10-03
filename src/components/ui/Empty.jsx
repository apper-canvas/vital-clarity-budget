import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No Data Yet", 
  message = "Get started by adding your first item",
  icon = "Inbox",
  actionLabel,
  onAction 
}) => {
  return (
    <Card className="p-12">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
          <ApperIcon name={icon} size={48} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} size="lg" className="gap-2">
            <ApperIcon name="Plus" size={18} />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;