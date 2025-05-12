
/// <reference types="vite/client" />

// Google Maps API type definitions
interface Window {
  google?: {
    maps: {
      Map: new (element: HTMLElement, options: any) => any;
      Marker: new (options: any) => any;
    }
  }
}

// Adding namespace for the google maps types
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: any);
    }
    class Marker {
      constructor(options: any);
    }
  }
}
