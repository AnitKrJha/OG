import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h2>Og Image Generator for Anit's projects</h2>
        <p>
          Made with love &nbsp;
          <br />
          <code className={styles.code}>by Anit Jha ♥️</code>
        </p>
      </div>
    </main>
  );
}
