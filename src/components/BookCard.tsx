import Image from 'next/image'
import Link from 'next/link'
import styles from './bookCard.module.css'

interface BookCardProps {
  title: string
  description: string
  coverImage: string
  pdfFile: string
  onClick?: () => void
}

export default function BookCard({ title, description, coverImage, pdfFile, onClick }: BookCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <Image src={coverImage} alt={title} width={280} height={280} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link href={`/data/${pdfFile}`} passHref>
          <button className={styles.readButton}>Read Ebook</button>
        </Link>
      </div>
    </div>
  )
}