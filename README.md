# Documentación del Proyecto: React Native Maps Simulador GPS

## 📌 Descripción General
Aplicación móvil desarrollada con React Native y Expo que implementa una simulación avanzada de seguimiento de ruta en un mapa en tiempo real. La plataforma dibuja interactivamente una trayectoria basándose en coordenadas geográficas precisas ubicadas en Medellín, simulando el recorrido progresivo a través de micro-animaciones, registro de distancias iterativo y administración global de historial asistido con Zustand.

---

## 🚀 Guía de Instalación y Entorno de Ejecución

> [!IMPORTANT]  
> **Recomendación de Pruebas: DISPOSITIVO FÍSICO**  
> Para tener la mejor experiencia interactiva evaluando este componente, se recomienda encarecidamente probar y compilar en un dispositivo móvil físico ejecutando *Expo Go*. Ciertas características *core* y de experiencia de usuario (Ej: Geolocalización nativa mediante `expo-location`, retroalimentación de vibración provista por `expo-haptics`, o el propio motor de render de `react-native-maps`) operan con fallas, restricciones o son inutilizables desde emuladores convencionales de PC.

### Requisitos Relativos
- Node.js versión superior a 18+.
- La aplicación **Expo Go** instalada y lista en el celular (iOS o Android).

### Inicialización Local
1. Ingresa a la carpeta o clona el repositorio del proyecto:
   ```bash
   git clone <URL_REPOSITORIO> // en caso de ser necesario
   cd maps-test
   ```
2. Instala y configura todos los módulos:
   ```bash
   npm install
   ```
3. Limpia posibles cachés y arranca el entorno en desarrollo de Metro:
   ```bash
   npx expo start --clear
   ```
4. Con tu dispositivo móvil conectado a la misma red WiFi, abre la cámara interactiva (iOS) o la opción directa dentro de **Expo Go** (Android) y escanea el código **QR** que arroja la terminal.

---

## 🎨 Demostración Híbrida de Estilos y UI 
Con el objetivo de mostrar polivalencia a la hora de estructurar vistas complejas en React Native, fue decidido emplear dos flujos estéticos que coexisten:

1. **NativeWind (Tailwind CSS en entorno React Native)**
   Se usó preferentemente a lo largo y ancho en los paneles emergentes de botones que interactúan en tiempo real por el sistema como (*`AsideButtonsActions.tsx`*) permitiendo escribir micro-interacciones de Flexbox, tipografía interactiva translúcida o colores condicionales atando directamente los *utility strings* a través de atributos declarativos `className`. 
2. **Framework Native - StyleSheet API**
   Usados especialmente para vistas raíces (`SafeAreaView`), pantallas principales con manejo de elevación, sombras y mapas a escala natural (`PrincipalMap.tsx`). Un objeto primitivo empaqueta de forma inmutable el requerimiento base optimizando su acceso sin puente a C++. 

> 💡 **Nota a la vista:** Intercambiar activamente esta mecánica durante el desarrollo de microcomponentes vs contenedores madre demuestran experticia y madurez tanto en el *tooling* moderno (Tailwind) como en el soporte nativo base (Styles)

---

## 📍 Arquitectura del Simulador Sin Interrupción (GeoJSON Static)
Durante etapas alfa el simulador trazaba interacciones hacia APIs libres públicas (OpenStreetMap/OSRM) que resultaron estar plagadas de inconsistencias por tasa o bloqueos CROS remotos.
Para certificar que el modelo jamás pierda visibilidad o se cicle eternamente evaluando una simulación: 
* Reemplacé y volqué geográficamente las calles exactas de la demostración hacia el archivo constante `./data/route.ts` (*Hardcoded Waypoints*). 
* La store central `useLocationStore` desencadena un timer interno por intervalos de **3 segundos**, actualizando las capas cartesianas y sumando iteraciones geológicas hasta abarcar los 43 waypoints. Todo el proceso corre con inmediatez sincrónica de UI, **sin el menor asomo de redes caídas.**

## 💾 Modelado y Memoria con Zustand
El modelo base corre un `store` de la dependencia Zustand encargándose de sostener toda la app con fluidez:
- A cada instante registra las distancias en metros (fórmula lograda separando un helper `distance.ts` basado en el enfoque *Haversine*), monitoreando cada movimiento de marker en el layout.
- Integra nativamente **`AsyncStorage`** mediante el wrapper middleware de zustand `persist`. Por ende, finalizar un rastreo guarda en un objeto final este recorrido para estar accesible permanentemente como una tarjeta interactiva, perdurando incluso cerrando bruscamente Expo Go temporalmente.
