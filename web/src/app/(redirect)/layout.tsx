// Root layout for "/" only — it just forwards visitors to /en/ or /ar/.
export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F4F4F6" }}>{children}</body>
    </html>
  );
}
