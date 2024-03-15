"use client";

import * as React from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

import {useDebounce} from "@/lib/utils";

import {CreateCookie} from "../action";

export function ClientConversorPage({amount}: {amount: number}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = React.useTransition();
  const [inputValue, setInputValue] = React.useState<string | number>(0);
  const [error, setError] = React.useState("");

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const inputValidation = (valor: string) => {
    const numberValue = parseFloat(valor);

    if (isNaN(numberValue)) {
      return "Debes ingresar un número";
    }
    if (numberValue < 100) {
      return `El monto debe ser mayor a ${(100).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}`;
    }
    if (numberValue > 10000000) {
      return `El monto debe ser menor a ${(10000000).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })} `;
    }

    return "";
  };

  async function handleSumbit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Number(debouncedAmountValue) < 100 || Number(debouncedAmountValue) > 10000000) {
      return;
    }
    setInputValue(0);
    await CreateCookie({amount: inputValue, date: new Date(Date.now())});
  }

  const debouncedAmountValue = useDebounce(inputValue, 500);

  React.useEffect(() => {
    if (Number(debouncedAmountValue) < 100 || Number(debouncedAmountValue) > 10000000) {
      return;
    }

    startTransition(async () => {
      router.push(
        `${pathname}?${createQueryString({
          amount: inputValue,
        })}`,
        {
          scroll: false,
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmountValue]);

  return (
    <div>
      <form className="flex flex-col items-center space-y-3" onSubmit={handleSumbit}>
        <input
          autoComplete="off"
          className="h-10 border-2 border-slate-500 text-center text-xl tabular-nums focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 md:text-2xl lg:h-14 lg:text-4xl"
          min={0}
          placeholder="-"
          step="0.01"
          type="number"
          value={inputValue === 0 ? "" : inputValue}
          onChange={(e) => {
            const valor = e.target.value;

            setInputValue(valor);
            const mensajeError = inputValidation(valor);

            setError(mensajeError);
          }}
        />
        {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
        <div className="flex w-52 flex-row items-center justify-between">
          <p>Monto en dolares:</p>

          {isPending ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 100 101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <p className="font-semibold">
              {`${
                amount
                  ? Number(amount).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  : "-"
              }`}
            </p>
          )}
        </div>
        <button className="w-52 border" disabled={isPending} type="submit">
          calcular
        </button>
      </form>
    </div>
  );
}
