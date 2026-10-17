# Reading the Calima DOM — working recipes

All expressions below are for `browser.evaluate({ tabID, script })`.
**The script must be an expression, not an arrow function.** With
`() => 1+1` the tool returns `{}`. Wrap side effects in an IIFE.

## 0. Ground rule: the accessibility tree is useless here

Calima exposes almost only its chrome (logo, module button, company selector).
Real content sits behind a `[dialog]`. **Do not click content by `@eNN` ref.**
Read the DOM by text and confirm with a screenshot.

## 1. Page text

```js
document.body.innerText.replace(/\n{2,}/g,'\n')
```

## 2. Expand accordions and read the tables in the SAME expression

Accordions collapse on their own after a re-render. Expanding in one call and
reading in the next usually returns nothing. And **do not filter by visibility**
— hidden panels hold real data.

```js
(()=>{
  const clicar = (txt) => {
    const a = Array.from(document.querySelectorAll('span'))
      .find(e => e.children.length===0 && (e.textContent||'').trim()===txt);
    if(!a) return;
    (a.closest('button') || a.parentElement).click();
  };
  clicar('Eventos de tabela');
  clicar('Eventos não periódicos');
  return Array.from(document.querySelectorAll('table'))
    .map((t,i) => {
      const txt = (t.innerText||'').replace(/\n+/g,' ~ ');
      return /S-\d{4}|Recibo/i.test(txt) ? 'T'+i+': '+txt.slice(0,700) : null;
    })
    .filter(Boolean).join('\n\n');
})()
```

## 3. Switch the Monitor tab

```js
(()=>{
  const t = Array.from(document.querySelectorAll('a,button'))
    .find(e => (e.innerText||'').trim()==='Eventos já enviados');
  if(!t) return 'not found';
  t.click();
  return 'ok '+t.tagName;
})()
```

## 4. Click an inner tab (S-1200, S-2200/S-2205/S-2206, ...)

```js
(()=>{
  const alvo = Array.from(document.querySelectorAll('*'))
    .find(e => e.children.length===0 && (e.textContent||'').trim().startsWith('S-2200'));
  if(!alvo) return 'not found';
  (alvo.closest('a') || alvo.closest('li') || alvo.parentElement).click();
  return 'clicked';
})()
```

Then read which tab is active:

```js
Array.from(document.querySelectorAll('.active'))
  .map(e => (e.innerText||'').trim().replace(/\s+/g,' ')).filter(t=>t&&t.length<40).join(' , ')
```

## 5. Pull codes and status out of an event table

```js
(()=>{
  const t = Array.from(document.querySelectorAll('table'))
    .find(x => (x.innerText||'').includes('S-1010'));
  if(!t) return 'no table';
  return Array.from(t.querySelectorAll('tbody tr')).map(tr => {
    const txt = (tr.innerText||'').replace(/\n+/g,' ');
    const m = txt.match(/Descri..o\s*(\d{1,4})\s*-\s*([^|]{2,60})/);
    return m ? m[1]+' = '+m[2].trim() : txt.slice(0,80);
  }).join('\n');
})()
```

## 6. Read a select's state (react-select)

react-select stores the value in a `div`, not an `input` — reading
`input.value` yields empty. The placeholder reveals the state:

```js
(()=>{
  const out=[];
  document.querySelectorAll('.form-group').forEach(g => {
    const lbl = g.querySelector('label'); if(!lbl) return;
    const sel = g.querySelector('.react-select-dropdown-container'); if(!sel) return;
    const vazio = !!sel.querySelector('[class*="placeholder"]');
    const valor = (sel.querySelector('[class*="__value"],[class*="singleValue"]')||{}).innerText||'';
    out.push((vazio?'EMPTY ':'FILLED ') + (lbl.innerText||'').trim().replace(/\s+/g,' ').slice(0,42)
             + (valor?' >> '+valor.replace(/\s+/g,' ').slice(0,45):''));
  });
  return out.join('\n');
})()
```

**This is the command that found the empty field blocking the MEI payroll.**

## 7. Read every field of a form (label → value)

```js
Array.from(document.querySelectorAll('input:not([type=hidden]),select,textarea'))
  .filter(e => e.type!=='file')
  .map(e => {
    let lbl='';
    if(e.id){ const l=document.querySelector('label[for="'+e.id+'"]'); if(l) lbl=l.innerText.trim(); }
    if(!lbl) lbl = e.placeholder || e.name || e.id || '?';
    let v = e.value ?? '';
    if(e.type==='checkbox'||e.type==='radio') v = e.checked?'[X]':'[ ]';
    return lbl.replace(/\s+/g,' ').slice(0,42)+' = '+String(v).slice(0,60);
  }).join('\n')
```

When the label sits in a `.form-group` div instead:

```js
(()=>{
  const lbl = Array.from(document.querySelectorAll('*'))
    .find(e => e.children.length===0 && (e.textContent||'').trim()==='Enquadramento do Simples Nacional');
  if(!lbl) return 'label not found';
  return 'PARENT: '+(lbl.parentElement.innerText||'').replace(/\s+/g,' ')
       +'\nHTML: '+lbl.parentElement.innerHTML.replace(/\s+/g,' ').slice(0,700);
})()
```

## 8. Real record count ("Registros: N")

The number lives on an ancestor of the table, not on the table:

```js
(()=>{
  const t = Array.from(document.querySelectorAll('table')).find(x=>(x.innerText||'').includes('S-1010'));
  let el=t, achados=[];
  for(let i=0;i<8 && el;i++){
    const m = (el.innerText||'').match(/Registros:\s*\d+/g);
    if(m) achados.push('n'+i+': '+JSON.stringify(m));
    el = el.parentElement;
  }
  return achados.join('\n');
})()
```

**This matters:** the S-1010 showed 20 rows on screen but `Registros: 130`.
Judging "the rubrica is missing" from the visible page alone gives the wrong
answer.

## 9. Fill a masked date field

Direct `value =` does not pass React. Needs the prototype setter plus events —
**all in one expression**, because the DOM remounts between calls:

```js
(()=>{
  let inp = null;
  for(let k=0;k<20 && !inp;k++){
    inp = document.querySelector('#referenciafmt')
       || Array.from(document.querySelectorAll('input')).find(e=>/refer/i.test(e.id||''));
  }
  if(!inp) return 'no input';
  inp.focus();
  Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inp),'value').set.call(inp,'08/2026');
  inp.dispatchEvent(new Event('input',{bubbles:true}));
  inp.dispatchEvent(new Event('change',{bubbles:true}));
  inp.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',keyCode:13,bubbles:true}));
  return 'ok value='+inp.value;
})()
```

Known bug: `Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,...)`
throws *Illegal invocation* — take the prototype reference from the element
itself via `Object.getPrototypeOf(inp)`.

Even with this, the app sometimes reverts the value. Verify by reading it back;
if it snapped back, use `browser.fill` with an a11y ref instead.

## 10. Full route and tab listing

```js
Array.from(document.querySelectorAll('a'))
  .map(a => (a.getAttribute('href')||'')+' :: '+(a.innerText||'').trim().replace(/\s+/g,' ').slice(0,50))
  .filter(s => /calima|esocial|monitor|evento|vinculo|trabalhador/i.test(s)).join('\n')
```

## 11. Screenshot to confirm

Always finish with `browser.screenshot` before concluding a read. `innerText`
loses layout and cannot show state that only exists visually: a field flagged
red, a semaphore colour, a disabled button.

## 12. Dismiss the 2FA modal

The "Sua conta está vulnerável" modal appears on nearly every screen and
**closes the form when dismissed**. Dismiss it early, knowing you will lose the
form:

```js
(()=>{
  const d = Array.from(document.querySelectorAll('a,button,span'))
    .find(e => (e.innerText||'').trim()==='Ativar depois');
  if(d){ d.click(); return '2FA dismissed — form may have closed'; }
  return 'no modal';
})()
```

## 13. Refuse a destructive modal

```js
(()=>{
  const nao = Array.from(document.querySelectorAll('button'))
    .find(b => (b.innerText||'').trim()==='Não');
  if(!nao) return 'no Não button; modals: '
    + Array.from(document.querySelectorAll('.modal')).map(m=>(m.innerText||'').slice(0,60)).join(' // ');
  nao.click();
  return 'refused';
})()
```

## 14. Diagnosing a masked date that renders blank

Some date inputs show `__/__/____` in edit mode while the stored value exists
(the list view shows it). Do **not** conclude the field is empty from the edit
form alone — check the list view or the payroll calculation first. A false
"empty field" in a report costs more than an extra read.
