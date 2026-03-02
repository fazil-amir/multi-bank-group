import { APP_NAME } from "@shared/constants/app.constants";
import { useLivePrices } from "../hooks/useLivePrices";
import { Tracker } from "../components/tracker";

export default function App() {
  const { priceMap, error } = useLivePrices();

  return (
    <main>
      <h1>{APP_NAME}</h1>
      {error ? <p className="error">{error}</p> : <Tracker priceMap={priceMap} />}
    </main>
  );
}
