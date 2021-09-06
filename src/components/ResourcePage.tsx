import * as React from "react"
import Footer from "./Footer"
import { useStateMachine } from "little-state-machine"
import nav from "../data/nav"
import generic from "../data/generic"
import * as typographyStyles from "../styles/typography.module.css"
import * as containerStyle from "../styles/container.module.css"
import * as styles from "./ResourcePage.module.css"
import { useForm } from "react-hook-form"
import resources from "./Resources.json"

export default function ResourcePage({ defaultLang }: { defaultLang: string }) {
  const { register, watch } = useForm({ mode: "onChange" })
  const {
    state: { language },
  } = useStateMachine()
  const { currentLanguage } =
    language && language.currentLanguage
      ? language
      : { currentLanguage: defaultLang }

  const resourcesByType = resources.reduce(
    (acc, cur) => {
      const { type, title, author, description, version } = cur
      // case insensitive filter
      if (
        `${title} ${author} ${description} v${version}`.match(
          new RegExp(watch("filterResources"), "i")
        )
      ) {
        acc[type].push(cur)
      }
      return acc
    },
    { article: [], video: [], newsletter: [] }
  )

  return (
    <div className={containerStyle.container}>
      <main className={styles.root}>
        <h1 className={typographyStyles.headingWithTopMargin} id="main">
          {nav[currentLanguage].resources}
        </h1>
        <p className={typographyStyles.subHeading}>
          {generic.blog[currentLanguage]}, {generic.video[currentLanguage]} &{" "}
          {generic.newsletter[currentLanguage]}
        </p>
        <input
          name="filterResources"
          ref={register}
          placeholder="Search resources..."
          className={styles.searchFilter}
        />
        <h2 className={typographyStyles.title}>
          {generic.blog[currentLanguage]}
        </h2>
        <ul className={styles.contentList}>
          {resourcesByType.article.map(
            ({ url, title, author, authorUrl, version }) => (
              <li key={url + title}>
                <div className={styles.tagWrapper}>
                  <p className={styles.tag}>v{version || "6"}</p>
                </div>
                <article className={styles.article}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <h3>{title}</h3>
                  </a>

                  <p className={styles.author}>
                    <a
                      href={authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {author}
                    </a>
                  </p>
                </article>
              </li>
            )
          )}
        </ul>
        <h2 className={typographyStyles.title}>
          {generic.video[currentLanguage]}
        </h2>
        <ul className={styles.contentList}>
          {resourcesByType.video.map(
            ({ title, url, authorUrl, author, description, version }) => (
              <li key={url + title}>
                <div className={styles.tagWrapper}>
                  <p className={styles.tag}>v{version || "6"}</p>
                </div>
                <article className={styles.article}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <h3>{title}</h3>
                  </a>
                  <p className={styles.author}>
                    <a href={authorUrl} target="_blank" rel="noreferrer">
                      {author}
                    </a>
                  </p>
                  {typeof description === "string" ? (
                    <p>{description}</p>
                  ) : (
                    description
                  )}
                </article>
              </li>
            )
          )}
        </ul>
        <h2 className={typographyStyles.title}>
          {generic.newsletter[currentLanguage]}
        </h2>
        <ul className={styles.contentList}>
          {resourcesByType.newsletter.map(({ title, url, description }) => (
            <article className={styles.article} key={url + title}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <h3>{title}</h3>
                <p>{description}</p>
              </a>
            </article>
          ))}
        </ul>
        <Footer currentLanguage={currentLanguage} />
      </main>
    </div>
  )
}
