// ...existing code...
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, Sparkles } from "lucide-react";
import { CardDetailComponent } from "../cards/CardDetailComponent";
import SectionHeader from "./HeaderSection";
import { CardSubtopicEditComponent } from "../cards/CardSubtopicEditComponent";

export function NewSubtopicContentsSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    topicId,
    topic: initialTopic,
    subtopic: initialSubtopic,
  } = location.state || {};

  const [topic, setTopic] = useState(
    initialTopic ?? { topic_code: topicId, topic_title: "" }
  );

  const [subtopics, setSubtopics] = useState([]);
  const [currentSubtopic, setCurrentSubtopic] = useState(initialSubtopic);
  // usar nombre consistente 'flashcards'
  const [flashcards, setFlashcards] = useState(
    currentSubtopic?.flashcards ?? []
  );

  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [nuevaRespuesta, setNuevaRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

  // Cargar subtopics y flashcards cuando cambie el topic o currentSubtopic
  useEffect(() => {
    if (!topic?.topic_code) return;

    const controller = new AbortController();
    const fetchSubtopics = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/topics/by-topic/${topic.topic_code}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        // ajustar según la forma real de la respuesta
        setSubtopics(data.subtopics ?? data ?? []);
        // si no hay currentSubtopic, seleccionar el primero
        if (!currentSubtopic && (data.subtopics ?? data).length > 0) {
          const first = (data.subtopics ?? data)[0];
          setCurrentSubtopic(first);
          setFlashcards(first.flashcards ?? []);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtopics();
    return () => controller.abort();
  }, [topic.topic_code]);

  // sincronizar flashcards si cambia currentSubtopic desde navegación externa
  useEffect(() => {
    setFlashcards(currentSubtopic?.flashcards ?? []);
  }, [currentSubtopic]);

  // Crear Flashcard
  const crearFlashcard = async () => {
    if (!currentSubtopic?.subtopic_code)
      return alert("Selecciona primero un subtema.");

    const titulo = nuevaPregunta.trim();
    const explicacion = nuevaRespuesta.trim();
    if (!titulo || !explicacion) return alert("Completa ambos campos.");

    try {
      const response = await fetch(`${baseUrl}/topics/add/flashcards/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtopic_code: currentSubtopic.subtopic_code,
          titulo,
          explicacion,
        }),
      });

      if (!response.ok)
        throw new Error(`Error al crear: ${response.statusText}`);

      const data = await response.json();
      // asumir que 'data' es la flashcard creada con flashcard_code
      setFlashcards((prev) => [...prev, data]);
      setNuevaPregunta("");
      setNuevaRespuesta("");
    } catch (err) {
      console.error("Error al crear flashcard:", err);
      alert("No se pudo crear la flashcard.");
    }
  };

  // Actualizar Flashcard
  const actualizarCampo = async (id, nuevosDatos) => {
    const titulo = (nuevosDatos.pregunta ?? "").trim();
    const explicacion = (nuevosDatos.respuesta ?? "").trim();

    try {
      const response = await fetch(
        `${baseUrl}/topics/update/flashcards/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo,
            explicacion,
          }),
        }
      );

      if (!response.ok)
        throw new Error(`Error al actualizar: ${response.statusText}`);

      const data = await response.json();

      setFlashcards((prev) =>
        prev.map((f) =>
          f.flashcard_code === id
            ? {
                ...f,
                // ajustar con las claves que devuelva el backend
                sentence: data.sentence ?? titulo ?? f.sentence,
                explanation: data.explanation ?? explicacion ?? f.explanation,
              }
            : f
        )
      );

      console.log("Flashcard actualizada:", data);
    } catch (err) {
      console.error("Error al actualizar flashcard:", err);
      alert("No se pudo actualizar la flashcard.");
    }
  };

  // Eliminar Flashcard
  const eliminarPregunta = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta flashcard?")) return;

    try {
      const response = await fetch(
        `${baseUrl}/topics/remove/flashcards/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error(`Error al eliminar: ${response.statusText}`);

      setFlashcards((prev) => prev.filter((f) => f.flashcard_code !== id));
      console.log("Flashcard eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar flashcard:", err);
      alert("No se pudo eliminar la flashcard.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div>
        <SectionHeader
          topic={topic.topic_title || "Nuevo Tema"}
          subtopic={currentSubtopic?.subtopic_title ?? ""}
          onBack={() => navigate(`/subMain/${topic.topic_code}`)}
        />
      </div>

      <div className="min-h-screen px-16">
        <CardSubtopicEditComponent
          subtopic={currentSubtopic ?? "new"}
          topic={topic.topic_code}
          onUpdate={(data) => {
            // si backend devuelve el subtopic creado/actualizado, lo añadimos o actualizamos
            setSubtopics((prev) => {
              const exists = prev.find(
                (s) => s.subtopic_code === data.subtopic_code
              );
              if (exists) {
                return prev.map((s) =>
                  s.subtopic_code === data.subtopic_code ? data : s
                );
              }
              return [...prev, data];
            });
            setCurrentSubtopic(data);
            setFlashcards(data.flashcards ?? []);
          }}
          onGenerate={() =>
            console.log("Generar respuesta para nuevo subtopic")
          }
        />

        {/* Crear nueva flashcard */}
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
              onClick={() => console.log(" Generar con IA")}
              className="text-white hover:text-primary-medium"
              title="Generar respuesta"
              aria-label="Generar respuesta">
              <Sparkles size={22} />
            </button>
          </div>
        </div>

        {/* Lista de flashcards */}
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

