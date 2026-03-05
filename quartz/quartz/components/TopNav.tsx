import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import DarkmodeConstructor from "./Darkmode"
import { concatenateResources } from "../util/resources"
import { classNames } from "../util/lang"
import style from "./styles/topNav.scss"

interface NavLink {
  label: string
  href: string
}

interface Options {
  links: NavLink[]
}

const defaultOptions: Options = {
  links: [
    { label: "Projects", href: "/projects" },
    { label: "Sobre", href: "/sobre" },
    { label: "Agora", href: "/agora" },
  ],
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = {
    ...defaultOptions,
    ...userOpts,
  }

  const Darkmode = DarkmodeConstructor()

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
          <Darkmode {...props} />
        </div>
      </nav>
    )
  }

  TopNav.css = concatenateResources(Darkmode.css, style)
  TopNav.beforeDOMLoaded = concatenateResources(Darkmode.beforeDOMLoaded)
  TopNav.afterDOMLoaded = concatenateResources(Darkmode.afterDOMLoaded)

  return TopNav
}) satisfies QuartzComponentConstructor<Partial<Options>>
