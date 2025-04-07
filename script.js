 // Referencias a elementos del DOM (mantener las que ya existen en el código)
 document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
        const creditForm = document.getElementById('creditForm');
        const creditType = document.getElementById('creditType');
        const aportes = document.getElementById('aportes');
        const amount = document.getElementById('amount');
        const term = document.getElementById('term');
        const frequency = document.getElementById('frequency');
        const interestRate = document.getElementById('interestRate');
        const alertContainer = document.getElementById('alertContainer');
        const alertContaine2 = document.getElementById('alertContaine2');
        const resultContainer = document.getElementById('resultContainer');
        const amortizationBody = document.getElementById('amortizationBody');
        const printButton = document.getElementById('printButton');
    
    // Referencias a elementos de resumen
        const summaryAmount = document.getElementById('summaryAmount');
        const summaryTerm = document.getElementById('summaryTerm');
        const summaryRate = document.getElementById('summaryRate');
        const summaryPayment = document.getElementById('summaryPayment');
        const summaryTotal = document.getElementById('summaryTotal');
        const summaryInterest = document.getElementById('summaryInterest');
    

        printButton.style.display = 'none';
    // Configuración de tasas y plazos por tipo de crédito
    const creditConfig = {
        libre_inversion: {
            rate: 1.49,
            multiplier: 2,
            name: "Libre Inversión",
            ranges: [
                { max: 3000000, term: 24 },
                { max: 5000000, term: 36 },
                { max: 7000000, term: 48 },
                { max: Infinity, term: 60 }
            ]
        },
        especial: {
            rate: 1.69,
            multiplier: 2.5,
            name: "Especial",
            ranges: [
                { max: 4500000, term: 24 },
                { max: 6750000, term: 36 },
                { max: 9000000, term: 48 },
                { max: 12000000, term: 60 },
                { max: Infinity, term: 72 }
            ]
        },
        vehiculo: {
            rate: 1.29,
            multiplier: 2.5,
            name: "Vehículo",
            ranges: [
                { max: 4500000, term: 24 },
                { max: 6750000, term: 36 },
                { max: 9000000, term: 48 },
                { max: 12000000, term: 60 },
                { max: Infinity, term: 72 }
            ]
        },
        vivienda: {
            rate: 0.99,
            multiplier: 2.5,
            name: "Vivienda",
            ranges: [
                { max: 6000000, term: 24 },
                { max: 9000000, term: 36 },
                { max: 12000000, term: 48 },
                { max: Infinity, term: 72 }
            ]
        },
        educacion: {
            rate: 0.99,
            multiplier: 2.5,
            name: "Educación",
            ranges: [
                { max: 10000000, term: 6 }
            ]
        },
        garantia: {
            rate: 1.80,
            multiplier: 2.5,
            name: "Garantía",
            ranges: [
                { max: 10000000, term: 6 }
            ]
        },
        impuestos: {
            rate: 1.10,
            multiplier: 1, // Este será variable según facturas
            name: "Impuestos al Día",
            ranges: [
                { max: Infinity, term: 12 }
            ]
        }
    };

    // Evento de cambio en el tipo de crédito
    creditType.addEventListener('change', function() {
        // Actualizar tasa de interés según el tipo seleccionado
        if (this.value) {
            interestRate.value = creditConfig[this.value].rate;
            // Limpiar mensajes de alerta
            clearAlerts();
            // Validar los campos actuales
            if (amount.value && term.value && aportes.value) {
                validateCreditRequest();
            }
        }
    });

    // Evento de cambio en el monto
    amount.addEventListener('input', function() {
        if (creditType.value && term.value && aportes.value) {
            validateCreditRequest();
        }
    });

    // Evento de cambio en el plazo
    term.addEventListener('input', function() {
        if (creditType.value && amount.value && aportes.value) {
            validateCreditRequest();
        }
    });

    // Evento de cambio en los aportes
    aportes.addEventListener('input', function() {
        if (creditType.value && amount.value && term.value) {
            validateCreditRequest();
        }
    });

    // Función para limpiar alertas
    function clearAlerts() {
        alertContainer.innerHTML = '';
    }
     // Función para limpiar alertas
     function clearAlerts2() {
        alertContaine2.innerHTML = '';
    }

    // Función para mostrar alerta
    function showAlert(message, type = 'danger') {
        clearAlerts();
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Función para mostrar alerta
    function showAlert2(message, type ) {
        alertContaine2.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    function formatearCOP(valor) {
        return valor.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Función para validar la solicitud de crédito
    function validateCreditRequest() {
        clearAlerts();
        
        const selectedType = creditType.value;
        const config = creditConfig[selectedType];
        const currentAmount = parseFloat(amount.value);
        const currentTerm = parseInt(term.value);
        const currentAportes = parseFloat(aportes.value);
        
        if (!selectedType || !config || isNaN(currentAmount) || isNaN(currentTerm) || isNaN(currentAportes)) {
            return false;
        }

        // Validación del monto máximo según aportes
        const maxAmount = currentAportes * config.multiplier;
        if (currentAmount > maxAmount) {
            showAlert(`El monto solicitado ($${currentAmount.toLocaleString()}) excede su capacidad de endeudamiento. Para crédito ${config.name}, el máximo es ${config.multiplier} veces el valor de sus aportes: $${maxAmount.toLocaleString()}`);
            return true;
        }
        
        // Encontrar el rango correspondiente al monto
        const applicableRange = config.ranges.find(range => currentAmount <= range.max);
        
        if (!applicableRange) {
            showAlert(`No se encontró un rango aplicable para el monto solicitado.`);
            // Mostrar mensaje de éxito si todo está bien
            return true;
        }
        
        // Validación del plazo según el monto
        if (currentTerm > applicableRange.term) {
            showAlert(`El plazo seleccionado (${currentTerm} meses) excede el plazo máximo permitido para un crédito de $${currentAmount.toLocaleString()}. El plazo máximo es de ${applicableRange.term} meses.`);
            // Mostrar mensaje de éxito si todo está bien
            return true;
        }
       
    }

    // Evento de envío del formulario
    creditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar antes de calcular
        if ( validateCreditRequest()) {
            calculateLoan();
            printButton.style.display = '';
        } else {
            // Ocultar resultados si la validación falla
            resultContainer.style.display = 'none';
        }
    });

    // Función para calcular el préstamo
    function calculateLoan() {
        // Obtener valores del formulario
        const selectedType = creditType.value;
        const loanAmount = parseFloat(amount.value);
        const loanTerm = parseInt(term.value);
        const rate = parseFloat(interestRate.value) / 100;
        const paymentFreq = frequency.value;
        
        // Ajustar frecuencia de pago
        let adjustedRate = rate;
        let numberOfPayments = loanTerm;
        
        if (paymentFreq === 'quincenal') {
            adjustedRate = rate / 2;
            numberOfPayments = loanTerm * 2;
        }
        
        // Calcular cuota
        const payment = loanAmount * (adjustedRate * Math.pow(1 + adjustedRate, numberOfPayments)) / (Math.pow(1 + adjustedRate, numberOfPayments) - 1);
        clearAlerts2();
        showAlert2(`Recuerde que esta cotización es un aproximado <b>TODO CRÉDITO ESTARÁ SUJETO A LA CAPACIDAD DE ENDEUDAMIENTO DE CADA ASOCIADO.</b>`, 'warning');
        
        // Generar tabla de amortización
        let remainingBalance = loanAmount;
        let totalInterest = 0;
        let amortizationHTML = '';
        
        for (let i = 1; i <= numberOfPayments; i++) {
            const interestPayment = remainingBalance * adjustedRate;
            const principalPayment = payment - interestPayment;
            remainingBalance -= principalPayment;
            
            totalInterest += interestPayment;
            
            amortizationHTML += `
                <tr>
                    <td>${i}</td>
                    <td>$${payment.toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                    <td>$${interestPayment.toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                    <td>$${principalPayment.toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                    <td>$${Math.max(0, remainingBalance).toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                </tr>
            `;
        }
        
        // Actualizar la tabla
        amortizationBody.innerHTML = amortizationHTML;
        
        // Actualizar resumen
        summaryAmount.textContent = `$${loanAmount.toLocaleString('es-CO', {maximumFractionDigits: 0})}`;
        summaryTerm.textContent = `${loanTerm} meses`;
        summaryRate.textContent = `${interestRate.value}%`;
        summaryPayment.textContent = `$${payment.toLocaleString('es-CO', {maximumFractionDigits: 0})}`;
        summaryTotal.textContent = `$${(loanAmount + totalInterest).toLocaleString('es-CO', {maximumFractionDigits: 0})}`;
        summaryInterest.textContent = `$${totalInterest.toLocaleString('es-CO', {maximumFractionDigits: 0})}`;
        
        // Mostrar resultados
        resultContainer.style.display = 'block';
        
        // Desplazarse a la sección de resultados
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
});

document.getElementById("printButton").addEventListener("click", function () {
    window.print();
  });