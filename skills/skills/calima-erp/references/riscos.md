# Irreversible and destructive actions in Calima

What must **not** be clicked without explicit approval, and how to recognise the
button before clicking it. Verified 05/10/2026, build 5.4.8.1.10.

## The icon is misleading

In the Monitor's **"Eventos já enviados"** tab each row has two buttons:

| CSS class | Icon (`svg`) | What it actually does |
|---|---|---|
| `text-warning` | `fa-long-arrow-alt-up` (arrow **up**) | **Queries the protocol and may DELETE the record from Calima** |
| `text-primary` | `fa-long-arrow-alt-down` (arrow **down**) | Downloads the XML — pure read |

The up-arrow opens:

> **Atenção** — "O sistema irá consultar o protocolo dentro do portal do
> eSocial. Caso não exista ou tenha sido excluído manualmente, o protocolo será
> **eliminado do sistema** e, caso já exista, nenhuma ação será executada. Esse
> processo é **IRREVERSÍVEL**, deseja continuar?"

If the protocol is no longer in the portal, the click **erases the event from
Calima** and it vanishes from the list — with nothing having been transmitted
wrongly.

**To read the XML, always use the down arrow.**

Inspect a row's buttons before touching them:

```js
(()=>{
  const t = Array.from(document.querySelectorAll('table'))
    .find(x => (x.innerText||'').includes('S-1000'));
  return Array.from(t.querySelector('tbody tr').querySelectorAll('button,a'))
    .map((b,i) => i+': cls='+String(b.className||'')+' svg='+
      (b.querySelector('svg') ? String(b.querySelector('svg').getAttribute('class')||'') : 'none'))
    .join('\n');
})()
```

## By screen

### Monitor de Eventos

| Button | Effect | Level |
|---|---|---|
| `Enviar todos` | Transmits everything pending in the reference | **L5** |
| `Enviar selecionados` | Transmits the checked rows | **L5** |
| `Enviar fechamento` | Generates and transmits the S-1299 | **L4 + L5** |
| `Excluir selecionados` | S-3000 — erases an **already transmitted** event | **L5** |
| `Excluir todos com erros` | Bulk-erases the failed ones | **L5** |
| `Atualizar` | Queries the portal only. **Safe** | L0 |
| `Carga inicial` | Generates table events for transmission | **L4** |
| `Configurações` | Opens config. **Saving** it changes automation | **L3** |
| Up-arrow on a sent event | See above — **deletes the protocol** | **L5** |
| Down-arrow | Downloads the XML | L0 |

`Enviar todos` is convenient but fragile: the portal's queues are separate, so
the S-1210 can arrive before the S-1200 and be rejected. Send one at a time.

### Processos › Calcular folha de pagamento

`Confirmar cálculo` runs the calculation and **creates pending events**.
Recalculating a reference that was already transmitted is the road to
retification — never do it without knowing what has already gone out. **L4.**

### Manutenção › Trabalhador › Vínculo

`Salvar` on the vínculo triggers the prompt *"Deseja gerar o evento S-2200
pendente para o eSocial?"*. The save itself is reversible (L3), but answering
**Sim** generates an event (L4). Note: dismissing the 2FA modal closes the form,
so save first if you are going to save.

### Fechamento / Reabertura

`Processos › Fechamento/Restauração` is for a company **with no movement**.
Applied to an already-closed payroll it generates the S-1298 but **does not
reopen**. The path the official documentation supports is `Eventos Já Enviados ›
Eventos Periódicos › Fechamento/Reabertura › button "Outros Eventos" › Sim`.
**L5.**

Retification requires **deleting in the eSocial portal** (`Gestão de Folha ›
Eventos de Folha`), with the payroll open and **S-1210 before S-1200**. Calima
alone cannot do it. **L5 + a manual action outside the system.**

## Two traps with no warning

**1. The automation checkbox.** In `Configurações › Geral`, "Enviar
automaticamente eventos pendentes periódicos (folha/mensal)" ships **checked** by
default, together with a list of references. If the current reference is on that
list, the system transmits on its own — including an S-1299 for a
no-movement period, without you noticing. Read the list first.

**2. "Processamento do S-1299 com regras de validação"** checked plus a
**no-movement** period is the combination the documentation links to **error
588**. Uncheck it when closing a month with no payroll.

## Certificates

Loading an A1 certificate into the production browser is L3 and the effect is
**not reversible from the UI** — the password stays in the system session. If
the error is certificate-related, hand it back to the accountant.

## General rule

If a click requires `Sim` on text you have not read in full, **do not click**.
Calima has no undo. The eSocial has no undo. The Receita Federal log is
permanent.
