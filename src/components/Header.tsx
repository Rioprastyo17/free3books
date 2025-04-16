import Link from 'next/link'
import Image from 'next/image' // Import komponen Image dari Next.js
import styles from './header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/book.jpeg" alt="E-Book Logo" width={70} height={40} /> {/* Ganti teks dengan logo */}
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <Link href="/">HOME</Link>
          </li>
          <li>
            <Link href="/ebook">EBOOK</Link>
          </li>
          <li>
            <Link href="/ai-agents">AI AGENTS</Link>
          </li>
          <li>
            <Link href="/contact-us">CONTACT US</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}