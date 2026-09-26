import { Playground } from "./playground";
import { LIMITS } from "@/lib/params";
import { LOGO_PATHS, SIGNATURE_PATHS } from "@/lib/marks";

const PARAMS: Array<[string, string]> = [
  ["title", `Headline. Defaults to "Anit Jha", up to ${LIMITS.title} characters. Size adapts to length.`],
  ["type", "Small label in the top right, such as Blog, Project or Writing."],
  ["description", `Supporting line under the title, up to ${LIMITS.description} characters.`],
  ["meta", "Footer detail, such as a date and reading time or a stack."],
  ["image", "Absolute https URL of a PNG, JPEG or GIF on anit.dev, shown as a framed thumbnail."],
  ["variant", "default or profile. Profile shows the portrait, with description as the role line."],
  ["theme", "dark (default) or light."],
];

function Logo() {
  return (
    <svg viewBox="0 0 46 32" width="30" height="21" aria-hidden="true">
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" stroke="currentColor" strokeWidth={0.4848} />
      ))}
    </svg>
  );
}

function Signature() {
  return (
    <svg viewBox="0 14 45 17" width="84" height="32" aria-label="Anit Jha" role="img">
      {SIGNATURE_PATHS.slice(0, 2).map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <div className="aurora" aria-hidden="true" />
      <div className="shell">
        <header className="site-header">
          <a className="brand" href="https://anit.dev">
            <Logo />
            <span>anit.dev</span>
          </a>
          <span className="brand-sub">og</span>
        </header>

        <section className="hero">
          <h1>Open Graph images, rendered from a URL.</h1>
          <p>
            Every card on anit.dev comes from <code>/og</code>. Fill in the fields, watch the
            preview, and copy the link into a page&apos;s meta tags.
          </p>
        </section>

        <Playground />

        <section className="reference" aria-labelledby="params-title">
          <h2 id="params-title">Parameters</h2>
          <dl className="param-list">
            {PARAMS.map(([name, text]) => (
              <div key={name} className="param-row">
                <dt>
                  <code>{name}</code>
                </dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <p className="note">
            Images are cached for a year, so change a parameter to bust the cache. Unknown or
            disallowed image hosts are ignored and the card renders without a thumbnail.
          </p>
        </section>

        <footer className="site-footer">
          <span>Made by Anit Jha</span>
          <Signature />
        </footer>
      </div>
    </>
  );
}
