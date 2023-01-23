// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastosListado = document.querySelector("#gastos ul");
let presupuesto;

//Eventos
evenListeners();
function evenListeners () {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto)
}

// Clases
class Presupuesto {
    constructor (presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto (gasto) {
        this.gastos = [ ...this.gastos, gasto ];
        this.calcularRestante();
    }
    calcularRestante () {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto (id) {
        this.gastos = this.gastos.filter(gasto => gasto.id != id);
        this.calcularRestante();
    }
}
class UI {

    insertarPresupuesto (cantidad) {
        const { presupuesto, restante } = cantidad;
        document.querySelector("#total").textContent = presupuesto + " €";
        document.querySelector("#restante").textContent = restante + " €";
    }
    imprimirAlerta (mensaje, tipo) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", 'alert');
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    mostrarGastos (gastos) {
        this.limpiarHTML(); // Elimina el html previo
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;
            //Crear li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.setAttribute("data-id", id);
            // ? nuevoGasto.dataset.id = id; hace los mismo que el código de arriba.
            //Agregar el HTML del gasto innerHTML no es una buena forma de hacerlo pero es más rápida
            nuevoGasto.innerHTML = `${ nombre }<span class="badge badge-primary badge-pill"> - ${ cantidad } €</span>`;

            // Botón para borrar
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = "borrar";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
    }
    actualizarRestante (restante) {
        document.querySelector("#restante").textContent = restante + " €";
    }
    comprobarPresupuesto (presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");
        const frase = document.createElement("p");
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add("alert-danger");
            frase.textContent = "¡¡ Por debajo del 75% !!";
            frase.classList.add("frase", "text-center");
            restanteDiv.appendChild(frase);
            setTimeout(() => {
                frase.remove();
            }, 3000);
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add("alert-warning");
            frase.textContent = "¡¡ Por debajo del 50% !!";
            frase.classList.add("frase", "text-center");
            restanteDiv.appendChild(frase);
            setTimeout(() => {
                frase.remove();
            }, 3000);
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add("alert-success");
        }

        if (restante <= 0) {
            ui.imprimirAlerta('El saldo se ha agotado', 'error');
            formulario.querySelector('buttom[type = "submit"]').disabled = true;

        }
    }
    limpiarHTML () {
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }
}
//Instancias
const ui = new UI();

// Funciones
function preguntarPresupuesto () {
    const presupuestoUsuario = prompt("¿Cuál es tu presupuesto?");
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}
function agregarGasto (e) {
    e.preventDefault();

    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no válida", 'error');
        return;
    }
    //Genera un nuevo objeto con el gasto 
    const gasto = { nombre, cantidad, id: Date.now() };
    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    //Mensaje de correcto
    ui.imprimirAlerta('Gasto agregado correctamente');
    // Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    //reiniciar formulario
    formulario.reset();
}
function eliminarGasto (id) {
    //Elimina gastos del objeto
    presupuesto.eliminarGasto(id);
    //Elimina gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}