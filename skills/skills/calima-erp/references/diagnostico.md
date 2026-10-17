# Diagnostic: why the payroll generates no event

The procedure that produced a correct answer on a real MEI case, in five
ordered reads. Follow the order — the conclusion of read 2 is worthless without
read 5.

## The symptom

`Eventos periódicos` shows the **S-1299 as "Pendente para Envio"** while the
**S-1200** and **S-1210** tabs show **"Nenhum registro encontrado"**.

The closing was generated; the remuneration and the payment do not exist. This
is not a transmission failure — the events were **never generated**.

## The one-line rule

> Empty in **"Eventos pendentes para envio"** = the event was **never
> generated** → the problem is the calculation or the cadastro.
> Present with a **rejection status** = it was generated and refused → the
> problem is the data.

Transmission failures always leave a trace. This distinction is what saves you
from rewriting data that was never sent.

## Read 1 — pending map

`monitorEventoEsocialProcessView`, tab *Eventos pendentes para envio*, expand
all three accordions.

- Only the periodic accordion has a row → the reference went in as
  **no-movement**.
- The table accordion has rows → a table event was never sent; that alone can
  block everything downstream.

## Read 2 — Fase 1 status

Tab *Eventos já enviados* › *Eventos de tabela*.

All four must be **201 – Sucesso**: S-1000, S-1005, S-1010, S-1020.

**Read the protocol.** Format `1.1.AAAAAMM.nnnn…` — the `202610` in
`1.1.202610.0000000013740961539` means **transmitted in October 2026**. When the
table events went out months after the company opened, the payroll history in
the system will be shorter than the paper trail, and the two systems disagree.

Also read the S-1010 **record count** ("Registros: N"), not the visible rows —
the table paginates at 20 and a real rubrica table runs to a hundred entries.

## Read 3 — Fase 2 status

Tab *Eventos já enviados* › *Eventos não periódicos* › `S-2200/S-2205/S-2206`.

Empty means **no worker was ever registered** in the eSocial. The eSocial
refuses remuneration for someone absent from its worker registry, so this
blocks the S-1200 even when the payroll is correct.

The non-periodic accordion carries ~12 tabs (S-2200 group, S-2210, S-2220,
S-2221, S-2230, S-2240, S-2250, S-2260, S-2298, S-2299, S-2300/S-2306, S-2399,
S-2500, S-2501). Read them all at once with a single table dump rather than
tab by tab.

## Read 4 — was the payroll run at all

`calculoReferenciaSearchView` (Histórico de cálculos).

- Reference, execution timestamp, payment date, calculation type.
- **"Registros: N"** — if a company with years of payroll shows `Registros: 1`,
  the registration is recent in this system and the earlier documents came from
  somewhere else. **Find out what, before generating anything**: two systems
  writing the same CNPJ is a bigger problem than a missing event.

## Read 5 — did the calculation include anyone

`consultaCalculosProcessView` (Consultar cálculos de funcionários).

This is the read that decides the case.

- Table **"Nenhum registro encontrado"** + INSS / FGTS / IRRF at **R$ 0,00** +
  empty `Total` → the calculation **ran with zero workers**. That is the cause,
  not the symptom.
- A worker row with non-zero bases → the payroll is fine and the problem is
  Fase 1 or Fase 2 (go back to reads 2 and 3).

## Cause 1 — calculation ran with no worker

The most frequent cause, and the one with **no error on screen**. Inspect the
vínculo (`vinculoSearchView/edit`, *Gerais* tab):

| Field | Why it matters |
|---|---|
| **Enquadramento do Simples Nacional** | Empty → Calima cannot classify the worker for the calculation and drops them silently. Check this first. |
| **Matrícula** / **Matrícula eSocial** | Empty is the **normal** state before the first send — the docs say let the system fill them. Never fill by hand. |
| **Data de admissão** / **Data opção FGTS** | Must be set. |
| Duplicate banner ("*os dados atuais foram duplicados de um outro registro*") | The vínculo came from a duplication, which carried the empty field along. Review the whole tab. |
| Semáforo at the top | green = sent (201/202), yellow = processing, **grey = pending, awaiting first send**, red = error/rejected. |

Other empty-field checks worth one read: `Exposição a agentes nocivos`,
`Nº conselho regional`, `Nº livro registro`, `Nº folha registro`.

Caveat on diagnosis: a blank **masked date** in the edit form is not proof of an
empty field — some inputs render `__/__/____` while the value is stored. Check
the list view before reporting it as missing.

## Cause 2 — rubrica used in the payroll was never sent in the S-1010

Calima shows a **"PDF de pendências"** after the calculation and generates
nothing. The report names the rubrica. Path: `Carga inicial` → mark **only
S-1010** → find the named rubrica → *Prosseguir* → confirm **Sucesso** in *Já
enviados* → **recalculate**.

## Cause 3 — the S-2200 was never sent

It does not appear on its own. Per the Calima docs you **re-save the vínculo**
and the system asks *"Deseja gerar o evento S-2200 pendente para o eSocial?"* —
or use `Ações › Enviar evento S-2200/S-2300 para os vínculos`, which sends
immediately.

**Confirm with the client whether any other system ever transmitted this
company.** Sending an S-2200 today with a March admission date when the eSocial
already has a record produces a duplicate-worker situation that is far worse
than a missing event.

## Correction order

1. Fill the missing field in the vínculo and **save**, answering **Sim** to
   generate the S-2200.
2. **Calculate the payroll** for the reference.
3. **Open *Consultar cálculos de funcionários* and confirm the worker appears
   with non-zero bases.** Do not proceed without seeing this — it is the step
   that closes the diagnosis.
4. `Monitor › Atualizar`. S-1200 and S-1210 should now appear.
5. Send **S-1200** → confirm *Sucesso* → **S-1210** → confirm → **S-1299**
   last.

## Competência ≠ caixa

The S-1200 is competência; the S-1210 follows the **payment date**. A payroll
paid on 31/10 puts the S-1210 in **reference 10/2026** with `perRef` pointing at
09/2026 — only the S-1200 stays in September. Searching one reference for both
makes the S-1210 look missing when it is not.

## Two things that will look like the cause and are not

- **The Semáforo card red** ("Não foi possível buscar as informações do
  semáforo do eSocial") is a **communication/certificate** problem. It blocks
  transmission; it does not block generation. Fix it before blaming the data.
- **The 2FA modal** closing your form mid-inspection makes it look like fields
  vanished. Dismiss it first, then reopen.
