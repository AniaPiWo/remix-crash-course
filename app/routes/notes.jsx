import { redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes } from "../data/notes";
import NewNote, { links as newNoteLinks } from "../components/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList";
import { useLoaderData } from "@remix-run/react";

// runs on client side when GET is made to NotesPage
export default function NotesPage() {
  const notes = useLoaderData(); // pobranie danych z loader function, hook remixa

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

// jak dodajemy nowa notke to remix triggers action function a nastepnie loader function (bo zasobu sie zmienily i trzeba je zaktualizowac)

//runs on client side when GET is made to NotesPage (when page is rendered)
// component will be pre rendered on server and then hydrated on client
//it will never reach a client side
export async function loader() {
  const notes = await getStoredNotes();
  return notes; // pod maska remix zrobi return json(notes)
  // pod maska remix robi to
  //return new Response(JSON.stringify(notes), {headers: {"Content-Type": "application/json"}});
}

//runs on server, when req other than GET is made instead of NotesPage, it will run this function
// moze byc async
export async function action({ request }) {
  const formData = await request.formData(); //pobranie wszystkich danych z formularza

  /*   //wersja pierwsza konwertowania danych z formularza na obiekt
  const noteData = {
    title: formData.get("title"),
    content: formData.get("content"),
  } */

  const noteData = Object.fromEntries(formData); // konwertowanie danych z formularza na obiekt, nowoczesniejsza wersja

  if (noteData.title.trim().length < 5) {
    return { message: "Title must be at least 5 characters long" };
  }

  const existingNotes = await getStoredNotes(); // pobranie istniejacych notatek
  noteData.id = new Date().toISOString(); // ustawienie id nowej notatki na aktualny czas
  const updatedNotes = existingNotes.concat(noteData); // dodanie nowej notatki do istniejacych notatek
  await storeNotes(updatedNotes); // zapisanie nowych notatek
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}
