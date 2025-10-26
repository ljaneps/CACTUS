import { useState } from "react";
import { Edit, Save, Sparkles } from "lucide-react";

export function CardSubtopicEditComponent({
  subtopic,
  topic,
  onUpdate,
  onGenerate,
}) {
  const [editando, setEditando] = useState(false);
  const [tempTitulo, setTempTitulo] = useState(subtopic?.subtopic_title || "");
  const [tempDescripcion, setTempDescripcion] = useState(
    subtopic?.description || ""
  );

const updateSubtopic = async () => {
  const isNew = subtopic === "new" || subtopic?.isNew;

  try {
    let response;

    if (isNew) {
      if (!topic) {
        alert("No se puede crear el subtopic: falta el topic_code");
        return;
      }

      response = await fetch(
        `http://127.0.0.1:8000/topics/add/subtopics/${topic}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic_code: topic, 
            titulo: tempTitulo,
            descripcion: tempDescripcion,
          }),
        }
      );
    } else {
      if (!subtopic?.subtopic_code) {
        alert("No se puede actualizar: falta el código del subtópico");
        return;
      }

      response = await fetch(
        `http://127.0.0.1:8000/topics/update/subtopics/${subtopic.subtopic_code}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: tempTitulo,
            descripcion: tempDescripcion,
          }),
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error en la petición (${isNew ? "crear" : "actualizar"}): ${errorText}`
      );
    }

    const data = await response.json();
    console.log(
      `Subtopic ${isNew ? "creado" : "actualizado"} correctamente:`,
      data
    );

    if (onUpdate) onUpdate(data);

    setTempTitulo(data.subtopic_title);
    setTempDescripcion(data.description);
    setEditando(false);
  } catch (error) {
    console.error("Error al procesar el subtopic:", error);
    alert(
      "No se pudo procesar el subtopic. Revisa la consola para más detalles."
    );
  }
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
            {tempTitulo || "Título del Subtema"}
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
              {tempDescripcion || "Aquí irá la descripción del subtema."}
            </p>
          )}

          {/* 🔹 Botones laterales */}
          <div className="flex flex-col gap-3">
            {editando ? (
              <button
                onClick={updateSubtopic}
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
