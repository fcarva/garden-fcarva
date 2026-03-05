import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { byDateAndAlphabetical } from "./PageList"
import { formatDate, getDate } from "./Date"
import { resolveRelative, simplifySlug } from "../util/path"
import { classNames } from "../util/lang"
import style from "./styles/youMightEnjoy.scss"

interface Options {
  limit: number
  title: string
}

const defaultOptions: Options = {
  limit: 4,
  title: "You might also enjoy",
}

const hiddenSlugs = new Set(["/", "index", "tags", "topics", "sobre", "agora", "projects", "subscribe"])

const shouldHideSlug = (slug: string) =>
  hiddenSlugs.has(slug) || slug.startsWith("tags/") || slug.startsWith("topics/")

export default ((opts?: Partial<Options>) => {
  const options: Options = { ...defaultOptions, ...opts }

  const YouMightEnjoy: QuartzComponent = ({ cfg, fileData, allFiles, displayClass }) => {
    const currentSlug = simplifySlug(fileData.slug!)
    if (shouldHideSlug(currentSlug)) {
      return null
    }

    const candidates = allFiles.filter((file) => {
      const slug = file.slug ? simplifySlug(file.slug) : ""
      return slug.length > 0 && slug !== currentSlug && !shouldHideSlug(slug)
    })

    const backlinks = candidates.filter((file) => file.links?.includes(currentSlug))
    const currentTags = new Set(fileData.frontmatter?.tags ?? [])
    const tagRelated =
      currentTags.size > 0
        ? candidates.filter((file) => (file.frontmatter?.tags ?? []).some((tag) => currentTags.has(tag)))
        : []

    const combined = [...backlinks]
    for (const file of tagRelated) {
      if (!combined.some((related) => related.slug === file.slug)) {
        combined.push(file)
      }
    }

    const related = combined.sort(byDateAndAlphabetical(cfg)).slice(0, options.limit)
    if (related.length === 0) {
      return null
    }

    return (
      <section class={classNames(displayClass, "you-might-enjoy")}>
        <h2>{options.title}</h2>
        <ul>
          {related.map((page) => (
            <li>
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                {page.dates ? <span class="meta">{formatDate(getDate(cfg, page)!, cfg.locale)}</span> : null}
                <span class="title">{page.frontmatter?.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  YouMightEnjoy.css = style
  return YouMightEnjoy
}) satisfies QuartzComponentConstructor<Partial<Options>>
