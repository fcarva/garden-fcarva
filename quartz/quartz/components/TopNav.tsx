import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/topNav.scss"
// @ts-ignore
import darkmodeScript from "./scripts/darkmode.inline"

interface NavLink {
  label: string
  href: string
}

interface Options {
  links: NavLink[]
}

const defaultOptions: Options = {
  links: [
    { label: "Sobre", href: "/sobre" },
    { label: "Agora", href: "/agora" },
  ],
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = {
    ...defaultOptions,
    ...userOpts,
  }

  const TopNav: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, cfg, displayClass } = props
    const title = cfg?.pageTitle ?? "Home"
    const baseDir = pathToRoot(fileData.slug!)
    const toHref = (href: string) => {
      if (href.startsWith("http://") || href.startsWith("https://")) {
        return href
      }
      const normalized = href.replace(/^\/+/, "")
      return normalized.length === 0 ? baseDir : `${baseDir}/${normalized}`
    }

    return (
      <nav class={classNames(displayClass, "top-nav")}>
        <a class="top-nav-title" href={baseDir}>
          {title}
        </a>
        <div class="top-nav-links">
          {opts.links.map((link) => (
            <a href={toHref(link.href)}>{link.label}</a>
          ))}
        </div>
        <div class="top-nav-toggle">
          <button
            class="darkmode top-theme-toggle"
            type="button"
            aria-label={i18n(cfg.locale).components.themeToggle.darkMode}
            title={i18n(cfg.locale).components.themeToggle.darkMode}
          >
            <span class="toggle-track"></span>
            <span class="toggle-thumb"></span>
          </button>
        </div>
      </nav>
    )
  }

  TopNav.css = style
  TopNav.beforeDOMLoaded = darkmodeScript

  return TopNav
}) satisfies QuartzComponentConstructor<Partial<Options>>
