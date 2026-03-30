# Documentación del Proyecto: GPS Maps Simulator

## 📌 Descripción General
Aplicación móvil desarrollada con **React Native** y **Expo** que implementa una simulación de seguimiento en tiempo real sobre un mapa. La aplicación dibuja y recorre una ruta con coordenadas reales en la ciudad de Medellín de forma suave e interactiva, mostrando animaciones de marcadores, solicitudes de permisos de ubicación y guardado en historial de rutas finalizadas.

## 🛠 Stack Tecnológico y Librerías Principales
- **Framework:** React Native + Expo (con **Expo Router** para la navegación).
- **Mapas:** `react-native-maps` (para la visualización del mapa, `Polyline` y `Marker`).
- **Estado Global:** `zustand` combinado con persistencia (`@react-native-async-storage/async-storage`).
- **Geolocalización:** `expo-location` para solicitud de permisos y monitoreo del usuario.
- **Micro-interacciones:** `expo-haptics` y `expo-blur` (para efectos visuales de cristal o *glassmorphism*).

---

## 🎨 Arquitectura de Estilos: Enfoque Híbrido (NativeWind + StyleSheet)

Durante el desarrollo de esta aplicación, se utilizó de manera intencional un **enfoque híbrido de estilización** para demostrar el dominio profundo en la creación de interfaces en React Native. Se integraron dos formas de trabajo que coexisten armoniosamente:

### 1. Tailwind CSS via NativeWind
Para un maquetado ágil y composición rápida de UI, se configuró y utilizó **NativeWind**. Esto permite aplicar clases de utilidad directamente en los componentes a través de la propiedad `className`.
* **Caso de Uso en la App:** Se utiliza extensivamente en componentes de interfaz superpuestos, como los botones de acciones (`AsideButtonsActions.tsx`). Permite manejar flexbox, posicionamiento absoluto, tipografía, márgenes y backgrounds translúcidos (junto con `expo-blur`) con código limpio y declarativo.
  ```tsx
  // Ejemplo en AsideButtonsActions.tsx
  <View className="absolute bottom-10 right-6 z-50 items-center space-y-4">
    <TouchableOpacity className="p-4 rounded-full">
      <Ionicons name="list-outline" size={28} color="#4b5563" />
    </TouchableOpacity>
  </View>
  ```

### 2. React Native `StyleSheet` Directo
Existen escenarios donde el uso directo de la API nativa `StyleSheet` es más eficiente, ofrece mejor rendimiento para re-renderizados críticos, o interactúa mejor con componentes de mapa o animaciones.
* **Caso de Uso en la App:** Vistas base, mapas y contenedores principales (por ejemplo, `PrincipalMap.tsx` o `PermissionsScreen`). Al utilizar objetos u hojas de estilos, el framework React Native optimiza su envío por el *bridge* o de manera síncrona en la nueva arquitectura.
  ```ts
  // Ejemplo en PrincipalMap.tsx o Permisos
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
  ```
> **💡 Valor Agregado:** Demostrar el uso de ambas metodologías resalta adaptabilidad técnica: *NativeWind* agiliza el desarrollo de componentes visuales estándar, mientras que *StyleSheet* mantiene el rendimiento fluido y detallado en componentes pesados del mapa.

---

## 📂 Estructura de Directorios

La aplicación sigue una arquitectura escalable, separando UI, lógica y estado:

```text
/
├── app/               # Pantallas y Rutas (Expo Router)
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── map/
│   └── permissions/
├── components/        # Componentes Reutilizables de UI
│   ├── maps/          # (PrincipalMap, AnimatedCarMarker, AsideButtonsActions...)
│   ├── shared/        # (Textos temáticos, botones, FAB...)
│   └── loading/
├── core/              # Lógica de Negocio y Estado Global
│   ├── useLocationStore.ts  # Estado y simulación con Zustand
│   └── utils/               # Matemáticas (distancias de Haversine), rutas
├── data/              # Datos Estáticos
│   └── route.ts       # Coordenadas GEO-JSON hardcodeadas (HARDCODED_ROUTE)
└── infraestructure/   # Interfaces (TypeScript) y Modelos
```

---

## 📍 Simulación de Rutas Explicada
Uno de los principales desafíos fue asegurar que el vehículo siguiera con precisión **las calles reales de la ciudad**. 
En lugar de depender de peticiones HTTP en tiempo de ejecución a servicios externos que suelen estar limitados, caerse o causar bloqueos (ej. OSRM, GraphHopper), se resolvió:
1. Extraer los datos geoespaciales reales (GeoJSON) de un motor de mapeo confiable.
2. Almacenar temporalmente los *waypoints* en el archivo `data/route.ts` (`HARDCODED_ROUTE`).
3. El store de estado global iterará sobre cada punto con un timer cada **3 segundos**, actualizando instántaneamente el mapa usando `setState` (sin parpadeos de red ni carga).

## 💾 Gestión del Estado Local e Historial
La tienda global creada con Zustand no solo gestiona la coordenada activa, sino el ciclo de vida de la simulación:
* `startTracking()` y `stopTracking()` controlan ciclos asíncronos (`setInterval`).
* Los cálculos matemáticos (distancia de *Haversine*) miden silenciosamente el trayecto.
* Gracias al middleware persist, las rutas completadas escapan el ciclo de vida de la memoria RAM, almacenándose permanentemente vía `AsyncStorage`. Cada vez que el usuario abre la aplicación, su historial de rutas anteriores sigue allí.
