# Giuseppe Fisicaro Sindaco - sito statico

Sito moderno, responsive e pronto da pubblicare per la coalizione di Giuseppe Fisicaro candidato sindaco di Lentini alle elezioni amministrative 2026.

## File principali

- `index.html`: home con hero, candidato, invito al voto, coalizione, programma, manifesto e social.
- `candidati.html`: pagina candidati con filtro per lista, ricerca e visualizzazione solo nomi.
- `programma.html`: pagina pubblica di approfondimento del programma elettorale.
- `admin-data.html`: riepilogo dei dati modificabili.
- `assets/data/site-data.json`: file da aggiornare per liste, candidati, programma e link social.
- `assets/img/`: immagini, loghi e placeholder.

## Aggiornare i candidati

1. Apri `assets/data/site-data.json`.
2. Per ogni candidato aggiorna `order`, `name` e `listId`.
3. Usa come `listId` uno degli ID presenti nell'array `lists`.

Esempio:

```json
{
  "id": "rossi-01",
  "order": 1,
  "name": "Mario Rossi",
  "listId": "lentini-giovane"
}
```

## Avvio locale

Da questa cartella:

```bash
python3 -m http.server 8080
```

Poi apri `http://localhost:8080`.
