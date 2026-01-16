# EliteManager

**EliteManager** is a web-based fleet management application inspired by *Elite Dangerous*. It allows commanders to purchase ship chassis, outfit them with modules (Power Plants, FSDs, Thrusters), and manage their hangar mass calculations.

The project utilizes a hybrid architecture:
* **Frontend:** React (SPA) for the User Dashboard and Hangar.
* **Backend:** Laravel (API) for data handling and Authentication.
* **Admin Panel:** Laravel Blade (Server-Side Rendering) for database management.

---

## Tech Stack

* **Backend:** PHP 8.x, Laravel 10/11
* **Frontend:** React 18, Tailwind CSS, Framer Motion
* **Database:** MySQL
* **Authentication:** Laravel Sanctum (API) & Session (Admin Panel)

---

## Database Schema

The database is designed to handle ship constraints (Chassis) and individual configurations (User Ships).



### 1. `users`
Stores commander credentials and roles.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | Unique User ID |
| `name` | String | Commander Name |
| `email` | String | Login Email |
| `password` | String | Hashed Password |
| `role_id` | Integer | **1** = Admin, **2** = Commander |

### 2. `ship_models` (Chassis)
Defines the base stats and constraints for a ship type (e.g., Python, Anaconda).
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | Model ID |
| `name` | String | e.g., "Krait MkII" |
| `hull_mass` | Integer | Base weight of the ship (Tons) |
| `max_fsd` | Integer | Max Class size for FSD (e.g., 5) |
| `max_thrusters` | Integer | Max Class size for Thrusters |
| `max_power_plant` | Integer | Max Class zise for Power Plant |
And so on for the rest of the fields.

### 3. `user_ships` (Hangar)
Represents a specific ship owned by a user.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | Unique instance ID |
| `user_id` | FK | Owner (`users.id`) |
| `ship_model_id` | FK | The chassis type (`ship_models.id`) |
| `fsd_id` | FK | Currently installed FSD (`modules.id`) |

### 4. `modules`
The catalog of all installable parts.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | Module ID |
| `class_number` | Integer | Size (1-8) |
| `rating_character` | Char | Quality (A-E) |
| `mass` | Float | Weight in Tons |
| `slot_type` | Integer | **2**=PowerPlant, **3**=Thrusters, **4**=FSD, etc. |
| `optimal_mass` | Integer | (Nullable) Specific for FSD math |

### 5. `ship_modules`
Links generic modules to a specific user ship.
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_ship_id` | FK | The ship being outfitted |
| `module_id` | FK | The part installed |
| `installed_slot_index`| Integer | Maps to the slot type (e.g., 2 for PP) |

---

## Architecture & Functionality

### 1. Controllers (Backend Logic)

The application splits logic between API endpoints (JSON) and Admin Management (HTML).

* **`AuthController` (API):**
    * Handles `login`, `register`, and `logout` for the React Frontend.
    * Issues API Tokens for persistent sessions.
* **`UserShipController` (API):**
    * **`index()`**: Returns JSON list of ships owned by the authenticated user.
    * **`store()`**: Validates money/credits (optional) and creates a new ship instance.
    * **`update()`**: Receives a JSON payload of modules, validates that `module_class <= ship_max_class`, and updates the loadout.
    * **`destroy()`**: Sells the ship and removes it from the database.
* **`Admin\ShipManageController` (Web/Blade):**
    * Protected by `IsAdmin` middleware.
    * **`index()`**: Renders the server-side list of all Ship Models.
    * **`edit/update()`**: Handles the Blueprint forms to change base stats (Hull Mass, Slot Sizes) of the game's ship definitions.

### 2. Models (Eloquent ORM)

* **`UserShip` Model:**
    * Contains a custom accessor attribute `getTotalMassAttribute()`.
    * Calculates: `Base Hull Mass + FSD Mass + Sum(Modules Mass)` dynamically whenever a ship is requested.
* **`ShipModel` Model:**
    * Has a `hasMany` relationship to `UserShip`.
* **`Module` Model:**
    * Contains scopes like `scopeFsd($query)` or `scopeThrusters($query)` to easily filter parts by type.

### 3. Views (Frontend)

#### A. Public & Dashboard (React)
Located in `resources/js/src/pages`:
* **`Login.jsx` / `Register.jsx`**: Styled with Zinc/Purple themes. Interacts with `AuthController`.
* **`UserShips.jsx` (Hangar)**:
    * Fetches data from `/api/my-ships`.
    * Uses **Framer Motion** for slide transitions between pagination pages.
    * Displays dynamic mass calculations.
* **`EditShip.jsx` (Outfitting)**:
    * Complex form state management.
    * Filters `availableModules` based on the ship's constraints (e.g., if Ship Max Thrusters is Class 6, it won't show Class 7 thrusters).

#### B. Admin Panel (Laravel Blade)
Located in `resources/views/admin`:
* **`index.blade.php`**: A traditional server-rendered table listing all defined chassis.
* **`edit.blade.php`**: A form to tweak game balance (e.g., nerfing a ship's hull mass or buffing its FSD slot).
* **`login.blade.php`**: A separate, secure login portal specifically for backend administration.

---

## Setup Instructions

1.  **Clone & Install**
    ```bash
    git clone [https://github.com/DAW-Cirvianum/final-project-Lobby34.git](https://github.com/DAW-Cirvianum/final-project-Lobby34.git)
    cd elitemanager
    composer install
    npm install
    ```

2.  **Environment**
    ```bash
    cp .env.example .env
    php artisan key:generate
    # Configure your DB_DATABASE, DB_USERNAME, etc. in .env
    ```

3.  **Database**
    ```bash
    php artisan migrate --seed
    # Seeds should populate basic modules (FSDs, Thrusters) and Ship Models
    ```

4.  **Run**
    ```bash
    # Terminal 1 (Backend)
    php artisan serve

    # Terminal 2 (Frontend compiler)
    npm run dev
    ```

For the record, I've generated this README.md with GEMINI AI 3.0