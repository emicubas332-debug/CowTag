import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Asegúrate de tener tu cliente supabase configurado

function SanidadModule() {
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState({
    animalTag: "",
    tipo: "",
    dosis: "",
    fechaAplicacion: "",
    proximaAplicacion: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cargar registros
  const fetchRegistros = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sanidad")
      .select("*")
      .order("fechaAplicacion", { ascending: false });
    if (error) {
      setError("Error al cargar registros: " + error.message);
    } else {
      setRegistros(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistros();

    // Suscripción en tiempo real (opcional)
    const subscription = supabase
      .channel("sanidad")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sanidad" },
        () => fetchRegistros()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const limpiarForm = () => {
    setForm({
      animalTag: "",
      tipo: "",
      dosis: "",
      fechaAplicacion: "",
      proximaAplicacion: "",
    });
    setEditId(null);
    setError("");
  };

  const guardarRegistro = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.animalTag.trim() || !form.tipo.trim() || !form.dosis.trim() || !form.fechaAplicacion) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }
    setSaving(true);

    try {
      if (editId) {
        const { error } = await supabase
          .from("sanidad")
          .update(form)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sanidad")
          .insert([form]);
        if (error) throw error;
      }
      limpiarForm();
      fetchRegistros();
    } catch (err) {
      setError("Error al guardar: " + err.message);
    }

    setSaving(false);
  };

  const editarRegistro = (registro) => {
    setForm({
      animalTag: registro.animalTag || "",
      tipo: registro.tipo || "",
      dosis: registro.dosis || "",
      fechaAplicacion: registro.fechaAplicacion || "",
      proximaAplicacion: registro.proximaAplicacion || "",
    });
    setEditId(registro.id);
    setError("");
  };

  const eliminarRegistro = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este registro?")) {
      const { error } = await supabase
        .from("sanidad")
        .delete()
        .eq("id", id);
      if (error) alert("Error al eliminar: " + error.message);
      else fetchRegistros();
    }
  };

  // --- Aquí va todo el JSX igual que antes ---
  return (
    <section style={{ maxWidth: 960, margin: "40px auto", padding: 20, backgroundColor: "#e0f7fa", borderRadius: 12, userSelect: "none" }} aria-label="Módulo de Sanidad">
      <h2 style={{ color: "#00796b", marginBottom: 20 }}>
        {editId ? "Editar Registro de Sanidad" : "Registrar Nuevo Registro de Sanidad"}
      </h2>

      <form onSubmit={guardarRegistro} style={{ marginBottom: 30 }}>
        <input name="animalTag" placeholder="Tag Animal (ID)" value={form.animalTag} onChange={handleChange} required style={inputStyle} aria-label="Tag Animal" />
        <input name="tipo" placeholder="Tipo vacuna o medicamento" value={form.tipo} onChange={handleChange} required style={inputStyle} aria-label="Tipo vacuna o medicamento" />
        <input name="dosis" placeholder="Dosis" value={form.dosis} onChange={handleChange} required style={inputStyle} aria-label="Dosis" />
        <label style={{ display: "block", marginBottom: 8, marginTop: 8, color: "#004d40" }}>Fecha de Aplicación*</label>
        <input name="fechaAplicacion" type="date" value={form.fechaAplicacion} onChange={handleChange} required style={{ ...inputStyle, padding: "10px 12px", marginBottom: 12 }} aria-label="Fecha de aplicación" />
        <label style={{ display: "block", marginBottom: 8, color: "#004d40" }}>Próxima Aplicación (opcional)</label>
        <input name="proximaAplicacion" type="date" value={form.proximaAplicacion} onChange={handleChange} style={inputStyle} aria-label="Próxima aplicación" />

        {error && <p role="alert" style={{ color: "red", marginTop: 10, marginBottom: 10 }}>{error}</p>}

        <div style={{ display: "flex", gap: 16 }}>
          <button type="submit" disabled={saving} style={{ backgroundColor: saving ? "#004d40" : "#00796b", color: "white", padding: "12px 24px", border: "none", borderRadius: 8, cursor: saving ? "wait" : "pointer", fontWeight: "600", fontSize: 16, transition: "background-color 0.3s", flex: "1 1 150px" }} aria-label={editId ? "Actualizar registro" : "Registrar registro"}>
            {saving ? "Guardando..." : editId ? "Actualizar" : "Registrar"}
          </button>

          {editId && (
            <button type="button" onClick={limpiarForm} style={{ backgroundColor: "#e0f2f1", color: "#00796b", padding: "12px 24px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "600", fontSize: 16, flex: "1 1 150px", transition: "background-color 0.3s" }} aria-label="Cancelar edición">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <h3 style={{ color: "#00796b", marginBottom: 10 }}>Registros de Sanidad</h3>
      {loading ? (
        <p style={{ textAlign: "center", color: "#004d40" }}>Cargando registros...</p>
      ) : registros.length === 0 ? (
        <p style={{ textAlign: "center", color: "#004d40" }}>No hay registros.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 3px 12px rgba(0,0,0,0.1)", backgroundColor: "white", borderRadius: 12, overflow: "hidden", userSelect: "none" }} aria-label="Tabla de registros de sanidad">
          <thead style={{ backgroundColor: "#00796b", color: "white" }}>
            <tr>
              <th style={thStyle}>Animal Tag</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Dosis</th>
              <th style={thStyle}>Fecha Aplicación</th>
              <th style={thStyle}>Próxima Aplicación</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? "#e0f2f1" : "white", borderBottom: "1px solid #b2dfdb" }}>
                <td style={tdStyle}>{r.animalTag}</td>
                <td style={tdStyle}>{r.tipo}</td>
                <td style={tdStyle}>{r.dosis}</td>
                <td style={tdStyle}>{r.fechaAplicacion}</td>
                <td style={tdStyle}>{r.proximaAplicacion || "-"}</td>
                <td style={{ ...tdStyle, display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => editarRegistro(r)} style={btnEditar} aria-label={`Editar registro para animal ${r.animalTag}`}>Editar</button>
                  <button onClick={() => eliminarRegistro(r.id)} style={btnEliminar} aria-label={`Eliminar registro para animal ${r.animalTag}`}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  maxWidth: 320,
  padding: "10px 12px",
  borderRadius: 6,
  border: "1.5px solid #00796b",
  fontSize: 16,
  outlineColor: "#4dd0e1",
  marginBottom: 10,
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
};

const thStyle = { padding: "12px 10px", textAlign: "left" };
const tdStyle = { padding: "10px" };
const btnEditar = { backgroundColor: "#00838f", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: "600", fontSize: 14, transition: "background-color 0.3s" };
const btnEliminar = { backgroundColor: "#d32f2f", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: "600", fontSize: 14, transition: "background-color 0.3s" };

export default SanidadModule;
