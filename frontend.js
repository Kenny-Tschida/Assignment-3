import { useState, useEffect } from "react";

function Catalog() {
  const [view, setView] = useState("products");
  const [product, setProduct] = useState([]);
  const [singleProduct, setSingleProduct] = useState({
    id: 0,
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: "",
    rating: {
      rate: 0,
      count: 0,
    },
  });

  useEffect(() => {
    view1();
  }, []);

  function view1() {
    fetch("http://localhost:8081/listProducts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProduct(data);
      });
    setView("products");
  }

  function view2() {
    setView("add");
  }
  function view3() {
    setView("delete");
  }
  function view4() {
    setView("update");
  }
  function view5() {
    setView("information");
  }

  const viewAllProducts = product.map((el) => (
    <div class="col" key={el.id}>
      <div class="card shadow-sm">
        <img
          src={el.image}
          id="catalog_image"
          class="mx-3 mt-3"
          width="35%"
          height="35%"
          alt="image"
        />
        <div class="card-body">
          <h5 class="card-text">
            <strong>{el.title}</strong>
          </h5>
          <p class="card-text">{el.description}</p>
          <p class="card-text">Category: {el.category}</p>
          <p class="card-text">${el.price}</p>
          <p class="card-text">Rating: {el.rating.rate}</p>
        </div>
      </div>
    </div>
  ));

  function productById() {
    var id = parseInt(document.getElementById("IdInput").value);
    fetch("http://localhost:8081/" + id)
      .then((response) => response.json())
      .then((data) => {
        setSingleProduct(data);
      });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      id: parseInt(document.querySelector('input[name="id"]').value),
      title: document.querySelector('input[name="title"]').value,
      price: parseFloat(document.querySelector('input[name="price"]').value),
      description: document.querySelector('input[name="description"]').value,
      category: document.querySelector('input[name="category"]').value,
      image: document.querySelector('input[name="image"]').value,
      rating: {
        rate: document.querySelector('input[name="rating"]').value,
        count: 120,
      }
    };
    console.log(formData);
    try {
      await addMethod(formData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function addMethod(data) {
    console.log("Call Add", data.id);
    fetch("http://localhost:8081/addProduct", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log("Error:" + err));
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSingleProduct({ ...singleProduct, [name]: value });
  };

  function deleteMethod(id) {
    console.log("Call Delete ", id);
    fetch("http://localhost:8081/deleteProduct", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("showDeleteData").innerHTML = JSON.stringify(data);
      })
      .catch((err) => console.log("Error:" + err));
  }

  function getDeleteMethod() {
    var id = parseInt(document.getElementById("deleteIntegerInput").value);
    fetch("http://localhost:8081/" + id)
      .then((response) => response.json())
      .then((data) => {
        setSingleProduct(data);
      });
  }

  function deleteButton() {
    var inputElement = document.getElementById("deleteIntegerInput");
    var inputValue = inputElement.value;
    var integerInput = parseInt(inputValue);
    deleteMethod(integerInput);
  }

  async function updateMethod(id, price) {
    console.log("Update price of ", id, " to $", price);
    fetch("http://localhost:8081/update/" + id, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        price: price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("showUpdateData").innerHTML = JSON.stringify(data);
      })
      .catch((err) => console.log("Error:" + err));
  }

  function getUpdateMethod() {
    var id = parseInt(document.getElementById("updateIdInput").value);
    fetch("http://localhost:8081/" + id)
      .then((response) => response.json())
      .then((data) => {
        setSingleProduct(data);
      });
  }

  function updateButton() {
    const itemId = parseInt(document.getElementById("updateIdInput").value);
    const newPrice = parseFloat(
      document.getElementById("updatePriceInput").value
    );
    updateMethod(itemId, newPrice);
  }

  return (
    <div>
      <header data-bs-theme="dark">
        <div
          class="navbar navbar-dark bg-dark shadow-sm py-3"
          id="navbarHeader"
        >
          <div class="container">
            <h1>Assignment-3: Mern Application Development</h1>
          </div>
          <div class="container">
            <button class="btn btn-primary" onClick={view1}>
              View All Products
            </button>
            <button class="btn btn-primary" onClick={view2}>
              Add a New Product
            </button>
            <button class="btn btn-primary" onClick={view3}>
              Delete Product by Id
            </button>
            <button class="btn btn-primary" onClick={view4}>
              Update Price by Id
            </button>
            <button class="btn btn-primary" onClick={view5}>
              Assignment Info
            </button>
          </div>
        </div>
      </header>
      <div class="px-5 py-3">
        {view === "products" && (
          <div>
            <div class="album py-5 bg-body-tertiary">
              <div class="container">
                <label htmlFor="updateIdInput">Find By Id: </label>
                <input type="number" id="IdInput" onChange={productById} />
                <div class="col my-4" key={singleProduct.id}>
                  <div class="card shadow-sm">
                    <img
                      id="catalog_image"
                      class="mx-4 mt-4"
                      src={singleProduct.image}
                      width="10%"
                      alt="image"
                    />
                    <div class="card-body">
                      <h6 class="card-text">Id: {singleProduct.id}</h6>
                      <h5 class="card-text">
                        <strong>{singleProduct.title}</strong>
                      </h5>
                      <p class="card-text">
                        Description: {singleProduct.description}
                      </p>
                      <p class="card-text">
                        Category: {singleProduct.category}
                      </p>
                      <p class="card-text">Price: ${singleProduct.price}</p>
                      <p class="card-text">
                        Rating: {singleProduct.rating.rate}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  {viewAllProducts}
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "add" && (
          <div>
            <h1 class="py-3">Add Method</h1>
            <h6>
              <i>
                Please note that when adding a new product, the Id you choose
                must not already be in use
              </i>
            </h6>
            <div>
              <form className="container" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Id:</label>
                  <input
                    className="form-control"
                    name="id"
                    type="number"
                    value={singleProduct.id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Title:</label>
                  <input
                    className="form-control"
                    name="title"
                    type="text"
                    value={singleProduct.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price:</label>
                  <input
                    className="form-control"
                    name="price"
                    type="number"
                    step="0.01"
                    value={singleProduct.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <input
                    className="form-control"
                    name="description"
                    type="text"
                    value={singleProduct.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category:</label>
                  <input
                    className="form-control"
                    name="category"
                    type="text"
                    value={singleProduct.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image:</label>
                  <input
                    className="form-control"
                    name="image"
                    type="text"
                    value={singleProduct.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating:</label>
                  <input
                    className="form-control"
                    name="rating"
                    type="number"
                    step="0.01"
                    placeholder="rate,count"
                    value={singleProduct.rating.rate}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Add New Product
                </button>
              </form>
            </div>
            <div class="col my-4" key={singleProduct.id}>
              <div class="card shadow-sm">
                <img
                  id="catalog_image"
                  class="mx-4 mt-4"
                  src={singleProduct.image}
                  width="20%"
                  alt="image"
                />
                <div class="card-body">
                  <h6 class="card-text">Id: {singleProduct.id}</h6>
                  <h5 class="card-text">
                    <strong>{singleProduct.title}</strong>
                  </h5>
                  <p class="card-text">
                    Description: {singleProduct.description}
                  </p>
                  <p class="card-text">Category: {singleProduct.category}</p>
                  <p class="card-text">Price: ${singleProduct.price}</p>
                  <p class="card-text">Rating: {singleProduct.rating.rate}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "delete" && (
          <div>
            <h1 class="py-3">Delete Method</h1>
            <label htmlFor="deleteIntegerInput">Find By Id: </label>
            <input
              type="number"
              id="deleteIntegerInput"
              onChange={getDeleteMethod}
            />
            <button class="btn btn-primary" onClick={deleteButton}>
              Delete
            </button>
            <div class="col my-4" key={singleProduct.id}>
              <div class="card shadow-sm">
                <img
                  id="catalog_image"
                  class="mx-4 mt-4"
                  src={singleProduct.image}
                  width="20%"
                  alt="image"
                />
                <div class="card-body">
                  <h6 class="card-text">Id: {singleProduct.id}</h6>
                  <h5 class="card-text">
                    <strong>{singleProduct.title}</strong>
                  </h5>
                  <p class="card-text">
                    Description: {singleProduct.description}
                  </p>
                  <p class="card-text">Category: {singleProduct.category}</p>
                  <p class="card-text">Price: ${singleProduct.price}</p>
                  <p class="card-text">Rating: {singleProduct.rating.rate}</p>
                </div>
              </div>
            </div>

            <h1>Output:</h1>
            <pre id="showDeleteData"></pre>
          </div>
        )}
        {view === "update" && (
          <div>
            <h1 class="py-3">Update Method</h1>
            <div>
              <label htmlFor="updateIdInput">Find By Id: </label>
              <input
                type="number"
                id="updateIdInput"
                onChange={getUpdateMethod}
              />
            </div>
            <div>
              <label htmlFor="updatePriceInput">New Price: </label>
              <input type="number" id="updatePriceInput" />
              <button class="btn btn-primary" onClick={updateButton}>
                Update
              </button>
            </div>
            <div class="col my-4" key={singleProduct.id}>
              <div class="card shadow-sm">
                <img
                  id="catalog_image"
                  class="mx-4 mt-4"
                  src={singleProduct.image}
                  width="20%"
                  alt="image"
                />
                <div class="card-body">
                  <h5 class="card-text">
                    <strong>{singleProduct.title}</strong>
                  </h5>
                  <h6 class="card-text">
                    Description: {singleProduct.description}
                  </h6>
                  <h6 class="card-text">Category: {singleProduct.category}</h6>
                  <h6 class="card-text">Price: ${singleProduct.price}</h6>
                  <h6 class="card-text">Rating: {singleProduct.rating.rate}</h6>
                  <h6 class="card-text">Id: {singleProduct.id}</h6>
                </div>
              </div>
            </div>
            <h1>Output:</h1>
            <pre id="showUpdateData"></pre>
          </div>
        )}
        {view === "information" && (
          <body>
            <div class="row">
              <div class="col m-5">
                <h2>
                  <strong>Jacob Lehrman</strong>
                </h2>
                <h4 id="contacts">Contact: jlehrman@iastate.edu</h4>
              </div>
              <div class="col my-5">
                <h2>
                  <strong>Kenneth Tschida</strong>
                </h2>
                <h4 id="contacts">Contact: ktschida@iastate.edu</h4>
              </div>
            </div>
            <div class="row">
              <div class="col m-5">
                <h2>
                  <strong>
                    SE/COMS 319 Fall 2023 - Construction of User Interfaces
                  </strong>
                </h2>
                <h3>Dr. Ali Jannesari</h3>
                <h3>April 24th, 2024</h3>
              </div>
              <div class="col m-5">
                <h3>
                  <strong>Assignment Description:</strong>
                </h3>
                <p>
                  Our names are Jacob Lehrman and Kenneth Tschida, and in this
                  assignment we display our knowlegdge and technical ability of
                  backend development utilizing a MongoDB database in relation
                  with a Node.js and Express which communicate to one another
                  with CRUD request methods. We also display our knowlegde and
                  technical ability of frontend development through the use of a
                  react webpage, which fetches data from our MongoDB database,
                  in order to create a product catalog for database management.
                </p>
              </div>
            </div>
          </body>
        )}
      </div>
      <footer>
        <div id="foot">
          <div class="container">
            <p class="home">Developed by Jacob Lehrman and Kenneth Tschida</p>
            <p class="float-end mb-1">
              <a id="return" href="#">
                Back to top
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Catalog;