import { useState, useEffect } from "react";
import { Plus, X, Clock, Trash2 } from "lucide-react";

interface Note {
  id: number;
  text: string;
  label: string;
  timestamp: string;
  history?: { text: string; timestamp: string }[];
}

interface NotesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notes({ isOpen, onClose }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smartlab-notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem("smartlab-notes", JSON.stringify(newNotes));
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      text: "Catatan Baru...",
      label: "Umum",
      timestamp: new Date().toLocaleString("id-ID"),
      history: [],
    };
    saveNotes([...notes, newNote]);
  };

  const updateNote = (id: number, newText: string) => {
    const newNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          text: newText,
          timestamp: new Date().toLocaleString("id-ID"),
          history: [
            ...(note.history || []),
            { text: note.text, timestamp: note.timestamp },
          ],
        };
      }
      return note;
    });
    saveNotes(newNotes);
  };

  const deleteNote = (id: number) => {
    if (confirm("Yakin ingin menghapus catatan ini?")) {
      const newNotes = notes.filter((note) => note.id !== id);
      saveNotes(newNotes);
    }
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.id - a.id);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-full sm:w-[26rem] z-50 transform transition-transform duration-500 ease-in-out
      backdrop-blur-md bg-white/40 dark:bg-gray-900/60 border-r border-gray-300/30 dark:border-gray-700/30 shadow-2xl
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-300/30 dark:border-gray-700/30 p-3 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <input
          type="text"
          className="flex-1 rounded-md bg-gray-100/50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Cari catatan atau label..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={addNote}
          title="Tambah Catatan"
          className="p-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          title="Riwayat Catatan"
          className={`p-2 rounded-md transition ${
            showHistory
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <Clock className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          title="Tutup"
          className="p-2 rounded-md bg-rose-500 text-white hover:bg-rose-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notes List */}
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-4 space-y-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-300/30 dark:border-gray-700/30 shadow-md hover:shadow-lg transition relative"
            >
              {/* Delete button */}
              <button
                onClick={() => deleteNote(note.id)}
                title="Hapus Catatan"
                className="absolute top-2 right-2 p-1 rounded-md bg-red-500/80 text-white hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase text-indigo-500 dark:text-indigo-400">
                  {note.label}
                </span>
                <span className="text-[0.75rem] text-gray-500 dark:text-gray-400 mr-6">
                  {note.timestamp}
                </span>
              </div>

              <textarea
                defaultValue={note.text}
                onBlur={(e) => updateNote(note.id, e.target.value)}
                className="w-full resize-none rounded-md bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/30 dark:border-gray-700/30 p-2 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={3}
              />

              {showHistory && note.history && note.history.length > 0 && (
                <div className="mt-3 border-t border-gray-300/30 dark:border-gray-700/30 pt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="font-semibold mb-1">Riwayat:</div>
                  {note.history
                    .slice(-3)
                    .reverse()
                    .map((h, i) => (
                      <div
                        key={i}
                        className="truncate opacity-90 hover:opacity-100 cursor-pointer"
                        onClick={() => updateNote(note.id, h.text)}
                      >
                        • {h.text.substring(0, 40)}...{" "}
                        <span className="opacity-70">({h.timestamp})</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Tidak ada catatan ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
