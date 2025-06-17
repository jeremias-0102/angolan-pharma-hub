
/// <reference types="vite/client" />

// Google API type definitions
interface Window {
  google?: {
    maps: {
      Map: new (element: HTMLElement, options: any) => any;
      Marker: new (options: any) => any;
      MapOptions?: any;
    },
    accounts: {
      id: {
        initialize: (config: any) => void;
        prompt: (callback?: (notification: any) => void) => void;
        renderButton: (element: HTMLElement, config: any) => void;
        revoke: (email: string, callback: () => void) => void;
      };
    };
  }
}

// Adding namespace for the google types to include both maps and accounts
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: any);
    }
    class Marker {
      constructor(options: any);
      setMap(map: Map | null): void;
    }
    interface MapOptions {
      center: { lat: number; lng: number };
      zoom: number;
    }
  }
  
  namespace accounts {
    namespace id {
      function initialize(config: any): void;
      function prompt(callback?: (notification: any) => void): void;
      function renderButton(element: HTMLElement, config: any): void;
      function revoke(email: string, callback: () => void): void;
    }
  }
}
