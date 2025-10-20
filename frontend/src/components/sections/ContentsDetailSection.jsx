import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, Sparkles } from "lucide-react";
import { CardDetailComponent } from "../cards/CardDetailComponent";
import SectionHeader from "./HeaderSection";

export function ContentsDetailSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtopic, topic } = location.state || {};
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

  return (
    <div className="min-h-screen bg-white">
      <div>
        {/* ENCABEZADO */}
        <SectionHeader
          topic={topic?.topic_title}
          subtopic={subtopic?.subtopic_title}
          onBack={() => navigate(`/subMain/${topic?.topic_code}`)}
        />
      </div>

      <div className="min-h-screen px-16">
        {/* FORMULARIO PARA NUEVA FLASHCARD */}
        <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 shadow-sm mb-8 bg-gradient-to-r from-primary to-primary-light">
          <div className="flex-1 border rounded-md p-4 text-center text-gray-700 bg-white">
            <strong>Nueva pregunta</strong>
            <textarea
              value={nuevaPregunta}
              onChange={(e) => setNuevaPregunta(e.target.value)}
              placeholder="Escribe tu pregunta aquí."
              className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-light focus:outline-none"
            />
          </div>

          <div className="flex-1 border rounded-md p-4 bg-white text-gray-700">
            <strong>Respuesta</strong>
            <textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder="Escribe aquí la respuesta."
              className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-light focus:outline-none"
            />
          </div>

          <div className="flex sm:flex-col items-center justify-around sm:justify-center gap-3 sm:ml-2">
            <button
              onClick={agregarPregunta}
              className="text-white hover:text-primary-medium"
              title="Guardar nueva flashcard">
              <Save size={22} />
            </button>
            <button
              onClick={agregarPregunta}
              className="text-white hover:text-primary-medium"
              title="Generar respuesta">
              <Sparkles size={22} />
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
    </div>
  );
}
