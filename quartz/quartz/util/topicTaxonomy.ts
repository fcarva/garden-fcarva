export const TOPIC_LABELS: Record<string, string> = {
  "bens-publicos": "bens públicos",
  "democracia-participatoria": "democracia participatória",
  "financiamento-quadratico": "financiamento quadrático",
}

export const CURATED_TOPICS: string[] = [
  "economia",
  "bens-publicos",
  "democracia",
  "sistemas",
  "cultura",
  "clima",
]

export const STRUCTURAL_TAGS = new Set(["escrita"])

export const topicLabel = (tag: string): string => TOPIC_LABELS[tag] ?? tag.replace(/-/g, " ")

export const topicHeadingLabel = (tag: string): string => {
  const label = topicLabel(tag).trim()
  if (label.length === 0) {
    return label
  }

  return `${label[0].toUpperCase()}${label.slice(1)}`
}

export const isStructuralTag = (tag: string): boolean => STRUCTURAL_TAGS.has(tag)
