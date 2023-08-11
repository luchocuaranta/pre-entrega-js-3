class Producto {
    constructor({id, nombre, precio, descripcion, img}) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.descripcion = descripcion
        this.img = img
    }

    aumentarCantidad(){
        this.cantidad++
    }

    disminuirCantidad(){
        if(this.cantidad > 1){
            this.cantidad--
            return true
        }

        return false
    }

    descripcionCarrito(){
        return `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${this.img}" class="img-fluid rounded-start class="chau"" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">Cantidad: <button id="minus-${this.id}">-</button> ${this.cantidad} <button id="plus-${this.id}">+</button></p>
                        <p class="card-text">$${this.precio}</p>
                        <p class="card-text"><small class="text-body-secondary">${this.descripcion}</small></p>
                        <button id="eliminar-${this.id}"><i class="fa-solid fa-trash" style="color: #0f0f0f;"></i></button>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    descripcionHTML(){
        return `<div class="div-uno">
            <img src="${this.img}">
            <div class="card-uno">
                <h2>${this.nombre}</h2>
                <p>$${this.precio}</p>
                <p>${this.descripcion}</p>
                <a href="" id="pro${this.id}">Buy Now</a>
            </div>
            </div>
            `
    }
}

class Carrito{
    constructor(){
        this.listacarrito = []
        this.contenedor_carrito = document.getElementById('contenedor_carrito')
        this.total = document.getElementById('total')
        this.finalizar_compra = document.getElementById("finalizar_compra")
        this.llaveStorage = "listacarrito"
    }

    levantarStorage(){
        this.listacarrito = JSON.parse(localStorage.getItem(this.llaveStorage)) || []
        
        if(this.listacarrito.length > 0){
            let listaAuxiliar = []

            for (let i = 0; i < this.listacarrito.length; i++) {
                
                let productoBis = new Producto(this.listacarrito[i])
                listaAuxiliar.push(productoBis)
                
                
            }

            this.listacarrito = listaAuxiliar
        }
    }
    guardarStorage(){
        let listaCarritoJSON = JSON.stringify(this.listacarrito)
        localStorage.setItem(this.llaveStorage, listaCarritoJSON)
    }
    
    agregar(productoNuevo) {
        let existeElProducto = this.listacarrito.some(producto => producto.id == productoNuevo.id)
        
        if( existeElProducto ){
            let producto = this.listacarrito.find(producto => producto.id == productoNuevo.id)
            producto.cantidad = producto.cantidad + 1
        }else{
            this.listacarrito.push(productoNuevo)  
        }
    }

    eliminar(productoEliminado){
        let producto = this.listacarrito.find(producto => producto.id == productoEliminado.id)
        let indice = this.listacarrito.indexOf(producto)
        this.listacarrito.splice(indice,1)
        
    }

    limpiarContenedorCarrito(){
        this.contenedor_carrito.innerHTML = ""
    }

    ver() {

        this.contenedor_carrito.innerHTML = ""

        this.listacarrito.forEach( producto => {
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

            btn_plus.addEventListener("click",()=>{
                producto.aumentarCantidad()
                this.ver()
            })

            btn_minus.addEventListener("click", ()=>{
                if( producto.disminuirCantidad() ){
                    this.ver()
                }
            })
        })

        total.innerHTML = "Precio final de su compra: $" + this.calcular_total()

    }

    

    calcular_total(){
        return this.listacarrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad ,0)
    }

    eventoFinalizarCompra(){
        this.finalizar_compra.addEventListener("click", () => {

            if(this.listacarrito.length > 0){
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
                this.total.innerText = 'Precio final de su compra actual: $'+ precio_total
            }else{
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

            }
            )
        })
    }

}



const productoUno = new Producto({id:1, nombre:"Hoodie Classic", precio:13000, descripcion: "Buzo negro Oversize Classic", img:"./img/clothes-chica-redu.jpg" })

const productoDos = new Producto({id:2, nombre:"Hoodie System", precio:16000, descripcion:"Buzo negro Oversize System", img:"./img/clothes-escalera-redu.jpg"})

const productoTres = new Producto({id:3, nombre:"Remera Classic", precio:10000, descripcion:"Remera negra Oversize Classic", img:"./img/clothes-reme-classic-redu.jpg"})

const carrito = new Carrito()
carrito.levantarStorage()
carrito.ver()
carrito.eventoFinalizarCompra()



const controlador_productos = new Productocontrolador()

controlador_productos.agregar(productoUno)
controlador_productos.agregar(productoDos)
controlador_productos.agregar(productoTres)
controlador_productos.verProductos()