Pravidlá pre utils priečinok
Tento dokument definuje finálnu štruktúru a pomenovacie konvencie pre priečinok src/utils/. Cieľom je udržať túto vrstvu čistú, prehľadnú a konzistentnú.

Jeden priečinok, jasné pravidlá
Všetky pomocné a databázové funkcie ("utils") sa nachádzajú priamo v tomto priečinku. Nevytvárajú sa tu žiadne pod-priečinky. Logické zoskupenie dosahujeme výhradne pomocou pomenovacích konvencií.

Dva typy "Utils" súborov
Bridge Utils: Tieto súbory tvoria most (bridge) medzi servisnou vrstvou a databázou. Ich jedinou úlohou je vykonávať databázové operácie pomocou Prisma klienta.

Helper Utils: Tieto súbory obsahujú čisté pomocné funkcie špecifické pre určitú doménu (napr. kryptografia, generovanie tokenov). Nikdy nekomunikujú priamo s databázou.

Pomenovacia konvencia (Finálna verzia)
Všetky súbory v tomto priečinku musia dodržiavať nasledujúci formát, ktorý kombinuje typ a doménu do jedného kebab-case názvu a explicitne obsahuje .utils:

<typ-doména>.utils.ts

<typ-doména>: Jednotný názov v kebab-case, ktorý vystihuje účel súboru.

Pre Bridge súbory začína názov slovom bridge-.

Pre Helper súbory začína názov doménou, napr. auth-.

Príklady štruktúry
Bridge Utils:

bridge-user.utils.ts

bridge-organization.utils.ts

bridge-dashboard.utils.ts

bridge-session.utils.ts

bridge-vehicle.utils.ts

bridge-stage.utils.ts

Helper Utils:

auth-crypto.utils.ts

auth-jwt.utils.ts

organization-token.utils.ts

Špeciálne súbory:

prisma-mappers.utils.ts (Centrálny mapper pre Prisma -> Common typy)

universal-bridge.utils.ts (Indexový súbor pre jednoduchší import všetkých bridge-ov)

Finálna štruktúra priečinku
src/
└── utils/
    ├── auth-crypto.utils.ts
    ├── auth-jwt.utils.ts
    ├── bridge-dashboard.utils.ts
    ├── bridge-organization.utils.ts
    ├── bridge-session.utils.ts
    ├── bridge-user.utils.ts
    ├── organization-token.utils.ts
    ├── prisma-mappers.utils.ts
    └── universal-bridge.utils.ts

Tento prístup zaisťuje, že kód je:

Prehľadný: Súbory sú logicky zoskupené podľa abecedy.

Konzistentný: Všetky súbory dodržiavajú rovnaké, ľahko zapamätateľné pravidlá.

Explicitný: Názov súboru jasne hovorí, čo robí.