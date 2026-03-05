import readingTime from "reading-time"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { byDateAndAlphabetical } from "./PageList"
import { formatDate, getDate } from "./Date"
import { FullSlug, joinSegments, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

const isWritingNote = (file: QuartzComponentProps["allFiles"][number]) => {
  const slug = file.slug ?? ""
  if (slug.endsWith("/index")) {
    return false
  }

  const tags = file.frontmatter?.tags ?? []
  return slug.startsWith("escrita/") || tags.includes("escrita")
}

const oneLine = (value?: string) => value?.replace(/\s+/g, " ").trim()
const topicLabel = (tag: string) => {
  const labels: Record<string, string> = {
    "bens-publicos": "bens públicos",
    "democracia-participatoria": "democracia participatória",
    "financiamento-quadratico": "financiamento quadrático",
  }

  return labels[tag] ?? tag.replace(/-/g, " ")
}

const HomeAutoIndex: QuartzComponent = ({ allFiles, fileData, cfg, displayClass }: QuartzComponentProps) => {
  if (fileData.slug !== "index") {
    return null
  }

  const writingNotes = allFiles.filter(isWritingNote).sort(byDateAndAlphabetical(cfg))
  if (writingNotes.length === 0) {
    return null
  }

  const latest = writingNotes[0]
  const latestDate = latest.dates ? getDate(cfg, latest) : undefined
  const latestReadingMinutes = Math.max(1, Math.ceil(readingTime(latest.text ?? "").minutes))
  const latestMeta = [
    latestDate ? formatDate(latestDate, cfg.locale) : undefined,
    `${latestReadingMinutes} min read`,
  ]
    .filter(Boolean)
    .join(" - ")
  const latestSummary = oneLine(
    latest.frontmatter?.description ?? latest.description ?? "Novo texto publicado no garden.",
  )

  const topicTags = [
    ...new Set(writingNotes.flatMap((page) => page.frontmatter?.tags ?? []).filter((tag) => tag.length > 0)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"))

  return (
    <section class={classNames(displayClass, "home-auto-index")}>
      <p class="home-muted">
        <a class="home-section-link" href={resolveRelative(fileData.slug, latest.slug!)}>
          Recentes
        </a>
      </p>

      <h2>
        <a href={resolveRelative(fileData.slug, latest.slug!)} class="internal">
          {latest.frontmatter?.title}
        </a>
      </h2>

      <p class="home-muted small">{latestMeta}</p>
      <p class="home-muted">{latestSummary}</p>

      <hr class="home-divider" />

      <p class="home-muted">
        <a class="home-section-link" href={resolveRelative(fileData.slug, "topics" as FullSlug)}>
          Tópicos
        </a>
      </p>
      <p class="home-topics-links">
        {topicTags.map((tag, index) => (
          <>
            <a href={resolveRelative(fileData.slug, joinSegments("topics", tag) as FullSlug)}>
              {topicLabel(tag)}
            </a>
            {index < topicTags.length - 1 ? <span>, </span> : null}
          </>
        ))}
      </p>

      <hr class="home-divider" />

      <p class="home-muted">
        <a class="home-section-link" href={resolveRelative(fileData.slug, "escrita" as FullSlug)}>
          Escrita
        </a>
      </p>

      <ul class="home-writing-list">
        {writingNotes.slice(0, 8).map((page) => {
          const pageDate = page.dates ? getDate(cfg, page) : undefined
          const pageTitle = page.frontmatter?.title ?? cfg.pageTitle
          return (
            <li>
              {pageDate ? <span class="writing-date">{formatDate(pageDate, cfg.locale)}</span> : null}
              <a href={resolveRelative(fileData.slug, page.slug!)}>{pageTitle}</a>
            </li>
          )
        })}
      </ul>

      <hr class="home-divider" />

      <p class="home-muted">
        <a class="home-section-link" href={resolveRelative(fileData.slug, "biblioteca" as FullSlug)}>
          Biblioteca
        </a>
      </p>
      <p class="home-muted">Minha base de livros em visualizacao de cards.</p>
    </section>
  )
}

HomeAutoIndex.css = `
.home-auto-index {
  margin-top: 0;
}
`

export default (() => HomeAutoIndex) satisfies QuartzComponentConstructor
