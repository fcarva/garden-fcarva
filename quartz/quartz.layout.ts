import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.TopNav({
      links: [
        { label: "Projects", href: "/projects" },
        { label: "Sobre", href: "/sobre" },
        { label: "Agora", href: "/agora" },
      ],
    }),
  ],
  afterBody: [Component.YouMightEnjoy()],
  footer: Component.Footer({
    links: {
      RSS: "/index.xml",
      GitHub: "https://github.com/fcarva",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta({
        showComma: false,
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
  left: [],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [],
  right: [],
}
