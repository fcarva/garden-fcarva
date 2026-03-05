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
      <h2>Subscribe</h2>
      <p>Receba novos ensaios e notas no email.</p>
      <iframe
        scrolling="no"
        src="https://buttondown.com/fcarva?as_embed=true"
        title="Subscribe to fcarva"
        loading="lazy"
      ></iframe>
    </section>
  )
}

SubscribeEmbed.css = `
.subscribe-embed {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}

.subscribe-embed h2 {
  margin: 0 0 0.4rem 0;
  font-size: 1rem;
}

.subscribe-embed p {
  margin: 0 0 1rem 0;
  color: var(--gray);
}

.subscribe-embed iframe {
  width: 100%;
  height: 220px;
  border: 1px solid var(--lightgray);
  border-radius: 0.4rem;
  background: var(--light);
}
`

export default (() => SubscribeEmbed) satisfies QuartzComponentConstructor
