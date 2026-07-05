export function PageHeader({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <header className="mb-8">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-coral">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold tracking-normal text-ink sm:text-4xl">{title}</h1>
    </header>
  );
}
