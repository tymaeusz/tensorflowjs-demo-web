import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>App Demo</title>
        <meta name="description" content="app-demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ justifyContent: "center" }}>
        <h1 className={styles.title}>
          Bem-vindo à <Link href='/'>demo!</Link>
        </h1>

        <div className={styles.grid}>
          <Link href="/hand-pose-detection" className={styles.card}>
            <h2>Detecção de Mão &rarr;</h2>
            <p>Detector de movimento (mão) 👋</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
