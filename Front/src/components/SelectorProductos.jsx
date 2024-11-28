import React from "react";
import Select from "react-select";

function SelectorProductos({ value, productos, onChange }) {
  return (
    <div>
      <Select
        options={productos}
        value={productos.find((p) => p.value === value) || null}
        onChange={(selectedOption) => onChange(selectedOption?.value || null)}
        placeholder="Buscar producto..."
        isSearchable={true}
        noOptionsMessage={() => "No se encontraron productos"}
      />
    </div>
  );
}

export default SelectorProductos;
