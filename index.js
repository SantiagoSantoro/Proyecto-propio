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

//Destructuración:

function actualizarCarrito() {
  const { innerHTML } = contenedorCarrito;
  contenedorCarrito.innerHTML = "";
  carrito.forEach(({ img, nombre, precio, id }) => {
    const item = document.createElement("div");
    item.classList.add("producto");
    item.innerHTML = `
      <img src="${img}" alt="${nombre}" style="width: 400px; height: 400px; border-radius: 5px;">
      <p>${nombre} - $${precio}</p>
      <button onclick="eliminarDelCarrito(${id})" class="btn btn-danger">Eliminar</button>
    `;
    contenedorCarrito.appendChild(item);
  });

  // Actualizar total de la compra con destructuración
  
  const total = carrito.reduce((acc, { precio }) => acc + precio, 0);
  const { innerText } = totalCarrito;
  totalCarrito.innerText = `Total de la compra: $${total}`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


botonVaciarCarrito.addEventListener("click", () => {
  Swal.fire({
    title: '¿Está seguro de que desea vaciar el carrito?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, vaciar carrito'
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito();
      Swal.fire(
        '¡Carrito vaciado!',
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
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Debes agregar al menos un producto al carrito',
    });
    return;
  }
  
  Swal.fire({
    title: '¿Está seguro de que desea confirmar la compra?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, confirmar compra'
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito()
      Swal.fire(
        '¡Compra confirmada!. En segundos recibirás un e-mail con la factura de tu compra',
        '',
        'success'
      )
    }
  })
}



botonConfirmaCompra.addEventListener("click", confirmaCompra);




