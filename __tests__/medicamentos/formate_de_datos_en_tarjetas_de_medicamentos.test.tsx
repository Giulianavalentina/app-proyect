import { render } from "@testing-library/react-native";
import TarjetaParaMedicamento from "../../src/medicamentos/componentes";

describe("Alarmas Configuradas = Interfaz de usuario", () => {
  test("La unidad de las dosis estan en miligramos", () => {
    const { getByText } = render(
      <TarjetaParaMedicamento
        nombre={"Aspirina"}
        dosis={50}
        horarios={[new Date()]}
      />
    );
    expect(getByText("50mg")).toBeVisible();
  });

  test("Los horarios se muestran en un formato de 24hs", () => {
    const { getByText } = render(
      <TarjetaParaMedicamento
        nombre={"Aspirina"}
        dosis={50}
        horarios={[new Date(2025, 9, 30, 20, 0, 0)]}
      />
    );

    expect(getByText("Horarios: 20:00")).toBeVisible();
  });
});
