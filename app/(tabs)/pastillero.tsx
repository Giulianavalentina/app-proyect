import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PastilleroScreen() {
  const [conectado, setConectado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [ip, setIp] = useState("192.168.1.100"); // IP del ESP32 en PEINE-3
  const [estado, setEstado] = useState("Desconectado");

  const testConexion = async () => {
    setCargando(true);
    try {
      // PRIMERO verifica que estés en PEINE-3
      const response = await fetch(`http://${ip}/estado`, {
        method: "GET",
      });

      if (response.ok) {
        const texto = await response.text();
        setEstado(texto);
        setConectado(true);
        Alert.alert("✅ Conectado", "Pastillero listo en PEINE-3");
      } else {
        throw new Error("No responde");
      }
    } catch {
      setConectado(false);
      setEstado("Error de conexión");
      Alert.alert(
        "❌ Error",
        "No se pudo conectar. Verifica:\n" +
          "1. Estás en WiFi: PEINE-3\n" +
          "2. El ESP32 está encendido\n" +
          "3. IP correcta: " +
          ip
      );
    } finally {
      setCargando(false);
    }
  };

  const enviarComando = async (comando: string, slot?: number) => {
    if (!conectado) {
      Alert.alert("Error", "Primero conéctate al pastillero");
      return;
    }

    try {
      let url = `http://${ip}/${comando}`;
      if (slot) {
        url += `?slot=${slot}`;
      }

      const response = await fetch(url, { method: "GET" });
      const texto = await response.text();

      Alert.alert("✅ Éxito", texto);

      // Actualizar estado
      const estadoRespuesta = await fetch(`http://${ip}/estado`);
      if (estadoRespuesta.ok) {
        setEstado(await estadoRespuesta.text());
      }
    } catch {
      Alert.alert("❌ Error", "Comando falló. Verifica conexión.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.seccion}>
        <Text style={styles.titulo}>💊 Control Pastillero</Text>
        <Text style={styles.subtitulo}>Red: PEINE-3</Text>

        <Text style={styles.label}>IP del ESP32 en PEINE-3:</Text>
        <TextInput
          style={styles.input}
          value={ip}
          onChangeText={setIp}
          placeholder="Ej: 192.168.1.100"
          keyboardType="numbers-and-punctuation"
        />

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={testConexion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>
              {conectado ? "✅ Conectado a PEINE-3" : "🔗 Probar Conexión"}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.estado}>Estado: {estado}</Text>
      </View>

      {conectado && (
        <>
          <View style={styles.seccion}>
            <Text style={styles.titulo}>Control Manual</Text>

            <TouchableOpacity
              style={[styles.botonAccion, styles.botonVerde]}
              onPress={() => enviarComando("abrir")}
            >
              <Text style={styles.botonTexto}>🚪 Abrir Pastillero</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonAccion, styles.botonRojo]}
              onPress={() => enviarComando("cerrar")}
            >
              <Text style={styles.botonTexto}>🔒 Cerrar Pastillero</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonAccion, styles.botonAmarillo]}
              onPress={() => enviarComando("test")}
            >
              <Text style={styles.botonTexto}>🔊 Test Buzzer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.titulo}>Dispensar Slots</Text>
            <View style={styles.slots}>
              {[1, 2, 3, 4, 5, 6].map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={styles.slot}
                  onPress={() => enviarComando("dispensar", slot)}
                >
                  <Text style={styles.slotTexto}>Slot {slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      <View style={styles.seccion}>
        <Text style={styles.titulo}>📋 Instrucciones</Text>
        <Text style={styles.instruccion}>1. Enciende el pastillero</Text>
        <Text style={styles.instruccion}>2. ESP32 debe estar en PEINE-3</Text>
        <Text style={styles.instruccion}>3. Tu celular también en PEINE-3</Text>
        <Text style={styles.instruccion}>4. Descubre IP del ESP32</Text>
        <Text style={styles.instruccion}>5. Presiona &quot;Probar Conexión&quot;</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  seccion: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2c3e50",
  },
  subtitulo: {
    fontSize: 14,
    color: "#3498db",
    marginBottom: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  boton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  botonDeshabilitado: {
    backgroundColor: "#bdc3c7",
  },
  botonTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  estado: {
    fontSize: 14,
    color: "#34495e",
    marginTop: 12,
    textAlign: "center",
  },
  botonAccion: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  botonVerde: {
    backgroundColor: "#2ecc71",
  },
  botonRojo: {
    backgroundColor: "#e74c3c",
  },
  botonAmarillo: {
    backgroundColor: "#f39c12",
  },
  slots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slot: {
    width: "48%",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  slotTexto: {
    color: "white",
    fontWeight: "600",
  },
  instruccion: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 8,
    lineHeight: 20,
  },
});
