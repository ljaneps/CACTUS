import { CardMainTopicComponent } from "../components/cards/CardMainTopicComponent";
import { CardSubTopicComponent } from "../components/cards/CardSubTopicComponent";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CardTestComponent } from "./cards/CardTestComponent";
import { CardComponent } from "./cards/CardComponent";

export function Testcomponent() {
  const countryOptions = [
    { value: "USA", label: "United States", defaultChecked: true },
    { value: "CAN", label: "Canada" },
    { value: "MEX", label: "Mexico" },
    { value: "PER", label: "Perú" },
  ];

  const respuestas = [
    { value: "A", label: "Respuesta A", isCorrect: true },
    { value: "B", label: "Respuesta B", isCorrect: false},
    { value: "C", label: "Respuesta C", isCorrect: false },
    { value: "D", label: "Respuesta D", isCorrect: false },
  ];
  return (
    <div>
      <h3>Test component tarjeta simple</h3>
      <CardTestComponent
        type="question"
        title="Noteworthy technology 2021"
        options={countryOptions}
        onOptionChange={(val) => console.log(val)}
        mainButtonText="Ver"
        mainButtonIcon={ArrowRight}
      />

      <h3>Test component resultado test</h3>
      <CardTestComponent
        type="result"
        title="Noteworthy technology 2021"
        options={respuestas}
        mainButtonText="Ver"
        mainButtonIcon={ArrowRight}
      />

      <h3>Test component pregunta</h3>
      <CardComponent
        title="¿Noteworthy technology acquisitions 2021?"
        mainButtonText="Ver"
        mainButtonIcon={ArrowRight}
        mainButtonAction={() => console.log("Ver clicked")}
        onPrev={() => console.log("Prev")}
        onNext={() => console.log("Next")}
      />

      <h3>Test component respuesta</h3>
      <CardComponent
        title="Noteworthy technology 2021"
        content="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order..."
        mainButtonText="Back"
        mainButtonIcon={ArrowLeft}
        mainButtonAction={() => console.log("Back clicked")}
        onPrev={() => console.log("Prev")}
        onNext={() => console.log("Next")}
      />

      <h3>Test component 1</h3>
      <CardMainTopicComponent />
      <h3>Test component 2</h3>
      <CardSubTopicComponent />
    </div>
  );
}
