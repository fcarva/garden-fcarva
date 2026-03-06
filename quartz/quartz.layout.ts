import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.TopNav({
      links: [
        { label: "Sobre", href: "/sobre" },
        { label: "Agora", href: "/agora" },
      ],
    }),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => {
        const slug = page.fileData.slug ?? ""
        return slug.startsWith("escrita/") && !slug.endsWith("/index")
      },
    }),
    Component.YouMightEnjoy(),
    Component.SubscribeEmbed(),
  ],
  footer: Component.ConditionalRender({
    component: Component.Footer({
      links: {},
    }),
    condition: () => false,
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.HomeAutoIndex(),
      condition: (page) => page.fileData.slug === "index",
    }),
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
  beforeBody: [
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => {
        const slug = page.fileData.slug ?? ""
        return slug === "topics" || !slug.startsWith("topics/")
      },
    }),
  ],
  left: [],
  right: [],
}
