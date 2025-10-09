import { CardMainTopicComponent } from "../components/cards/CardMainTopicComponent";
import { CardSubTopicComponent } from "../components/cards/CardSubTopicComponent";
import { CardQuestionComponent } from "../components/cards/CardQuestionComponent";
import { CardResponseComponent } from "./cards/CardResponseComponent";
import { CardTestResultComponent } from "./cards/CardTestResultComponent";
import { CardTestComponent } from "./cards/CardTestComponent";

export function Testcomponent() {
  const countryOptions = [
    { value: "USA", label: "United States", defaultChecked: true },
    { value: "CAN", label: "Canada" },
    { value: "MEX", label: "Mexico" },
    { value: "PER", label: "Perú" },
  ];

  const respuestas = [
    { value: "A", label: "Respuesta A", isCorrect: true },
    { value: "B", label: "Respuesta B", isCorrect: false, showWrongIcon: true },
    { value: "C", label: "Respuesta C", isCorrect: false },
    { value: "D", label: "Respuesta D", isCorrect: false },
  ];
  return (
    <div>
      <h3>Test component tarjeta simple</h3>
      <CardTestComponent options={countryOptions} />
      <h3>Test component resultado test</h3>
      <CardTestResultComponent options={respuestas} />
      <h3>Test component pregunta</h3>
      <CardQuestionComponent />
      <h3>Test component respuesta</h3>
      <CardResponseComponent />
      <h3>Test component 1</h3>
      <CardMainTopicComponent />
      <h3>Test component 2</h3>
      <CardSubTopicComponent />
    </div>
  );
}
