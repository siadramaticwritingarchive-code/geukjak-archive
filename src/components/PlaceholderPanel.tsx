type PlaceholderPanelProps = {
  title: string;
  children: React.ReactNode;
};

export function PlaceholderPanel({ title, children }: PlaceholderPanelProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white/45 p-5 shadow-sm shadow-ink/5">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-6 text-charcoal/80">{children}</div>
    </section>
  );
}
