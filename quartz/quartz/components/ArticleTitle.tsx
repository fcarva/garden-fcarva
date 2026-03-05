import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass, cfg }: QuartzComponentProps) => {
  const rawTitle = fileData.frontmatter?.title
  const tagPrefix = `${i18n(cfg.locale).pages.tagContent.tag}: `
  const folderPrefix = `${i18n(cfg.locale).pages.folderContent.folder}: `

  let title = rawTitle
  const isTagLikePage = fileData.slug?.startsWith("tags/") || fileData.slug?.startsWith("topics/")
  if (isTagLikePage && rawTitle?.startsWith(tagPrefix)) {
    title = rawTitle.slice(tagPrefix.length)
  } else if (fileData.slug?.endsWith("/index") && rawTitle?.startsWith(folderPrefix)) {
    title = rawTitle.slice(folderPrefix.length)
  }

  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
