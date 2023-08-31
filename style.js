class Producto {
    constructor({ id, nombre, precio, descripcion, img }) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.descripcion = descripcion
        this.img = img
    }

    aumentarCantidad() {
        this.cantidad++
    }

    disminuirCantidad() {
        if (this.cantidad > 1) {
            this.cantidad--
            return true
        }

        return false
    }

    
}

class Carrito {
    constructor() {
        this.listacarrito = []
        this.contenedor_carrito = document.getElementById('contenedor_carrito')
        this.total = document.getElementById('total')
        this.finalizar_compra = document.getElementById("finalizar_compra")
        this.llaveStorage = "listacarrito"
    }

    levantarStorage() {
        this.listacarrito = JSON.parse(localStorage.getItem(this.llaveStorage)) || []

        if (this.listacarrito.length > 0) {
            let listaAuxiliar = []

            for (let i = 0; i < this.listacarrito.length; i++) {

                let productoBis = new Producto(this.listacarrito[i])
                listaAuxiliar.push(productoBis)


            }

            this.listacarrito = listaAuxiliar
        }
    }
    guardarStorage() {
        let listaCarritoJSON = JSON.stringify(this.listacarrito)
        localStorage.setItem(this.llaveStorage, listaCarritoJSON)
    }

    agregar(productoNuevo) {
        let existeElProducto = this.listacarrito.some(producto => producto.id == productoNuevo.id)

        if (existeElProducto) {
            let producto = this.listacarrito.find(producto => producto.id == productoNuevo.id)
            producto.cantidad = producto.cantidad + 1
        } else {
            this.listacarrito.push(productoNuevo)
        }
    }

    eliminar(productoEliminado) {
        let producto = this.listacarrito.find(producto => producto.id == productoEliminado.id)
        let indice = this.listacarrito.indexOf(producto)
        this.listacarrito.splice(indice, 1)

    }

    limpiarContenedorCarrito() {
        this.contenedor_carrito.innerHTML = ""
    }

    ver() {

        this.contenedor_carrito.innerHTML = ""

        this.listacarrito.forEach(producto => {
            contenedor_carrito.innerHTML += producto.descripcionCarrito()
        })

        this.listacarrito.forEach(producto => {
            let eliminar_btn = document.getElementById(`eliminar-${producto.id}`)
            let total = document.getElementById('total')

            let btn_plus = document.getElementById(`plus-${producto.id}`)
            let btn_minus = document.getElementById(`minus-${producto.id}`)

            eliminar_btn.addEventListener("click", () => {
                this.eliminar(producto)
                this.guardarStorage()
                this.ver()
            })

            btn_plus.addEventListener("click", () => {
                producto.aumentarCantidad()
                this.ver()
            })

            btn_minus.addEventListener("click", () => {
                if (producto.disminuirCantidad()) {
                    this.ver()
                }
            })
        })

        total.innerHTML = "Precio final de su compra: $" + this.calcular_total()

    }



    calcular_total() {
        return this.listacarrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0)
    }

    eventoFinalizarCompra() {
        this.finalizar_compra.addEventListener("click", () => {

            if (this.listacarrito.length > 0) {
                let precio_total = this.calcular_total()

                this.listacarrito = []

                localStorage.removeItem(this.llaveStorage)

                this.limpiarContenedorCarrito()

                let mensaje = ""

                if (precio_total === 0) {
                    mensaje = "Muchas gracias por visitar nuestra página!";
                } else if (precio_total <= 40000) {
                    mensaje = "Muchas gracias! Tienes un 10% de descuento en tu próxima compra!";
                } else if (precio_total <= 49999) {
                    mensaje = "Muchas gracias! Tienes un 20% de descuento en tu próxima compra!";
                } else if (precio_total <= 1000000) {
                    mensaje = "Muchas gracias! Tienes un 25% de descuento en tu próxima compra!";
                } else {
                    mensaje = "Muchas gracias por visitar nuestra página!";
                }

                this.contenedor_carrito.innerHTML = mensaje
                this.total.innerText = 'Precio final de su compra actual: $' + precio_total
            } else {
                this.contenedor_carrito.innerHTML = '<h3 class="text-center">Gracias por visitar nuestra pagina!</h3>'
            }

        })
    }

}

class Productocontrolador {
    constructor() {
        this.listaproductos = []
    }

    agregar(producto) {
        this.listaproductos.push(producto)
    }

    verProductos() {
        let mis_productos = document.getElementById("mis_productos")

        this.listaproductos.forEach(producto => {
            mis_productos.innerHTML += producto.descripcionHTML()
        })

        this.listaproductos.forEach(producto => {
            const boton = document.getElementById(`pro${producto.id}`)
            boton.addEventListener("click", () => {
                carrito.agregar(producto)
                carrito.guardarStorage()
                carrito.ver()
                Toastify({
                    text: "Su producto fue añadido al carrito",
                    duration: 2000,
                    gravity: "bottom", 
                    position: "right", 
                    style: {
                        background: "#855235",
                    },
                }).showToast();
            }
            )
        })
    }

}




fetch("archivo.json")
.then(resp => resp.json())
.then(listaproductos => {
    render(listaproductos)
})


function render(arr){
    let mis_productos = document.getElementById("mis_productos")
    arr.forEach(producto => {
        mis_productos.innerHTML+= `<div class="div-uno" style="width: 16rem;" gap-5>
        <img src="${producto.img}" class="card-img-top" >
        <div class="card-uno">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>${producto.descripcion}</p>
            <button id="pro${producto.id}">Buy Now</button>
        </div>
        </div>
        ` 
    })
}


const carrito = new Carrito()
carrito.levantarStorage()
carrito.ver()
carrito.eventoFinalizarCompra()



const controlador_productos = new Productocontrolador()


controlador_productos.verProductos()