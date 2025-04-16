'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf' // Import jsPDF
import styles from './aiAgents.module.css'

export default function AIAgentPage() {
  const [messages, setMessages] = useState([]) // Hanya menyimpan satu pesan pengguna dan satu respons bot
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState([]) // Menyimpan riwayat chat di sidebar

  const handleSend = async () => {
    if (input.trim() === '') return

    // Tambahkan pesan pengguna ke area chat
    const userMessage = { sender: 'user', text: input }
    setMessages([userMessage]) // Hanya menyimpan pesan pengguna terbaru

    try {
      // Kirim pesan ke backend Flask
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }), // Pastikan kunci JSON adalah 'question'
      })

      const data = await response.json()

      // Tambahkan respons bot ke area chat
      const botMessage = { sender: 'bot', text: data.answer } // Gunakan 'data.answer' sesuai respons backend
      setMessages([userMessage, botMessage]) // Hanya menyimpan satu pasangan pesan

      // Simpan riwayat chat ke sidebar
      setChatHistory((prev) => [
        ...prev,
        { user: input, bot: data.answer },
      ])
    } catch (error) {
      console.error('Error connecting to the backend:', error)
      const errorMessage = { sender: 'bot', text: 'Sorry, the server is maintaince..' }
      setMessages([userMessage, errorMessage])
    }

    setInput('') // Reset input
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Tambahkan judul
    doc.setFontSize(16)
    doc.text('Chat History', 10, 10)

    // Tambahkan riwayat chat
    let y = 20
    chatHistory.forEach((chat, index) => {
      doc.setFontSize(12)
      doc.text(`User: ${chat.user}`, 10, y)
      y += 10
      doc.text(`Bot: ${chat.bot}`, 10, y)
      y += 10
    })

    // Unduh file PDF
    doc.save('chat_history.pdf')
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Review Chat History</h2>
          {chatHistory.length > 0 && (
            <button onClick={handleDownloadPDF} className={styles.downloadButton}>
              Download PDF
            </button>
          )}
        </div>
        {chatHistory.length === 0 ? (
          <p>No chat history yet.</p>
        ) : (
          <ul>
            {chatHistory.map((chat, index) => (
              <li key={index}>
                <strong>User:</strong> {chat.user} <br />
                <strong>Bot:</strong> {chat.bot}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}