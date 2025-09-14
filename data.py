import os
import json

# --- Konfigurasi ---
# Sesuaikan path ini jika folder Anda berbeda
EBOOK_FOLDER = 'data/ebook'
THUMBNAIL_FOLDER = 'data/thumbnails' # Pastikan nama folder ini benar

# --- Logika Script ---
def create_book_data():
    """Membaca file dari folder dan membuat daftar data buku."""
    book_list = []
    
    # Pastikan folder ebook ada
    if not os.path.isdir(EBOOK_FOLDER):
        print(f"Error: Folder '{EBOOK_FOLDER}' tidak ditemukan.")
        return None

    # Mengambil semua file dari folder ebook
    try:
        files = os.listdir(EBOOK_FOLDER)
    except FileNotFoundError:
        print(f"Error: Tidak dapat mengakses folder '{EBOOK_FOLDER}'.")
        return None

    # Filter hanya untuk file PDF
    pdf_files = sorted([f for f in files if f.lower().endswith('.pdf')])
    
    # Membuat data untuk setiap file PDF
    for i, pdf_filename in enumerate(pdf_files, 1):
        # Mengambil nama file tanpa ekstensi .pdf
        base_name = os.path.splitext(pdf_filename)[0]
        
        # Mengasumsikan nama file thumbnail sama dengan nama file PDF (hanya beda ekstensi)
        thumbnail_filename = f"{base_name}.jpg"

        # Membuat judul dari nama file (mengganti spasi dan membersihkan)
        # Anda bisa sesuaikan logika pembersihan judul ini jika perlu
        clean_title = base_name.replace('_', ' ').replace('-', ' ').strip()
        
        book_list.append({
            'id': i,
            'title': clean_title,
            'description': f"'{clean_title}'.",
            'coverImage': thumbnail_filename,
            'pdfFile': pdf_filename,
        })
        
    return book_list

def generate_js_output(books_data):
    """Menghasilkan string output dalam format file data.js."""
    if not books_data:
        print("Tidak ada data buku untuk diproses.")
        return

    # Menggunakan library json untuk formatting yang aman dan rapi
    # indent=2 agar outputnya mudah dibaca
    js_objects = []
    for book in books_data:
        # Menggunakan json.dumps untuk handle karakter spesial seperti petik (')
        js_objects.append(json.dumps(book, indent=2))

    # Gabungkan semua objek menjadi satu string array JavaScript
    js_array_string = ",\n".join(js_objects)
    
    # Final output
    final_output = f"export const books = [\n{js_array_string}\n];"
    
    print(final_output)


# --- Eksekusi Script ---
if __name__ == "__main__":
    all_books = create_book_data()
    if all_books:
        generate_js_output(all_books)