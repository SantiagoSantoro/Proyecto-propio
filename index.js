const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("lista-carrito");
const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");
const totalCarrito = document.getElementById("total-carrito");
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const botonConfirmaCompra = document.getElementById("confirma-compra");;

fetch("../data.json")
  .then((response) => response.json())
  .then((productos) => {
    mostrarProductos(productos);
  })
  .catch((error) => {
    console.error("Error al obtener los productos:", error);
  });

function mostrarProductos(productos) {
  console.log(productos)
  productos.forEach((producto) => {
    const item = document.createElement("div");
    item.classList.add("producto", "card-producto");
    item.innerHTML = `
      <div class="card">
        <img src="${producto.img}" style="max-width: 100%">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <h4 class="card-subtitle">${producto.categoria}<h4>
          <p class="card-text">$${producto.precio}</p>
          <button id="agregar-${producto.id}" class="btn btn-dark">Agregar al carrito</button>
        </div>
      </div>
    `;
    contenedorProductos.appendChild(item);

    const btnAgregar = document.getElementById(`agregar-${producto.id}`)
    btnAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto.id, productos)
    })
  });
}

function agregarAlCarrito(idProducto, productos) {
  const producto = productos.find((p) => p.id === idProducto);
  carrito.push(producto);
  actualizarCarrito();
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Producto agregado al carrito',
    showConfirmButton: true,
    timer: 1500
  })
  // Almacenar en el Local Storage
  localStorage.setItem("carrito", JSON.stringify(carrito));

}

actualizarCarrito()

function actualizarCarrito() {
  const contenedorCarrito = document.getElementById("lista-carrito");
  contenedorCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    const item = document.createElement("div");
    item.classList.add("producto");
    item.innerHTML = `
    <img src="${producto.img}" alt="${producto.nombre}" style="width: 400px; height: 400px; border-radius: 5px;">
      <p>${producto.nombre} - $${producto.precio}</p>
      <button onclick="eliminarDelCarrito(${producto.id})" class="btn btn-danger">Eliminar</button>
    `;
    contenedorCarrito.appendChild(item);
  });


  // Actualizar total de la compra
  const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
  const totalCarrito = document.getElementById("total-carrito");
  totalCarrito.innerText = `Total de la compra: $${total}`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

botonVaciarCarrito.addEventListener("click", () => {
  Swal.fire({
    title: '??Est?? seguro de que desea vaciar el carrito?',
    text: "Esta acci??n no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'S??, vaciar carrito'
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito();
      Swal.fire(
        '??Carrito vaciado!',
        '',
        'success'
      )
    }
  })
})

function eliminarDelCarrito(idProducto) {
  const productoIndex = carrito.findIndex((p) => p.id === idProducto);
  carrito.splice(productoIndex, 1);
  actualizarCarrito();
  Swal.fire('Producto eliminado del carrito')

  // Actualizar Local Storage

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
  carrito.splice(0, carrito.length);
  actualizarCarrito();

}

function confirmaCompra() {
  Swal.fire({
    title: '??Est?? seguro de que desea confirmar la compra?',
    text: "Esta acci??n no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'S??, confirmar compra'
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito()
      Swal.fire(
        '??Compra confirmada!. En segundos recibiras un e-mail con la factura de tu compra',
        '',
        'success'
      )
    }
  })
}


botonConfirmaCompra.addEventListener("click", confirmaCompra);




