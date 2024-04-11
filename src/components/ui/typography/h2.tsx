export function TypographyH2({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const extraClasses = className ? className : "";

  return (
    <h2
      className={`scroll-m-20 text-3xl font-bold tracking-tight ${extraClasses}`}
    >
      {children}
    </h2>
  );
}
