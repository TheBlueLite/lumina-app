#include "../include/engine.hpp"

namespace Lumina {

    FinancialEngine::FinancialEngine() {}
    FinancialEngine::~FinancialEngine() {}

    SimulationResult FinancialEngine::runSimulation(const SimulationInput& input) {
        SimulationResult result;

        // 1. Descuento de comisiones de pasarela de pago
        double gatewayFee = input.grossRevenue * (input.gatewayFeePercent / 100.0);
        result.netRevenue = input.grossRevenue - gatewayFee;

        // 2. Cálculo de retención de impuestos sobre el ingreso neto
        result.estimatedTax = result.netRevenue * (input.taxRatePercent / 100.0);

        // 3. Ganancia neta tras impuestos y gastos fijos
        result.netProfit = result.netRevenue - result.estimatedTax - input.monthlyExpenses;

        // 4. Margen porcentual
        if (input.grossRevenue > 0) {
            result.marginPercent = (result.netProfit / input.grossRevenue) * 100.0;
        } else {
            result.marginPercent = 0.0;
        }

        return result;
    }

}