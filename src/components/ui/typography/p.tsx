export function TypographyP({ children }: { children: React.ReactNode }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-2">{children}</p>;
}
