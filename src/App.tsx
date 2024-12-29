import "./App.css";
import { VirtualizedCombobox } from "./components/virtualized-combobox";

function generateItems() {
  const items: string[] = [];
  for (let i = 1; i <= 20000; i++) {
    items.push(`item ${i}`);
  }
  return items;
}

const initialOptions: string[] = generateItems();

function App() {
  return <VirtualizedCombobox options={initialOptions} />;
}

export default App;
