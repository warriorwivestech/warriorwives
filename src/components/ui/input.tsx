import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, ...props }, ref) => {
    return startAdornment ? (
      <div
        className="flex items-center justify-center gap-2 pl-3 rounded-md border border-input bg-transparent ring-offset-background data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
        data-disabled={props.disabled}
      >
        {startAdornment && (
          <div className={cn("text-muted-foreground text-sm")}>
            {startAdornment}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md rounded-l-none border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    ) : (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
