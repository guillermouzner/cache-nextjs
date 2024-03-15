import {notFound} from "next/navigation";

import {ClientConversorPage} from "./page.client";

interface ConversorPageProps {
  params: {
    category: "checkout";
  };
  searchParams: Record<string, string | undefined>;
}

export default async function ConversorPage({searchParams}: ConversorPageProps) {
  try {
    const {amount} = searchParams;

    const amountAsNumber = Number(amount);
    const fallbackAmount = isNaN(amountAsNumber) || amountAsNumber < 0 ? 0 : amountAsNumber;

    const response = await getARSrates();
    const rates = await response.json();

    return (
      <section className="flex flex-col items-center space-y-3 rounded-md">
        <div>Conversor pesos a dolares</div>
        <ClientConversorPage amount={fallbackAmount / rates.USDT_ARS} />
        <div className="flex flex-col text-left">
          <p>1- poner en el input a modo de ejemplo 1500 y luego apretar en calcular</p>
          <p>2- eso generara una cookie y la mostrara a la derecha</p>
          <p>3- borrar manualmente la cookie</p>
          <p>
            4- poner en el input cualquier numero distinto a 1500 sin apretar calcular (como no hay
            cookie no se mostrara nada a la derecha)
          </p>
          <p>5- volver a poner en el input 1500</p>
          <p>
            * lo logico seria que no me muestre nada en el cuadro de la derecha pero aparece la data
            de la cookie del primer 1500 que puse 😥
          </p>
        </div>
      </section>
    );
  } catch (error) {
    return notFound();
  }
}

export async function getARSrates() {
  try {
    const response = await fetch("https://api.yadio.io/json/ARS", {cache: "no-store"});

    const {
      USD: {
        other: {
          usdt: {rate},
        },
      },
    } = await response.json();

    return new Response(JSON.stringify({USDT_ARS: rate}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({error: error}), {status: 500});
  }
}
