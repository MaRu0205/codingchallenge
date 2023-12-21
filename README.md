
# Coding Challenge: E-commerce Product Page

## "Perfection is the enemy of progress"

## Description

[Provide a brief description of your project here.]

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.11.5
- pip (Python package installer)
- Git (for cloning the repository)

### Installation

Follow these steps to get your development environment set up:

1. **Clone the Repository**

   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/MaRu0205/codingchallenge.git
   cd codingchallenge
   ```

2. **Set Up a Virtual Environment**

   It's recommended to use a virtual environment to manage the dependencies for your project. This keeps your project isolated from other projects and system-wide Python packages.

   Create a virtual environment:

   ```bash
   python -m venv venv
   ```

   Activate the virtual environment:

   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```

   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

   Your command line prompt will change to show the name of the activated environment.

3. **Install Dependencies**

   With your virtual environment activated, install the project dependencies using `pip` and the provided `requirements.txt` file:

   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Running the Application**

   To run the application navigate to the backend/ecommerce_backend and execute the following command:

   ```bash
   cd backend/ecommerce_backend
   python manage.py runserver
   ```

5. **Product APIs**

    Once the server is running you can find the available api endpoints at http://127.0.0.1:8000/product-api/

    **Products API**
    http://127.0.0.1:8000/product-api/products/
    With the products API you can GET the list of all available products or POST a new products including it's available sizes and colors like the following:

    ```bash
   
   {
        "title": "Product 5",
        "price": "54.99",
        "description": "Description for Product 5",
        "available_sizes": [
            {
                "size": "XS"
            },
            {
                "size": "S"
            },
            {
                "size": "M"
            },
            {
                "size": "L"
            },
            {
                "size": "XL"
            }
        ],
        "available_colors": [
            {
                "color": "Red"
            },
            {
                "color": "Blue"
            },
            {
                "color": "Green"
            },
            {
                "color": "Black"
            },
            {
                "color": "White"
            }
        ],
        "image": null
    }

   ```

   If you want to get only one product detail based on the product id you can use http://127.0.0.1:8000/product-api/products/{id}

    **Sizes API**
    http://127.0.0.1:8000/product-api/sizes/
    With the sizes API you can GET all available sizes or POST a new size.

    ```bash
      {
    "color": "White"
    }
   ```


    **Colors API**
    http://127.0.0.1:8000/product-api/colors/
    With the colors API you can GET all available colors or POST a new color.

    ```bash
      {
    "size": "XXL"
    }
   ```

6. **Cart APIs**

   With the carts API you can get a list of all carts using http://127.0.0.1:8000/cart-api/carts/ or you can add a cart with one or multiple products like the following example JSON:


    ```bash
   {
    "items": [
        {
        "product": 1,  // ID of the first product
        "quantity": 2, // Quantity of the first product
        "size": 2,     // ID of the selected size for the first product
        "color": 4     // ID of the selected color for the first product
        },
        {
        "product": 2,  // ID of the second product
        "quantity": 1, // Quantity of the second product
        "size": 5,     // ID of the selected size for the second product
        "color": 1     // ID of the selected color for the second product
        },
        // Add more items as needed
    ]
    }       

   ```

   If you want to read only one specific cart you can use http://127.0.0.1:8000/cart-api/carts/id/


7. **Deactivating the Virtual Environment**

   When you're done working on the project, you can deactivate the virtual environment:

   ```bash
   deactivate
   ```

### Django Admin Interface

If you want to create, update, delete any of the objects like products, colours, sizes or carts and cart items you can use also the admin user interface http://127.0.0.1:8000/admin/
Here are the login credentuals for the admin user:

user: maru
pw: maru


---
