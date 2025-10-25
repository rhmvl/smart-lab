import { useState, useEffect } from 'react';
import './Notes.css';
import { Notebook, Plus, X } from 'lucide-react';

// Mendefinisikan struktur data untuk satu catatan
interface Note {
  id: number;
  text: string;
  label: string;
  timestamp: string;
}

interface NotesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notes({ isOpen, onClose }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('project-assistant-notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Gagal memuat catatan dari localStorage:", error);
    }
  }, []);

  // 2. Fungsi untuk menyimpan catatan ke state dan localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('project-assistant-notes', JSON.stringify(newNotes));
  };

  // 3. Fungsi untuk menambah catatan baru
  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      text: 'Catatan Baru...',
      label: 'Umum', // Label default
      timestamp: new Date().toLocaleString('id-ID'),
    };
    saveNotes([...notes, newNote]);
  };

  // 4. Menyaring catatan berdasarkan input pencarian
  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.label.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.id - a.id); // Urutkan dari yang terbaru

  // =================================================

  return (
    <div className={`notes-popup ${isOpen ? 'open' : ''}`}>
      <div className="notes-header">
        <input
          type="text"
          className="search-bar"
          placeholder="Cari catatan atau label..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="action-btn" title="Tambah Catatan Baru" onClick={addNote}>
          <Plus className="w-5 h-5" />
        </button>
        <button className="action-btn" title="Riwayat (Fitur akan datang)">
          <Notebook className="w-5 h-5" />
        </button>
        <button className="close-btn" title="Tutup" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="notes-list">
        {/* == BAGIAN KONTEN YANG HILANG (DIISI KEMBALI) == */}
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-label">{note.label}</div>
              <textarea
                className="note-text"
                defaultValue={note.text}
                // Anda bisa menambahkan fungsi onBlur untuk menyimpan perubahan
              />
              <div className="note-timestamp">{note.timestamp}</div>
            </div>
          ))
        ) : (
          <p className="empty-notes-message">Tidak ada catatan ditemukan.</p>
        )}
        {/* ================================================= */}
      </div>
    </div>
  );
}
