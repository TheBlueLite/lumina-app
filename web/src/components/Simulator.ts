import { loadLuminaEngine, SimulationInput, SimulationResult } from '../services/wasmLoader';

export class LuminaSimulator {
  private container: HTMLElement;
  private engineInstance: any = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Contenedor #${containerId} no encontrado.`);
    this.container = el;
    this.init();
  }

  private async init() {
    this.renderLoading();
    try {
      const module = await loadLuminaEngine();
      this.engineInstance = new module.FinancialEngine();
      this.renderApp();
      this.attachEvents();
    } catch (err) {
      this.engineInstance = {
        runSimulation: (input: SimulationInput): SimulationResult => {
          const gatewayFee = input.grossRevenue * (input.gatewayFeePercent / 100.0);
          const netRevenue = input.grossRevenue - gatewayFee;
          const estimatedTax = netRevenue * (input.taxRatePercent / 100.0);
          const netProfit = netRevenue - estimatedTax - input.monthlyExpenses;
          const marginPercent = input.grossRevenue > 0 ? (netProfit / input.grossRevenue) * 100.0 : 0;
          return { netRevenue, estimatedTax, netProfit, marginPercent };
        }
      };
      this.renderApp();
      this.attachEvents();
    }
  }

  private renderLoading() {
    this.container.innerHTML = `
      <div style="background: #030712; color: #3B82F6; padding: 2rem; font-family: monospace; border-radius: 8px; border: 1px solid #1F2937;">
        CARGANDO MOTOR CONTABLE C++...
      </div>
    `;
  }

  private renderApp() {
    this.container.innerHTML = `
      <div style="background: #030712; color: #F9FAFB; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; border-radius: 12px; max-width: 600px; border: 1px solid #1F2937;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="color: #3B82F6; margin: 0; font-size: 1.25rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
            Lúmina | Simulador Financiero
          </h2>
          <span style="font-size: 0.75rem; background: #1E293B; color: #94A3B8; padding: 4px 8px; border-radius: 4px; font-family: monospace;">v1.0-WASM</span>
        </div>
        <p style="color: #9CA3AF; font-size: 0.85rem; margin-top: 6px;">Cálculo en tiempo real mediante núcleo compilado C++</p>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
          <label>
            <span style="display:block; font-size: 0.8rem; color: #9CA3AF; text-transform: uppercase; font-weight: 500;">Ingresos Brutos ($)</span>
            <input type="number" id="grossRevenue" value="10000" style="width: 100%; background: #111827; border: 1px solid #374151; color: #fff; padding: 0.65rem; border-radius: 6px; margin-top: 4px; font-family: monospace; box-sizing: border-box;">
          </label>

          <label>
            <span style="display:block; font-size: 0.8rem; color: #9CA3AF; text-transform: uppercase; font-weight: 500;">Comisión Pasarela (%)</span>
            <input type="number" id="gatewayFeePercent" value="2.9" step="0.1" style="width: 100%; background: #111827; border: 1px solid #374151; color: #fff; padding: 0.65rem; border-radius: 6px; margin-top: 4px; font-family: monospace; box-sizing: border-box;">
          </label>

          <label>
            <span style="display:block; font-size: 0.8rem; color: #9CA3AF; text-transform: uppercase; font-weight: 500;">Retención de Impuestos (%)</span>
            <input type="number" id="taxRatePercent" value="15" step="1" style="width: 100%; background: #111827; border: 1px solid #374151; color: #fff; padding: 0.65rem; border-radius: 6px; margin-top: 4px; font-family: monospace; box-sizing: border-box;">
          </label>

          <label>
            <span style="display:block; font-size: 0.8rem; color: #9CA3AF; text-transform: uppercase; font-weight: 500;">Gastos Operativos Fijos ($)</span>
            <input type="number" id="monthlyExpenses" value="1200" style="width: 100%; background: #111827; border: 1px solid #374151; color: #fff; padding: 0.65rem; border-radius: 6px; margin-top: 4px; font-family: monospace; box-sizing: border-box;">
          </label>
        </div>

        <hr style="border: 0; border-top: 1px solid #1F2937; margin: 1.5rem 0;">

        <div id="resultsPanel" style="background: #0B0F19; padding: 1.25rem; border-radius: 8px; border: 1px solid #1E293B;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div>
              <span style="font-size: 0.7rem; color: #6B7280; text-transform: uppercase; font-weight: 600;">Ingreso Neto</span>
              <p id="resNetRevenue" style="margin: 4px 0 0 0; font-size: 1.2rem; font-weight: 600; color: #F3F4F6; font-family: monospace;">$0.00</p>
            </div>
            <div>
              <span style="font-size: 0.7rem; color: #6B7280; text-transform: uppercase; font-weight: 600;">Estimado Impuestos</span>
              <p id="resEstimatedTax" style="margin: 4px 0 0 0; font-size: 1.2rem; font-weight: 600; color: #F87171; font-family: monospace;">$0.00</p>
            </div>
            <div>
              <span style="font-size: 0.7rem; color: #6B7280; text-transform: uppercase; font-weight: 600;">Ganancia Neta</span>
              <p id="resNetProfit" style="margin: 4px 0 0 0; font-size: 1.35rem; font-weight: 600; color: #FACC15; font-family: monospace;">$0.00</p>
            </div>
            <div>
              <span style="font-size: 0.7rem; color: #6B7280; text-transform: uppercase; font-weight: 600;">Margen de Beneficio</span>
              <p id="resMarginPercent" style="margin: 4px 0 0 0; font-size: 1.35rem; font-weight: 600; color: #34D399; font-family: monospace;">0.0%</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.calculate();
  }

  private attachEvents() {
    const inputs = ['grossRevenue', 'gatewayFeePercent', 'taxRatePercent', 'monthlyExpenses'];
    inputs.forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => this.calculate());
    });
  }

  private calculate() {
    if (!this.engineInstance) return;

    const inputData: SimulationInput = {
      grossRevenue: parseFloat((document.getElementById('grossRevenue') as HTMLInputElement).value) || 0,
      gatewayFeePercent: parseFloat((document.getElementById('gatewayFeePercent') as HTMLInputElement).value) || 0,
      taxRatePercent: parseFloat((document.getElementById('taxRatePercent') as HTMLInputElement).value) || 0,
      monthlyExpenses: parseFloat((document.getElementById('monthlyExpenses') as HTMLInputElement).value) || 0,
    };

    const res: SimulationResult = this.engineInstance.runSimulation(inputData);

    document.getElementById('resNetRevenue')!.innerText = `$${res.netRevenue.toFixed(2)}`;
    document.getElementById('resEstimatedTax')!.innerText = `$${res.estimatedTax.toFixed(2)}`;
    document.getElementById('resNetProfit')!.innerText = `$${res.netProfit.toFixed(2)}`;
    document.getElementById('resMarginPercent')!.innerText = `${res.marginPercent.toFixed(1)}%`;
  }
}