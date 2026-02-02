# 🎲 Juego de Riesgo y Recompensa (Risk Aversion Experiment)

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://experimento.anelriera.com/)
> **Juega ahora en:** [experimento.anelriera.com](https://experimento.anelriera.com/)

Este repositorio contiene el código fuente de un experimento económico sobre aversión al riesgo, desarrollado como parte de un Trabajo de Fin de Grado (TFG).

La aplicación es una plataforma web interactiva donde los participantes toman decisiones bajo incertidumbre (declaración de valor con riesgo de auditoría), permitiendo recolectar datos para su posterior análisis de comportamiento.

## 🚀 Tecnologías

*   **Backend**: Python 3.10 + Flask
*   **Base de Datos**: PostgreSQL
*   **Frontend**: HTML5, CSS3, JavaScript (Responsive & Mobile-First)
*   **Infraestructura**: Docker & Docker Compose

## 🛠️ Instalación y Uso

### Opción A: Ejecución con Docker (Recomendado)
Es la forma más sencilla de ejecutar el proyecto, ideal para despliegue en servidor.

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/usuario/risk-aversion-game.git
    cd risk-aversion-game
    ```

2.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz (puedes usar el ejemplo de abajo).

3.  **Ejecutar**:
    ```bash
    docker-compose up -d --build
    ```
    La aplicación estará disponible en `http://localhost:8000`.

### Opción B: Ejecución Local (Desarrollo)

1.  **Crear entorno virtual**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: .\venv\Scripts\activate
    ```

2.  **Instalar dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configurar base de datos**:
    Asegúrate de tener un servidor PostgreSQL corriendo y configura el archivo `.env`.

4.  **Iniciar la aplicación**:
    ```bash
    python app.py
    ```
    Disponible en `http://localhost:5000`.

## ⚙️ Configuración (.env)
Crea un archivo `.env` en la raíz con las siguientes variables:

```env
FLASK_SECRET_KEY=tu_clave_secreta_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_tu_db
DB_USER=usuario_db
DB_PASSWORD=password_db
```

## 📊 Estructura del Proyecto
*   `app.py`: Servidor Flask y lógica de backend.
*   `templates/`: Archivos HTML.
*   `static/`: Estilos CSS y lógica JS del cliente.
*   `Dockerfile`: Configuración para construir la imagen del contenedor.

## 📝 Licencia
Este proyecto es parte de una investigación académica.
