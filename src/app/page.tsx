import styles from './home.module.css'

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Free3Books</h1>
      <p className={styles.description}>
        Nobody believes in you, you've lost again and again and again, the lights are cut off. But you still looking at your dream reviewing it every day and say to yourself it's not over until i win.
      </p>
      <button className={styles.button}>Get Started</button>
      <div className={styles.footer}>
        © 2025 Free3Book@lib. All rights reserved.
      </div>
    </div>
  )
}