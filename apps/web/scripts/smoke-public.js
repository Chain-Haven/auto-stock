/**
 * Smoke test against public URL. Run: BASE_URL=https://your-app.vercel.app node scripts/smoke-public.js
 */
const base = process.env.BASE_URL || "http://localhost:3000";

async function smoke() {
  const res = await fetch(base);
  if (!res.ok) throw new Error(`GET ${base} returned ${res.status}`);
  const text = await res.text();
  if (!text.includes("Auto-Stock")) throw new Error("Home page should contain Auto-Stock");
  console.log("Smoke OK:", base);
}

smoke().catch((e) => {
  console.error(e);
  process.exit(1);
});
