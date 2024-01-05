# Headless E-Commerce Application

## Overview
This project is a headless e-commerce application designed to provide a basic understanding of developing an app using a separated frontend and backend architecture, communicating exclusively via REST APIs. It features product listing, a shopping cart, user authentication (register, login, logout), and order processing via Kafka.

## Technologies
- **Frontend**: Preact, Vite, TailwindCSS
- **Backend**: Django, Django REST Framework, Python
- **Database**: SQLite
- **Image Hosting**: Cloudinary
- **Messaging System**: Kafka
- **Containerization**: Docker

## Features
- Product listing with detailed view
- Shopping cart functionality
- User authentication (register, login, logout)
- Basic order processing integrated with Kafka
- Django Admin Interface for CRUD operations

## Backend Structure
The backend is divided into Django apps:
- **Product**: Handling product and article details.
- **Cart**: Managing shopping cart operations.
- **Customer**: User authentication and management.

## Important APIs
- Product API: `http://127.0.0.1:8000/product-api/products/`
- Cart API: `http://127.0.0.1:8000/cart-api/carts/`
- Customer API: `http://127.0.0.1:8000/customer-api/`

For detailed API endpoints and their functionalities, please refer to the provided documentation.

## Installation and Setup
1. Clone the repository.
2. Navigate to the root folder containing `docker-compose.yml`.
3. Run `docker-compose up` to start all the services.
4. Access the frontend application at `http://localhost:3000` and the Django Admin Interface at `http://127.0.0.1:8000/admin`.

## Contributing
Contributions to the project are welcome. Please follow the standard fork-and-pull request workflow.

## Contact
For further inquiries or discussions about the project, feel free to contact.




## Product API Documentation

### Overview
The Product API enables management of products and their related articles within the e-commerce platform. It supports operations such as listing, creating, updating, and deleting products and their articles.

### Base URL
```
http://127.0.0.1:8000/product-api/
```

### Endpoints

#### List All Products
- **Endpoint**: `/products/`
- **Method**: `GET`
- **Description**: Retrieves all products with associated articles.
- **Response Example**:
    ```json
    [
        {
            "id": 1,
            "title": "Product Title",
            "description": "Product Description",
            "status": "Active",
            "articles": [
                {
                    "id": 1,
                    "product_id": 1,
                    "size": "42",
                    "color": "Color",
                    "price": "120.00",
                    "image": "image_url",
                    "gtin": "12345678901234",
                    "name": "Article Name"
                }
                // Additional articles
            ]
        }
        // Additional products
    ]
    ```

#### Create a New Product
- **Endpoint**: `/products/`
- **Method**: `POST`
- **Description**: Adds a new product with specified details.
- **Request Body Example**:
    ```json
    {
        "title": "New Product",
        "description": "Description",
        "status": "Active",
        "articles": [
            {
                "size": "42",
                "color": "Color",
                "price": "150.00",
                "gtin": "12345678901245"
            }
        ]
    }
    ```
- **Response Example**:
    ```json
    {
        "id": new_product_id,
        "title": "New Product",
        // Other product details
    }
    ```

#### Update a Product
- **Endpoint**: `/products/{id}/`
- **Method**: `PUT`/`PATCH`
- **Description**: Modifies an existing product by ID.
- **Request Body**: Similar to product creation.
- **Response**: Updated product details in JSON format.

#### Delete a Product
- **Endpoint**: `/products/{id}/`
- **Method**: `DELETE`
- **Description**: Removes the specified product.
- **Response**: Status message on successful deletion.

### Additional Notes
- Replace `{id}` with the actual ID of the product.
- The `gtin` field refers to the Global Trade Item Number.
- Ensure appropriate `Content-Type` (application/json) in requests.

### Error Handling
- Responses include HTTP status codes for errors (e.g., 404 for not found, 400 for bad request).
- Error details are provided in the response body.
