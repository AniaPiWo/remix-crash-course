import { redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes } from "../data/notes";
import NewNote, { links as newNoteLinks } from "../components/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList";
import {
  useLoaderData,
  /*   Link,
  isRouteErrorResponse,
  useRouteError, */
  Outlet,
} from "@remix-run/react";

// runs on client side when GET is made to NotesPage
export default function NotesPage() {
  const notes = useLoaderData(); // pobranie danych z loader function, hook remixa

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
      <Outlet />
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

// this meta will be merged with meta from _index.jsx
export const meta = () => [
  {
    title: "All Notes",
    description: "Keep track of your notes",
  },
];

// obsluga bledow TYLKO dla tej strony
/* export function ErrorBoundary() {
  const error = useRouteError();

  // Obsługa błędów odpowiedzi HTTP
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data || "Something went wrong while fetching notes."}</p>
        <p>
          <Link to="/">Back to home</Link>
        </p>
      </div>
    );
  }

  // Obsługa innych błędów (np. błędy runtime)
  return (
    <div>
      <h1>An unexpected error occurred!</h1>
      <p>{error.message}</p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}

// Opcjonalnie możesz dodać CatchBoundary, jeśli chcesz obsługiwać specyficzne błędy HTTP
export function CatchBoundary() {
  const caught = useRouteError();

  return (
    <div>
      <h1>
        {caught.status}: {caught.statusText}
      </h1>
      <p>
        {caught.data || "Sorry, we couldn't find what you were looking for."}
      </p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}
 */
