# @sncrr/react-hook-form-persist

🔹A lightweight, lag-free utility for automatically persisting and restoring React Hook Form state using localStorage, sessionStorage, or AsyncStorage (React Native).

[![npm version](https://img.shields.io/npm/v/@sncrr/react-hook-form-persist.svg?style=flat-square)](https://www.npmjs.com/package/@sncrr/react-hook-form-persist)
[![npm downloads](https://img.shields.io/npm/dm/@sncrr/react-hook-form-persist.svg?style=flat-square)](https://www.npmjs.com/package/@sncrr/react-hook-form-persist)

---

## ✨ Features

- 💾 Automatically **persist** and **restore** form state
- ⚡ **Lag-free** with debounced updates (no typing delays)
- 🌐 Works on **web** and **React Native**
- 🧠 Supports **localStorage**, **sessionStorage**, **AsyncStorage**
- 🎯 **Exclude specific fields** from persistence
- 🔁 **Override restored values** safely
- 🪶 Minimal and lightweight
- ⚛️ Built specifically for **React Hook Form**

---

## 🚀 Install

```sh
npm install @sncrr/react-hook-form-persist
# or
yarn add @sncrr/react-hook-form-persist
# or
pnpm add @sncrr/react-hook-form-persist
# or
bun add @sncrr/react-hook-form-persist
```

---

## 📖 Usage

### Web (localStorage / sessionStorage)

```jsx
import { useForm } from "react-hook-form";
import { useFormPersist } from "@sncrr/react-hook-form-persist";

export function App() {
  const formMethods = useForm();

  useFormPersist({
    key: "registration-form",
    formMethods,
    storage: "localStorage", // or "sessionStorage",
    exclude: ["password"],
    override: { age: 18 },
    debounce: 500,
  });

  return (
    <form>
      <input {...formMethods.register("firstName")} />
      <input {...formMethods.register("lastName")} />
      <input {...formMethods.register("age")} />
      <input {...formMethods.register("email")} />
      <input {...formMethods.register("password")} />
    </form>
  );
}
```

### React Native (AsyncStorage)

```jsx
import { useForm } from "react-hook-form";
import { useAsyncFormPersist } from "@sncrr/react-hook-form-persist";

export function App() {
  const formMethods = useForm();

  useAsyncFormPersist({
    key: "login-form",
    formMethods,
  });

  return <form>{/* Your inputs */}</form>;
}
```

---

## ⚙️ API

#### PersistOptions

- `key: string` – Unique storage key
- `formMethods: UseFormReturn` – React Hook Form methods
- `storage?: "localStorage" | "sessionStorage"` – Storage type (default: localStorage)
- `exclude?: string[]` – Fields to exclude from persistence
- `override?: Partial<T>` – Values to override on restore
- `debounce?: number` – Delay in ms before saving (default: 300)

## 📜 License

MIT © [sncrr](https://github.com/sncrr)
