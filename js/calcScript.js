// Função que limpa o display
function clearDisplay() {
    document.getElementById("calcInput").value = "";
}

// Função que deleta o ultimo valor adicionado
function deleteLast() {
    let display = document.getElementById("calcInput");
    display.value = display.value.slice(0, -1);
}

// Função que adiciona o valor à tela
function appendValue(value) {
    document.getElementById("calcInput").value += value;
}

function calculate() {
    
    let calcOutput = document.getElementById("calcInput");
    
    // Obtém a expressão diretamente do campo de entrada
    let expression = document.getElementById("calcInput").value;

    console.log("botao pressionado. Expressao: ", expression, "Saida: ", calcOutput);
    // Limpa o display de saída antes de iniciar
    calcOutput.value = "";

    // Resolve os parênteses primeiro
    expression = resolveParentheses(expression);
    
    // Resolve operações na ordem
    expression = resolveOperations(expression, ['!', 'ê', 'r', 'ş', 'ç', 'ţ', 'l', 'ł']);
    expression = resolveOperations(expression, ['*', '/', '%', 'ř']);
    expression = resolveOperations(expression, ['+', '-']);
    
    // Exibe apenas o resultado final
    calcOutput.value = expression;
}

function resolveParentheses(expression) {
    const regex = /\(([^()]+)\)/;
    while (regex.test(expression)) {
        expression = expression.replace(regex, (match, subExpr) => {
            return resolveOperations(subExpr, ['!', 'ê', 'r', 'ş', 'ç', 'ţ', 'l', 'ł', '*', '/', '%', 'ř','+', '-']);
        });
    }
    return expression;
}

function resolveOperations(expression, operators) {
    
    expression = expression.replace(/(-?\d+(\.\d+)?)\s*([%şçţł!])/g, (match, n1, _, operator) => {
        let result;
        switch (operator) {
            // Porcentagem
            case '%': result = parseFloat(n1) / 100; break;

            // Seno
            case 'ş': result = Math.sin(parseFloat(n1)); break;

            // Cosseno
            case 'ç': result = Math.cos(parseFloat(n1)); break;

            // Tangente
            case 'ţ': result = Math.tan(parseFloat(n1)); break;

            // Logaritmo natural
            case 'ł': result = Math.log(parseFloat(n1)); break;
            
            case "!":
                if(parseFloat(n1) <= 1 || !Number.isInteger(parseFloat(n1))) {
                    result = 1;
                    console.log("Número inválido, permitido apenas valores inteiros.");
                }
                else {
                    let n = 1;
                    for(let i=0; i<n1; i++) {
                        n *= n1-i;
                    }

                    result = n;
                }
            break;

            // Caso inesperado (não deveria ocorrer)
            default: result = n1; 
        }

        return result;
    });

    // Regex para encontrar operações binárias (com dois operandos)
    const regex = new RegExp(`(-?\\d+(\\.\\d+)?)\\s*([${operators.join('')}])\\s*(-?\\d+(\\.\\d+)?)`);

    while (regex.test(expression)) {
        expression = expression.replace(regex, (match, n1, _, operator, n2) => {
            let result;
            let num1 = parseFloat(n1);
            let num2 = parseFloat(n2);

            // Multiplicação
            if (operator === '*') {
                result = num1 * num2;
            } 
            // Divisão
            else if (operator === '/') {
                result = num1 / num2; 
            }
            // Adição
            else if (operator === '+') {
                result = num1 + num2;
            } 
            // Subtração
            else if (operator === '-') {
                result = num1 - num2;
            }
            // Raiz Enésima
            else if (operator === 'r') {
                result = Math.pow(num2, 1 / num1);
            } 
            // Potência
            else if (operator === 'ê') {
                result = Math.pow(num1, num2); // Potência
            } 
            // Resto de divisão
            else if (operator === 'ř') {
                result = num1 % num2;
            } 
            // Logaritmo de n1 na base n2
            else if (operator === 'l') {
                result = (num2 > 0 && num2 !== 1) ? (Math.log(num1) / Math.log(num2)) : "Erro";
            } 
            // Caso inesperado
            else {
                result = "erro";
            }

            return result;
        });
    }

    return expression;
}


// Eventlisteners para identificar quais teclas estão sendo clicadas e quais funções elas precisam chamar
document.addEventListener("keydown", function(event) {
    // Tecla enter
    if (event.key === "Enter") {
        // Função que impede que valores sejam inseridos quando a tecla é pressionada
        event.preventDefault();
        calculate(); // Chama a função de cálculo quando Enter for pressionado
    }
    // Tecla ESC
    if (event.key === "Escape") {
        event.preventDefault();
        clearDisplay(); // Chama a função de cálculo quando Enter for pressionado
    }
    // Tecla Backspace
    if (event.key === "Backspace") {
        event.preventDefault();
        deleteLast(); // Chama a função de cálculo quando Enter for pressionado
    }
});