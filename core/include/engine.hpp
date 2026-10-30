#ifndef LUMINA_ENGINE_HPP
#define LUMINA_ENGINE_HPP

#include <vector>
#include <string>

namespace Lumina {

    struct SimulationInput {
        double grossRevenue;      // Ingresos brutos
        double gatewayFeePercent;  // Comisión de pasarela (ej. Stripe 2.9%)
        double taxRatePercent;    // Retención de impuesto estimado
        double monthlyExpenses;   // Gastos operativos fijos
    };

    struct SimulationResult {
        double netRevenue;        // Ingreso neto tras comisiones
        double estimatedTax;      // Impuesto a reservar
        double netProfit;         // Ganancia neta final
        double marginPercent;     // Margen de beneficio (%)
    };

    class FinancialEngine {
    public:
        FinancialEngine();
        ~FinancialEngine();

        // Realiza el cálculo contable e instantáneo
        SimulationResult runSimulation(const SimulationInput& input);
    };

}

#endif // LUMINA_ENGINE_HPP