export const metadata = {
  title: "Layout demo",
};

export default function LayoutDemoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-4 leading-7 text-ink-2">
        Nested layouts wrap child pages. Switch to the Settings tab — the header
        and tab strip above persist because the layout does not re-render on
        client-side navigation; only this content swaps.
      </p>
    </div>
  );
}
