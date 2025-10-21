import { useState } from "react";
import { Edit, Save, Sparkles } from "lucide-react";

export function CardSubtopicEditComponent({ subtopic, onUpdate, onGenerate }) {
  const [editando, setEditando] = useState(false);
  const [tempTitulo, setTempTitulo] = useState(subtopic?.subtopic_title || "");
  const [tempDescripcion, setTempDescripcion] = useState(
    subtopic?.description || ""
  );

  const guardarCambios = () => {
    if (onUpdate) {
      onUpdate({
        id: subtopic.subtopic_code,
        title: tempTitulo,
        description: tempDescripcion,
      });
    }
    setEditando(false);
  };

  return (
    <div className="relative border rounded-lg p-6 shadow-sm mb-8 bg-white">
      {/* Contenedor principal */}
      <div className="flex flex-col items-center text-center space-y-6">
        {/* 🔹 Título */}
        {editando ? (
          <input
            type="text"
            value={tempTitulo}
            onChange={(e) => setTempTitulo(e.target.value)}
            className="text-2xl font-bold text-emerald-900 uppercase border-b-2 border-primary focus:outline-none focus:border-primary-medium w-full text-center"
          />
        ) : (
          <h1 className="text-2xl font-bold text-emerald-900 uppercase">
            {subtopic?.subtopic_title || "Título del Subtema"}
          </h1>
        )}

        {/* 🔹 Descripción + botones laterales */}
        <div className="flex items-start justify-center gap-4 w-full max-w-5xl">
          {/* Descripción */}
          {editando ? (
            <textarea
              value={tempDescripcion}
              onChange={(e) => setTempDescripcion(e.target.value)}
              placeholder="Escribe la descripción del subtema..."
              className="flex-1 text-gray-700 border rounded-lg p-6 shadow-sm text-justify focus:ring-2 focus:ring-primary focus:outline-none"
            />
          ) : (
            <p className="flex-1 text-gray-700 border rounded-lg p-6 shadow-sm text-justify">
              {subtopic?.description || "Aquí irá la descripción del subtema."}
            </p>
          )}

          {/* 🔹 Botones laterales */}
          <div className="flex flex-col gap-3">
            {editando ? (
              <button
                onClick={guardarCambios}
                className="text-primary hover:text-primary-medium transition"
                title="Guardar cambios">
                <Save size={22} />
              </button>
            ) : (
              <button
                onClick={() => setEditando(true)}
                className="text-primary hover:text-primary-medium transition"
                title="Editar subtema">
                <Edit size={22} />
              </button>
            )}

            <button
              onClick={onGenerate}
              className="text-primary hover:text-primary-medium transition"
              title="Generar respuesta">
              <Sparkles size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
