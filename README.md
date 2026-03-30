📱 Documentación del Proyecto: GPS Maps Simulator
📌 Descripción General

Aplicación móvil desarrollada con React Native y Expo que implementa una simulación de seguimiento en tiempo real sobre un mapa. La aplicación dibuja y recorre una ruta con coordenadas reales en la ciudad de Medellín de forma suave e interactiva, mostrando animaciones de marcadores, solicitudes de permisos de ubicación y guardado en historial de rutas finalizadas.

🚀 Instalación y Ejecución del Proyecto
🔧 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

Node.js (versión recomendada: 18 o superior)
Git
Expo Go en tu celular (Android o iOS)
📥 Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd gps-maps-simulator
📦 Instalar dependencias
npm install

o si usas yarn:

yarn install
▶️ Ejecutar el proyecto
npx expo start

Esto abrirá el panel de Expo en el navegador.

📱 Probar la aplicación

Escanea el código QR con:

La app Expo Go (Android)
Cámara del iPhone (iOS)
⚠️ Recomendación Importante

Es altamente recomendable probar la aplicación en un dispositivo físico.

¿Por qué?
Los permisos de ubicación (expo-location) funcionan de forma más realista.
La simulación de movimiento en mapas es más fluida.
Algunos sensores y comportamientos no funcionan correctamente en emuladores.
Mejora la precisión del GPS y la experiencia general.

👉 En emuladores:

La ubicación suele ser estática o simulada manualmente.
Puede haber inconsistencias en animaciones y permisos.
🛠 Stack Tecnológico y Librerías Principales
Framework: React Native + Expo (con Expo Router para la navegación).
Mapas: react-native-maps
Estado Global: zustand + @react-native-async-storage/async-storage
Geolocalización: expo-location
Micro-interacciones: expo-haptics, expo-blur
🎨 Arquitectura de Estilos: Enfoque Híbrido (NativeWind + StyleSheet)

Durante el desarrollo de esta aplicación, se utilizó un enfoque híbrido de estilización:

1. Tailwind CSS via NativeWind

Permite maquetado rápido usando className.

<View className="absolute bottom-10 right-6 z-50 items-center space-y-4">
  <TouchableOpacity className="p-4 rounded-full">
    <Ionicons name="list-outline" size={28} color="#4b5563" />
  </TouchableOpacity>
</View>
2. React Native StyleSheet

Más eficiente para vistas base y rendimiento.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

💡 Valor agregado: Se demuestra dominio tanto en velocidad de desarrollo (NativeWind) como en optimización (StyleSheet).

📂 Estructura de Directorios
/
├── app/
├── components/
├── core/
├── data/
└── infraestructure/

Arquitectura pensada para escalabilidad, separando UI, lógica y estado.

📍 Simulación de Rutas Explicada

Para evitar dependencias externas inestables:

Se usan coordenadas reales (GeoJSON).
Se almacenan en HARDCODED_ROUTE.
Se recorren con un setInterval cada 3 segundos.

✅ Resultado:

Sin latencia de red
Sin fallos de API
Animación fluida
💾 Gestión del Estado Local e Historial
Manejo con Zustand
Persistencia con AsyncStorage
Funciones clave:
startTracking()
stopTracking()

Incluye:

Cálculo de distancia (Haversine)
Historial persistente de rutas
