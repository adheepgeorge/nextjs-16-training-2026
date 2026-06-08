export const metadata = {
  title: "Settings",
};

export default function LayoutDemoSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-4 text-zinc-600 leading-7">
        This page is{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          layout-demo/settings/page.tsx
        </code>
        . It inherits the parent layout automatically — no import needed.
      </p>
    </div>
  );
}
