import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, Sparkles } from "lucide-react";
import { CardDetailComponent } from "../cards/CardDetailComponent";
import SectionHeader from "./HeaderSection";
import { CardSubtopicEditComponent } from "../cards/CardSubtopicEditComponent";

export function ContentsDetailSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};

  const [subtopicState, setSubtopicState] = useState(subtopic ?? null);
  const [flashcards, setFlashcards] = useState(subtopic?.flashcards ?? []);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [nuevaRespuesta, setNuevaRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

  useEffect(() => {
    setSubtopicState(subtopic ?? null);
    setFlashcards(subtopic?.flashcards ?? []);
  }, [subtopic]);

  const crearFlashcard = async () => {
    if (!subtopicState?.subtopic_code)
      return alert("Falta el código del subtema.");
    const titulo = nuevaPregunta.trim();
    const explicacion = nuevaRespuesta.trim();
    if (!titulo || !explicacion)
      return alert("Completa ambos campos antes de guardar.");

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/topics/add/flashcards/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtopic_code: subtopicState.subtopic_code,
          titulo,
          explicacion,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setFlashcards((prev) => [...prev, data]);
      setNuevaPregunta("");
      setNuevaRespuesta("");
    } catch (err) {
      console.error("Error al crear flashcard:", err);
      alert("No se pudo crear la flashcard.");
    } finally {
      setLoading(false);
    }
  };

  const actualizarCampo = async (id, nuevosDatos) => {
    const titulo = (nuevosDatos.pregunta ?? "").trim();
    const explicacion = (nuevosDatos.respuesta ?? "").trim();

    try {
      const res = await fetch(`${baseUrl}/topics/update/flashcards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, explicacion }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setFlashcards((prev) =>
        prev.map((f) =>
          f.flashcard_code === id
            ? {
                ...f,
                sentence: data.sentence ?? titulo ?? f.sentence,
                explanation: data.explanation ?? explicacion ?? f.explanation,
              }
            : f
        )
      );
    } catch (err) {
      console.error("Error al actualizar flashcard:", err);
      alert("No se pudo actualizar la flashcard.");
    }
  };

  const eliminarPregunta = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta flashcard?")) return;

    try {
      const res = await fetch(`${baseUrl}/topics/remove/flashcards/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(res.statusText);
      setFlashcards((prev) => prev.filter((f) => f.flashcard_code !== id));
    } catch (err) {
      console.error("Error al eliminar flashcard:", err);
      alert("No se pudo eliminar la flashcard.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SectionHeader
        topic={topic?.topic_title}
        subtopic=""
        onBack={() => navigate(`/subMain/${topic?.topic_code}`)}
      />

      <div className="min-h-screen px-16">
        <CardSubtopicEditComponent
          key={subtopicState?.subtopic_code ?? "new"}
          subtopic={subtopicState}
          onUpdate={(updated) => {
            setSubtopicState(updated);
            setFlashcards(updated.flashcards ?? flashcards);
          }}
        />

        <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 shadow-sm mb-8 bg-gradient-to-r from-primary to-primary-light">
          <div className="flex-1 border rounded-md p-4 text-center text-gray-700 bg-white">
            <strong>Nueva pregunta</strong>
            <textarea
              value={nuevaPregunta}
              onChange={(e) => setNuevaPregunta(e.target.value)}
              placeholder="Escribe tu pregunta aquí."
              className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-light focus:outline-none"
              aria-label="Nueva pregunta"
            />
          </div>

          <div className="flex-1 border rounded-md p-4 bg-white text-gray-700">
            <strong>Respuesta</strong>
            <textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder="Escribe aquí la respuesta."
              className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-light focus:outline-none"
              aria-label="Nueva respuesta"
            />
          </div>

          <div className="flex sm:flex-col items-center justify-around sm:justify-center gap-3 sm:ml-2">
            <button
              onClick={crearFlashcard}
              className="text-white hover:text-primary-medium"
              title="Guardar nueva flashcard"
              aria-label="Guardar nueva flashcard"
              disabled={loading}>
              <Save size={22} />
            </button>
            <button
              onClick={() => console.log("Generar con IA")}
              className="text-white hover:text-primary-medium"
              title="Generar respuesta"
              aria-label="Generar respuesta">
              <Sparkles size={22} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {flashcards.length === 0 ? (
            <p className="text-center text-gray-500">No hay flashcards aún.</p>
          ) : (
            flashcards.map((item) => (
              <CardDetailComponent
                key={item.flashcard_code}
                id={item.flashcard_code}
                title="Pregunta"
                pregunta={item.sentence}
                respuesta={item.explanation}
                onChange={actualizarCampo}
                onDelete={eliminarPregunta}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
