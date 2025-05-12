
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
