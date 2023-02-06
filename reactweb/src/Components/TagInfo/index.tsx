import React from "react"
import styles from "./TagInfo.module.css"
const TagInfo = (props: { title: string; number: number }) => (
	<div id={styles.info__div}>
		<span id={styles.info__div__number}>{props.number}</span>
		<span id={styles.info__div__tag}>{props.title}</span>
	</div>
)

export default TagInfo
