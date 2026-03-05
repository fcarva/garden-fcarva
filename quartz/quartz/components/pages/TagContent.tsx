import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, joinSegments, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"

interface TagContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: TagContentOptions = {
  numPages: 10,
}

const topicLabel = (tag: string) => {
  const labels: Record<string, string> = {
    "bens-publicos": "bens públicos",
    "democracia-participatoria": "democracia participatória",
    "financiamento-quadratico": "financiamento quadrático",
  }

  return labels[tag] ?? tag.replace(/-/g, " ")
}

export default ((opts?: Partial<TagContentOptions>) => {
  const options: TagContentOptions = { ...defaultOptions, ...opts }

  const TagContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles } = props
    const slug = fileData.slug

    const isTagPage = slug?.startsWith("tags/") || slug === "tags"
    const isTopicPage = slug?.startsWith("topics/") || slug === "topics"
    if (!(isTagPage || isTopicPage)) {
      throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
    }

    const basePath = isTopicPage ? "topics" : "tags"
    const tag = simplifySlug(
      (slug === basePath ? "index" : slug.slice(`${basePath}/`.length)) as FullSlug,
    )
    const allPagesWithTag = (tag: string) =>
      allFiles.filter((file) =>
        (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
      )

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    if (tag === "/") {
      const tags = [
        ...new Set(
          allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
        ),
      ].sort((a, b) => a.localeCompare(b))
      return (
        <div class="popover-hint">
          <article class={classes}>{content}</article>
          <p class="topics-inline">
            {tags.map((tag, index) => {
              const href = resolveRelative(fileData.slug!, joinSegments("topics", tag) as FullSlug)
              return (
                <>
                  <a class="internal topic-link" href={href}>
                    {topicLabel(tag)}
                  </a>
                  {index < tags.length - 1 ? <span>, </span> : null}
                </>
              )
            })}
          </p>
        </div>
      )
    } else {
      const pages = allPagesWithTag(tag)
      const listProps = {
        ...props,
        allFiles: pages,
      }

      return (
        <div class="popover-hint">
          <article class={classes}>{content}</article>
          <div class="page-listing">
            <div>
              <PageList limit={options.numPages} {...listProps} sort={options?.sort} />
            </div>
          </div>
        </div>
      )
    }
  }

  TagContent.css = concatenateResources(style, PageList.css)
  return TagContent
}) satisfies QuartzComponentConstructor
