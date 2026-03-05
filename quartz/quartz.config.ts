import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { stephangoInspiredOg } from "./quartz/util/customOg"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "fcarva",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "plausible",
    },
    locale: "pt-BR",
    baseUrl: "fcarva.vercel.app",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          // Flexoki light (close to stephango.com / minimal.guide)
          light: "#FFFCF0",
          lightgray: "#E6E4D9",
          gray: "#6F6E69",
          darkgray: "#100F0F",
          dark: "#100F0F",
          secondary: "#24837B",
          tertiary: "#2F968D",
          highlight: "#F6E2A0",
          textHighlight: "#FAEEC688",
        },
        darkMode: {
          // Flexoki dark (close to stephango.com / minimal.guide)
          light: "#100F0F",
          lightgray: "#282726",
          gray: "#878580",
          darkgray: "#CECDC3",
          dark: "#FFFCF0",
          secondary: "#3AA99F",
          tertiary: "#2F968D",
          highlight: "#3A2D04",
          textHighlight: "#1E5F5B4D",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "solarized-light",
          dark: "solarized-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages({
        colorScheme: "darkMode",
        imageStructure: stephangoInspiredOg,
      }),
    ],
  },
}

export default config
