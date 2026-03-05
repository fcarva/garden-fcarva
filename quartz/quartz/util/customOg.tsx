import readingTime from "reading-time"
import { formatDate, getDate } from "../components/Date"
import { i18n } from "../i18n"
import { SocialImageOptions } from "./og"
import { getFontSpecificationName } from "./theme"

export const stephangoInspiredOg: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  description,
  fileData,
  iconBase64,
}) => {
  const colors = cfg.theme.colors[userOpts.colorScheme]
  const bodyFont = getFontSpecificationName(cfg.theme.typography.body)
  const headerFont = getFontSpecificationName(cfg.theme.typography.header)

  const rawDate = getDate(cfg, fileData)
  const date = rawDate ? formatDate(rawDate, cfg.locale) : ""
  const { minutes } = readingTime(fileData.text ?? "")
  const readingTimeText = i18n(cfg.locale).components.contentMeta.readingTime({
    minutes: Math.ceil(minutes),
  })
  const meta = [date, readingTimeText].filter(Boolean).join(" - ")

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0f1012 0%, #15171a 100%)",
        padding: "52px",
        boxSizing: "border-box",
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: iconBase64 ? "70%" : "100%",
          paddingRight: iconBase64 ? "28px" : "0px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#b3ada1",
            fontSize: "30px",
          }}
        >
          {iconBase64 ? (
            <img
              src={iconBase64}
              width={52}
              height={52}
              style={{ borderRadius: "999px", border: "1px solid #2a2c30" }}
            />
          ) : null}
          <span>{cfg.pageTitle}</span>
        </div>

        <h1
          style={{
            margin: "28px 0 0 0",
            color: "#f2efdf",
            fontFamily: headerFont,
            fontSize: "72px",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: "20px 0 0 0",
            color: "#a7a095",
            fontSize: "27px",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        <p
          style={{
            margin: "auto 0 0 0",
            color: colors.secondary,
            fontSize: "25px",
          }}
        >
          {meta}
        </p>
      </div>

      {iconBase64 ? (
        <div
          style={{
            display: "flex",
            width: "30%",
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #2a2c30",
            backgroundColor: "#111214",
          }}
        >
          <img
            src={iconBase64}
            width={340}
            height={526}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.05) saturate(0.95)",
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

