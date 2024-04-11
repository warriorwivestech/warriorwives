interface TypographyProps {
  className?: string;
  children: React.ReactNode;
}

export function TypographyMuted({ className, children }: TypographyProps) {
  const extraClasses = className ? ` ${className}` : "";

  return (
    <p className={`text-sm text-muted-foreground ${extraClasses}`}>
      {children}
    </p>
  );
}
