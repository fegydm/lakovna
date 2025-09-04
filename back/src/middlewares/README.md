# Middlewares

Tento priečinok obsahuje všetky **Express middlewares** použité v projekte.  
Pravidlo je jednoduché:  
➡️ Každý súbor tu exportuje funkciu `(req, res, next)` → zapája sa priamo do Express pipeline.  
➡️ Ak middleware obsahuje malé helper funkcie (napr. `is_bot`, `parse_cookies`), ostávajú v tom istom súbore, aby bol kód krátky a zrozumiteľný.  

---

## 📂 Zoznam middlewares

### 🔑 Autentifikácia & Autorizácia
- **`jwt-auth.middleware.ts`**  
  Overuje JWT token, pridáva `req.user`, kontroluje prístup podľa `AccessRole`.

### 🍪 Cookies & Sessions
- **`cookie-parser.middleware.ts`**  
  Jednoduchý parser cookies → sprístupní `req.cookies`.  
- **`db-session.middleware.ts`**  
  Vytvára a spravuje sessions v databáze (pomocou `session_id` cookie).  

### 🌍 CORS & Security
- **`cors.middleware.ts`**  
  Nastavuje CORS hlavičky podľa konfigurácie (`PROJECT_CONFIG.routing.cors`).  
- **`rate-limiter.middleware.ts`**  
  Jednoduchý in-memory rate limiter podľa IP (ochrana proti flood útokom).  

### 📜 Logging & Errors
- **`request-logger.middleware.ts`**  
  Loguje každý HTTP request (IP, metóda, URL, status, čas).  
- **`error-handler.middleware.ts`**  
  Globálny error handler – jednotný JSON response pri chybách.  

### 🤖 Bot Detection
- **`user-agent-bot.middleware.ts`**  
  Detekuje botov/crawlerov na základe `User-Agent` a nastaví `req.useragent.isBot`.

---

## 🛠 Použitie

Príklad integrácie v `app.ts`:

```ts
import express from 'express';
import { 
  jwt_auth_middleware, 
  cookie_parser_middleware, 
  db_session_middleware, 
  cors_middleware, 
  request_logger, 
  rate_limiter, 
  error_handler, 
  bot_detection_middleware 
} from './middlewares';

const app = express();

// poradie middlewares
app.use(request_logger);
app.use(cors_middleware);
app.use(cookie_parser_middleware);
app.use(db_session_middleware);
app.use(bot_detection_middleware);
app.use(rate_limiter(60_000, 100)); // napr. 100 req/min

// routes...
app.use('/api', jwt_auth_middleware());

// error handler na konci
app.use(error_handler);

export default app;
