import "./App.css";
import { VirtualizedCombobox } from "./components/virtualized-combobox";

function generateRandomStrings() {
  const items = new Set<string>();
  while (items.size < 20000) {
    const randomString = Math.random().toString(36).substr(2, 10);
    items.add(randomString);
  }
  return Array.from(items);
}

const initialOptions: string[] = generateRandomStrings();

function App() {
  return <VirtualizedCombobox options={initialOptions} />;
}

export default App;
