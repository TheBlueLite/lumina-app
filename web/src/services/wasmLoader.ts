// Interfaz que coincide exactamente con las estructuras exportadas de C++
export interface SimulationInput {
  grossRevenue: number;
  gatewayFeePercent: number;
  taxRatePercent: number;
  monthlyExpenses: number;
}

export interface SimulationResult {
  netRevenue: number;
  estimatedTax: number;
  netProfit: number;
  marginPercent: number;
}

export interface LuminaEngineModule {
  FinancialEngine: new () => {
    runSimulation: (input: SimulationInput) => SimulationResult;
  };
}

declare global {
  interface Window {
    Module?: LuminaEngineModule;
  }
}

// Carga asíncrona del módulo WebAssembly
export async function loadLuminaEngine(): Promise<LuminaEngineModule> {
  if (window.Module && window.Module.FinancialEngine) {
    return window.Module;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/wasm/lumina_core.js';
    script.onload = () => {
      // Una vez cargado el script wrapper de Emscripten
      if (window.Module) {
        resolve(window.Module);
      } else {
        reject(new Error('No se pudo inicializar el módulo WebAssembly de Lúmina.'));
      }
    };
    script.onerror = () => reject(new Error('Error al cargar el archivo /wasm/lumina_core.js'));
    document.body.appendChild(script);
  });
}