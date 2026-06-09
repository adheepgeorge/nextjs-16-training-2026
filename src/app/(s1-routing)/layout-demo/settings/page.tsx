export const metadata = {
  title: "Settings",
};

export default function LayoutDemoSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-4 leading-7 text-ink-2">
        This page is{" "}
        <code className="icode">layout-demo/settings/page.tsx</code>. It
        inherits the parent layout automatically — no import needed.
      </p>
    </div>
  );
}
