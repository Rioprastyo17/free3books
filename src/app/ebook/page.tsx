'use client'

import { useState } from 'react'
import BookCard from '@/components/BookCard'
import { books } from '@/constants/mockData'
import styles from './ebook.module.css'

export default function EbookPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter buku berdasarkan nama
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Collection of eBooks</h1>

      {/* Input pencarian */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Daftar buku */}
      <div className={styles.grouper}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, i) => (
            <BookCard
              key={i}
              title={book.title}
              description={book.description}
              coverImage={`/thumbnail/${book.coverImage}`}
              pdfFile={`${book.pdfFile}`}
            />
          ))
        ) : (
          <p className={styles.noResults}>No books found.</p>
        )}
      </div>
    </div>
  )
}