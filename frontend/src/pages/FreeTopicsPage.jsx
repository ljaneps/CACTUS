import FreeTopicsSection from "../components/sections/FreeTopicsSection";
import CheckAuth from "../components/CheckAuth";

export default function FreeTopicsPage() {
  return (
    <CheckAuth requireAuth={false}>
      <FreeTopicsSection />
    </CheckAuth>
  );
}