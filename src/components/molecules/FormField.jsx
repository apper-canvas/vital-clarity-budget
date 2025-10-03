import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ label, error, required, className, children, ...props }) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label required={required}>{label}</Label>}
      {children || <Input error={error} {...props} />}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;