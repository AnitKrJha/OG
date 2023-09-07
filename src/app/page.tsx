import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h2>Og Image Generator for Anit's projects</h2>
        <code
          style={{
            background: "white",
            marginTop: "10px",
            display: "inline-block",
            padding: "10px",
          }}
        >
          go to "https://og.anit.dev/og?title=your title&type=your type"
        </code>
        <p>
          Made with love &nbsp;
          <br />
          <code className={styles.code}>by Anit Jha ♥️</code>
        </p>
      </div>
    </main>
  );
}
