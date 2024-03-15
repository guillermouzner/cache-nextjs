import {cookies} from "next/headers";

import {getSession} from "../action";

export default async function DataPage() {
  const cookie = cookies().get("cookie-prueba");

  if (!cookie) return null;

  const payload = (await getSession(cookie)) as {amount: number; date: Date};

  return (
    <main className="mb-1 line-clamp-1 flex flex-col rounded-md px-2 py-1">
      <div>Monto en pesos: {payload.amount}</div>
      <div>Fecha: {JSON.stringify(payload.date)}</div>
    </main>
  );
}
