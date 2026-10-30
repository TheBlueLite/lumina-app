#include <emscripten/bind.h>
#include "../include/engine.hpp"

using namespace emscripten;
using namespace Lumina;

EMSCRIPTEN_BINDINGS(lumina_core_module) {
    // Registramos la estructura de entrada (Input)
    value_object<SimulationInput>("SimulationInput")
        .field("grossRevenue", &SimulationInput::grossRevenue)
        .field("gatewayFeePercent", &SimulationInput::gatewayFeePercent)
        .field("taxRatePercent", &SimulationInput::taxRatePercent)
        .field("monthlyExpenses", &SimulationInput::monthlyExpenses);

    // Registramos la estructura de salida (Result)
    value_object<SimulationResult>("SimulationResult")
        .field("netRevenue", &SimulationResult::netRevenue)
        .field("estimatedTax", &SimulationResult::estimatedTax)
        .field("netProfit", &SimulationResult::netProfit)
        .field("marginPercent", &SimulationResult::marginPercent);

    // Registramos la clase del motor contable
    class_<FinancialEngine>("FinancialEngine")
        .constructor<>()
        .function("runSimulation", &FinancialEngine::runSimulation);
}