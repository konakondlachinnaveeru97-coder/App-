# Sandhya World Bakery

A MERN stack (MongoDB, Express, React, Node.js) implementation of the Figma Make design
[Bakery website with AI assistant](https://www.figma.com/make/yfNxhml2OwiTUFy6OJ7Lv0/Bakery-website-with-AI-assistant).

## Features

- **Home:** hero, "Our global favourites" menu loaded from MongoDB, and the "Why Sandhya?" story.
- **Cart:** add, change quantity, and remove items. The cart is saved in the browser. Totals include 5% tax and free delivery.
- **Checkout:** creates an order in MongoDB. Prices are always recalculated on the server.
- **Order tracking:** look up an order by ID (e.g. `SB240618`). Progress moves through
  confirmed, in the oven, packed, and out for delivery based on time since the order was placed, and refreshes every 30 seconds.
- **Sia, the AI assistant:** answers questions about bestsellers, eggless options, allergens, prices,
  and delivery, can add suggested items to the cart, and can look up an order by its ID.
  Replies are rule-based and built from live menu and order data, so no external AI service is needed.

## Structure

```
├── client/                  React + Vite frontend
│   └── src/
│       ├── components/      Header, Footer, Logo, Icon, Assistant (Sia)
│       ├── pages/           Home, Cart, Tracking, NotFound
│       ├── ShopContext.jsx  Menu + cart state
│       └── styles/          Design styles and tokens
└── server/                  Express + Mongoose API
    ├── src/
    │   ├── models/          Product, Order
    │   ├── routes/          products, orders, assistant
    │   ├── services/        catalog, orders, tracking, assistant logic
    │   └── data/            Menu used to seed MongoDB
    ├── demo.js              Runs the app with an in-memory store (no MongoDB)
    └── test/                API and tracking tests (node:test + supertest)
```

## Getting started

Requires Node.js 18+ and MongoDB (local or MongoDB Atlas).

```bash
npm run install:all
cp server/.env.example server/.env   # set MONGODB_URI
npm run dev                           # API on :5000, web on :5173
```

The menu is seeded into MongoDB automatically on first start. You can also run `npm run seed`.
Seeding only inserts missing items, so prices edited in the database are kept.

No MongoDB yet? `npm run demo` builds the client and serves the whole site on
http://localhost:5000 with an in-memory store. Orders disappear when it stops.

## Production

```bash
npm run build      # builds client/dist
npm start          # Express serves the API and the built React app on $PORT
```

## API

| Method | Path                    | Description                                              |
| ------ | ----------------------- | -------------------------------------------------------- |
| GET    | `/api/health`           | Server and database status                               |
| GET    | `/api/products`         | Menu (falls back to the bundled menu if MongoDB is down) |
| POST   | `/api/orders`           | Place an order: `{ items: [{ productId, quantity }] }`   |
| GET    | `/api/orders/:orderId`  | Order details and live tracking status                   |
| POST   | `/api/assistant`        | Ask Sia: `{ message }` returns `{ reply, suggestion, action }` |

If MongoDB is unreachable, the menu still renders and ordering endpoints respond with `503`.

## Tests

```bash
npm test
```
