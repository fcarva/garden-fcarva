import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { simplifySlug } from "../util/path"

const hiddenSlugs = new Set(["/", "index", "tags", "sobre", "agora", "projects", "subscribe"])

const shouldHideSlug = (slug: string) =>
  hiddenSlugs.has(slug) || slug.startsWith("tags/")

const SubscribeEmbed: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  if (!fileData.filePath) {
    return null
  }

  const slug = simplifySlug(fileData.slug!)
  if (shouldHideSlug(slug)) {
    return null
  }

  return (
    <section class={classNames(displayClass, "subscribe-embed")}>
      <p class="subscribe-kicker">Receive my updates</p>
      <p class="subscribe-copy">
        Follow me via email, <a href="/index.xml">RSS</a>, <a href="https://x.com/fcarva">Twitter</a>,
        and <a href="/sobre">other options</a>
      </p>
      <form
        class="subscribe-form"
        action="https://buttondown.com/api/emails/embed-subscribe/fcarva"
        method="post"
      >
        <label class="subscribe-visually-hidden" for="subscribe-email">
          Email address
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <input type="hidden" name="embed" value="1" />
        <button type="submit">Sign up</button>
      </form>
    </section>
  )
}

SubscribeEmbed.css = `
.subscribe-embed {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}

.subscribe-embed.subscribe-page {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.subscribe-embed .subscribe-kicker {
  margin: 0 0 1rem 0;
  color: var(--gray);
  font-size: 2rem;
  line-height: 1.2;
}

.subscribe-embed .subscribe-copy {
  margin: 0 0 1.8rem 0;
  color: var(--darkgray);
  line-height: 1.45;
}

.subscribe-embed .subscribe-form {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.subscribe-embed .subscribe-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.subscribe-embed input[type="email"] {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--darkgray);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--lightgray);
  border-radius: 0;
  padding: 0.55rem 0;
  font-size: 1.05rem;
  outline: none;
}

.subscribe-embed input[type="email"]::placeholder {
  color: var(--gray);
}

.subscribe-embed input[type="email"]:focus {
  border-bottom-color: var(--gray);
}

.subscribe-embed button {
  border: 1px solid var(--dark);
  border-radius: 0.3rem;
  background: var(--dark);
  color: var(--light);
  font-size: 1.05rem;
  line-height: 1;
  padding: 0.8rem 1.25rem;
  cursor: pointer;
}

.subscribe-embed button:hover {
  opacity: 0.9;
}

@media all and (max-width: 800px) {
  .subscribe-embed .subscribe-kicker {
    font-size: 1.55rem;
  }

  .subscribe-embed .subscribe-form {
    align-items: stretch;
    flex-direction: column;
    gap: 0.7rem;
  }

  .subscribe-embed button {
    width: fit-content;
  }
}
`

export default (() => SubscribeEmbed) satisfies QuartzComponentConstructor
