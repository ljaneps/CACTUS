import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Save } from "lucide-react";
import { CardDetailComponent } from "../cards/CardDetailComponent";

export function ContentsDetailSection() {
  const location = useLocation();
  const { subtopic, header } = location.state || {};
  const flashcards = subtopic?.flashcards || [];

  const [preguntas, setPreguntas] = useState([
    {
      id: 1,
      pregunta: "¿Qué es React?",
      respuesta: "Una librería de JavaScript.",
    },
  ]);

  // Estado para la nueva flashcard
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [nuevaRespuesta, setNuevaRespuesta] = useState("");

  // Agregar una nueva flashcard
  const agregarPregunta = () => {
    if (!nuevaPregunta.trim() || !nuevaRespuesta.trim()) return;

    const nueva = {
      id: Date.now(),
      pregunta: nuevaPregunta,
      respuesta: nuevaRespuesta,
    };

    setPreguntas([...preguntas, nueva]);
    setNuevaPregunta("");
    setNuevaRespuesta("");
  };

  const actualizarCampo = (id, campo, valor) => {
    setPreguntas(
      preguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const eliminarPregunta = (id) => {
    setPreguntas(preguntas.filter((p) => p.id !== id));
  };

  console.log("SUBTOPIC:", subtopic?.flashcards);

  return (
    <div className="min-h-screen bg-white p-16">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-emerald-900 uppercase">
          {header} &gt; {subtopic?.subtopic_title || "SUBTEMA"}
        </h1>
        <button onClick={agregarPregunta} className="p-2 rounded-full">
          <Plus
            className="text-emerald-900 hover:text-primary-medium"
            size={24}
          />
        </button>
      </div>

      {/* FORMULARIO PARA NUEVA FLASHCARD */}
      <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 shadow-sm mb-8">
        <div className="flex-1 border rounded-md p-4 text-center text-gray-700 bg-gray-50">
          <strong>Nueva pregunta</strong>
          <textarea
            value={nuevaPregunta}
            onChange={(e) => setNuevaPregunta(e.target.value)}
            placeholder="Escribe tu pregunta aquí."
            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex-1 border rounded-md p-4 bg-white text-gray-700">
          <strong>Respuesta</strong>
          <textarea
            value={nuevaRespuesta}
            onChange={(e) => setNuevaRespuesta(e.target.value)}
            placeholder="Escribe aquí la respuesta."
            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex sm:flex-col items-center justify-around sm:justify-center gap-3 sm:ml-2">
          <button
            onClick={agregarPregunta}
            className="text-emerald-900 hover:text-primary-medium"
            title="Guardar nueva flashcard">
            <Save size={22} />
          </button>
        </div>
      </div>

      {/* LISTA DE FLASHCARDS EXISTENTES */}
      <div className="space-y-6">
        {flashcards.map((item) => (
          <CardDetailComponent
            key={item.flashcard_code}
            id={item.flashcard_code}
            title="Pregunta"
            pregunta={item.sentence}
            respuesta={item.explanation}
            onChange={actualizarCampo}
            onDelete={eliminarPregunta}
          />
        ))}
      </div>
    </div>
  );
}
