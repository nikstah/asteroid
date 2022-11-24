import { useState } from "react";

export default function KeyForm() {
  const [rasaKey, setRasaKey] = useState("DEMO_KEY");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(event.target["keyField"].value)
    }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your key:
        <input
          id="keyField"
          type="text" 
          value={rasaKey}
          onChange={(e) => setRasaKey(e.target.value)}
        />
      </label>
    </form>
  )
}

