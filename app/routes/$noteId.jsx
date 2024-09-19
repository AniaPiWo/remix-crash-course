import styles from "../styles/note-details.css";
import { Link, useLoaderData, json } from "@remix-run/react";
import { getStoredNotes } from "../data/notes";
export default function NoteDetailsPage() {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>

      <h1>Note Details</h1>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export async function loader({ params }) {
  //params have information about the route, we can get the noteId from it cause its in adress
  const notes = await getStoredNotes();
  const noteId = params.noteId; //params.nodeId to to co wpisane jest po $ w dynamicznym adresie
  const selectedNote = notes.find((note) => note.id === noteId);

  if (!selectedNote) {
    throw json(
      { message: `Note with id "${noteId}" was not found` },
      { status: 404 }
    );
  }
  return selectedNote;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
