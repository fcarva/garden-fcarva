import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import fs from "fs"
import path from "path"
import yaml from "js-yaml"

import style from "../styles/listPage.scss"
import { PageList, SortFn, byDateAndAlphabeticalFolderFirst } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
import { resolveRelative } from "../../util/path"

interface FolderContentOptions {
  /**
   * Whether to display number of folders
   */
  showFolderCount: boolean
  showSubfolders: boolean
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
}

interface BaseViewConfig {
  type?: string
  name?: string
  image?: string
  imageAspectRatio?: number
}

interface BaseConfig {
  filters?: {
    and?: unknown[]
  }
  views?: BaseViewConfig[]
}

const baseConfigCache = new Map<string, BaseConfig | null>()

const folderFromSlug = (slug: string): string => {
  const lastSlash = slug.lastIndexOf("/")
  return lastSlash === -1 ? "" : slug.slice(0, lastSlash)
}

const fileNameFromSlug = (slug: string): string => {
  const lastSlash = slug.lastIndexOf("/")
  return lastSlash === -1 ? slug : slug.slice(lastSlash + 1)
}

const normalizeFolderSlug = (slug: string): string =>
  slug.endsWith("/index") ? slug.slice(0, -"/index".length) : slug

const readBaseConfig = (folderSlug: string): BaseConfig | null => {
  const cached = baseConfigCache.get(folderSlug)
  if (cached !== undefined) {
    return cached
  }

  const folderName = folderSlug.split("/").at(-1) ?? folderSlug
  const folderNameCapitalized =
    folderName.length > 0 ? `${folderName.charAt(0).toUpperCase()}${folderName.slice(1)}` : folderName
  const candidates = [
    path.join(process.cwd(), "content", `${folderSlug}.base`),
    path.join(process.cwd(), "content", `${folderNameCapitalized}.base`),
    path.join(process.cwd(), `${folderName}.base`),
    path.join(process.cwd(), `${folderNameCapitalized}.base`),
    path.join(process.cwd(), "..", `${folderName}.base`),
    path.join(process.cwd(), "..", `${folderNameCapitalized}.base`),
  ]
  const basePath = candidates.find((candidate, idx) => candidates.indexOf(candidate) === idx && fs.existsSync(candidate))

  if (!basePath) {
    baseConfigCache.set(folderSlug, null)
    return null
  }

  try {
    const raw = fs.readFileSync(basePath, "utf8")
    const parsed = yaml.load(raw)
    const config = parsed && typeof parsed === "object" ? (parsed as BaseConfig) : null
    baseConfigCache.set(folderSlug, config)
    return config
  } catch {
    baseConfigCache.set(folderSlug, null)
    return null
  }
}

const getFrontmatterValue = (page: QuartzPluginData, pathKey: string): unknown => {
  const segments = pathKey.split(".")
  let current: unknown = page.frontmatter

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

const evaluateFilterExpression = (page: QuartzPluginData, expression: string): boolean => {
  const match = expression.match(/^\s*(file|note)\.([A-Za-z0-9_.-]+)\s*(==|!=)\s*["']([^"']+)["']\s*$/)
  if (!match) {
    return true
  }

  const [, scope, field, operator, rightSide] = match
  const pageSlug = page.slug ?? ""

  let leftValue = ""
  if (scope === "file") {
    switch (field) {
      case "folder":
        leftValue = folderFromSlug(pageSlug)
        break
      case "name":
        leftValue = fileNameFromSlug(pageSlug)
        break
      case "path":
        leftValue = pageSlug
        break
      default:
        return true
    }
  } else {
    const fmValue = getFrontmatterValue(page, field)
    leftValue = fmValue === undefined || fmValue === null ? "" : String(fmValue)
  }

  const normalize = (value: string) => value.trim().toLowerCase()
  const leftNormalized = normalize(leftValue)
  const rightNormalized = normalize(rightSide)

  return operator === "==" ? leftNormalized === rightNormalized : leftNormalized !== rightNormalized
}

const applyBaseFilters = (pages: QuartzPluginData[], baseConfig: BaseConfig | null): QuartzPluginData[] => {
  const andFilters = baseConfig?.filters?.and ?? []
  const expressions = andFilters.filter((entry): entry is string => typeof entry === "string")
  if (expressions.length === 0) {
    return pages
  }

  return pages.filter((page) => expressions.every((expr) => evaluateFilterExpression(page, expr)))
}

const cardImageUrl = (page: QuartzPluginData, imageField?: string): string | undefined => {
  const fallback = page.frontmatter?.coverUrl
  if (!imageField) {
    return typeof fallback === "string" ? fallback : undefined
  }

  const normalizedField = imageField.startsWith("note.") ? imageField.slice("note.".length) : imageField
  const value = getFrontmatterValue(page, normalizedField)
  if (typeof value === "string" && value.length > 0) {
    return value
  }

  return typeof fallback === "string" ? fallback : undefined
}

const baseCardsStyle = `
.base-cards-view {
  margin-top: 1rem;
}

.base-cards-header {
  margin: 0 0 1rem 0;
  color: var(--gray);
  font-size: 0.92rem;
}

.base-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.base-card {
  text-decoration: none;
  color: inherit;
}

.base-card-cover {
  border: 1px solid var(--lightgray);
  border-radius: 0.38rem;
  overflow: hidden;
  background: var(--light);
  aspect-ratio: var(--cards-aspect-ratio, 1.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-card-cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.base-card-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--lightgray), color-mix(in srgb, var(--lightgray) 65%, var(--gray)));
}

.base-card-body {
  margin-top: 0.5rem;
}

.base-card-title {
  margin: 0;
  color: var(--darkgray);
  font-size: 0.9rem;
  line-height: 1.35;
}

.base-card-meta {
  margin: 0.2rem 0 0;
  color: var(--gray);
  font-size: 0.8rem;
  line-height: 1.35;
}

.base-card:hover .base-card-title {
  color: var(--secondary);
}
`

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) {
      return null
    }

    const allPagesInFolder: QuartzPluginData[] =
      folder.children
        .map((node) => {
          // regular file, proceed
          if (node.data) {
            return node.data
          }

          if (node.isFolder && options.showSubfolders) {
            // folders that dont have data need synthetic files
            const getMostRecentDates = (): QuartzPluginData["dates"] => {
              let maybeDates: QuartzPluginData["dates"] | undefined = undefined
              for (const child of node.children) {
                if (child.data?.dates) {
                  // compare all dates and assign to maybeDates if its more recent or its not set
                  if (!maybeDates) {
                    maybeDates = { ...child.data.dates }
                  } else {
                    if (child.data.dates.created > maybeDates.created) {
                      maybeDates.created = child.data.dates.created
                    }

                    if (child.data.dates.modified > maybeDates.modified) {
                      maybeDates.modified = child.data.dates.modified
                    }

                    if (child.data.dates.published > maybeDates.published) {
                      maybeDates.published = child.data.dates.published
                    }
                  }
                }
              }
              return (
                maybeDates ?? {
                  created: new Date(),
                  modified: new Date(),
                  published: new Date(),
                }
              )
            }

            return {
              slug: node.slug,
              dates: getMostRecentDates(),
              frontmatter: {
                title: node.displayName,
                tags: [],
              },
            }
          }
        })
        .filter((page) => page !== undefined) ?? []
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    const folderSlug = normalizeFolderSlug(fileData.slug ?? "")
    const baseConfig = folderSlug ? readBaseConfig(folderSlug) : null
    const cardsView = baseConfig?.views?.find((view) => view.type === "cards")
    const filteredPages = applyBaseFilters(allPagesInFolder, baseConfig)
    const displayPages = [...filteredPages].sort(options.sort ?? byDateAndAlphabeticalFolderFirst(cfg))
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: displayPages,
    }

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    if (cardsView) {
      const imageAspectRatio =
        typeof cardsView.imageAspectRatio === "number" && cardsView.imageAspectRatio > 0
          ? cardsView.imageAspectRatio
          : 1.5

      return (
        <div class="popover-hint">
          <article class={classes}>{content}</article>
          <section class="base-cards-view" style={{ "--cards-aspect-ratio": String(imageAspectRatio) }}>
            <p class="base-cards-header">
              {cardsView.name ?? "Cards"} ·{" "}
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: displayPages.length,
              })}
            </p>
            <div class="base-cards-grid">
              {displayPages.map((page) => {
                const title = page.frontmatter?.title ?? page.slug ?? "Untitled"
                const subtitle = page.frontmatter?.subtitle
                const author = page.frontmatter?.author ?? page.frontmatter?.authors
                const imageUrl = cardImageUrl(page, cardsView.image)

                return (
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="base-card internal">
                    <div class="base-card-cover">
                      {imageUrl ? (
                        <img src={imageUrl} alt={title} loading="lazy" decoding="async" />
                      ) : (
                        <div class="base-card-placeholder" />
                      )}
                    </div>
                    <div class="base-card-body">
                      <p class="base-card-title">{title}</p>
                      {typeof author === "string" && author.length > 0 ? (
                        <p class="base-card-meta">{author}</p>
                      ) : typeof subtitle === "string" && subtitle.length > 0 ? (
                        <p class="base-card-meta">{subtitle}</p>
                      ) : null}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        </div>
      )
    }

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        <div class="page-listing">
          {options.showFolderCount && (
            <p>
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: displayPages.length,
              })}
            </p>
          )}
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  FolderContent.css = concatenateResources(style, PageList.css, baseCardsStyle)
  return FolderContent
}) satisfies QuartzComponentConstructor
