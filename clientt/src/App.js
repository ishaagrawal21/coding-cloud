import React, { useState } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookSetPage from "./pages/BookSetPage";
import MasterDataPage from "./pages/MasterDataPage";

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = useState("booksets");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <div style={{ padding: "1rem", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setPage("masters")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 4,
                border: "1px solid #1976d2",
                backgroundColor: page === "masters" ? "#1976d2" : "white",
                color: page === "masters" ? "white" : "#1976d2",
                cursor: "pointer",
              }}
            >
              Master Data (Board / Medium / Class / Year / Books)
            </button>
            <button
              onClick={() => setPage("booksets")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 4,
                border: "1px solid #1976d2",
                backgroundColor: page === "booksets" ? "#1976d2" : "white",
                color: page === "booksets" ? "white" : "#1976d2",
                cursor: "pointer",
              }}
            >
              Book Set Management
            </button>
          </div>

          {page === "masters" && <MasterDataPage />}
          {page === "booksets" && <BookSetPage />}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
