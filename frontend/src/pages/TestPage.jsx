import { TestSection } from "../components/sections/TestSection";
import CheckAuth from "../components/CheckAuth";

export default function TestPage() {
  return (
    <CheckAuth requireAuth={true}>
      <TestSection />
    </CheckAuth>
  );
}
