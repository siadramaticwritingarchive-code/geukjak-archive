type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="mb-8 border-b border-ink/10 pb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/80">
        {description}
      </p>
    </section>
  );
}
