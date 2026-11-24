# Tema fill UB 9 (`ub-9`) per a DSpace 9.4

Tema mínim que estén `dspace`. Inicialment hereta tots els components i els recursos gràfics del tema pare. Els components UB de la 7.6.6 s'adaptaran progressivament, només quan siguin necessaris.

## Estructura inicial

```text
src/themes/ub-9/
├── README.md
└── styles/
    ├── theme.scss
    ├── _theme_sass_variable_overrides.scss
    ├── _theme_css_variable_overrides.scss
    └── _global-styles.scss
```

Els quatre fitxers d'estils provenen del tema `dspace` de la 9.4. Donen al tema UB un CSS complet i punts propis per modificar variables i estils. `extends` resol components i permet heretar els `headTags`, però no concatena el CSS del pare.

## Activació i herència

- `config/config.yml`: `ub-9` és el primer tema, amb `extends: dspace`. El pare també hi està configurat.
- `angular.json`: compila `styles/theme.scss` al bundle `ub-9-theme`, amb `inject: false`. El servei de temes carrega aquest CSS quan `ub-9` està actiu.
- `src/themes/eager-themes.module.ts`: conserva el mòdul eager de `dspace`, perquè les peces del pare que apareixen a la primera pantalla estiguin disponibles immediatament.
- No hi ha components, mòduls eager/lazy ni assets duplicats dins de `ub-9`.
- Els favicons i el manifest s'hereten de `dspace`; els banners i logos són els que referencia el component del pare o del core.

Les configuracions d'entorn (`config.dev.yml`, `config.prod.yml`, etc.) poden substituir l'array `themes` complet. Si el defineixen, també han d'incloure `ub-9` i `dspace`.

## Afegir una personalització

1. Si només cal canviar colors, tipografia o estils globals, modificar els fitxers de `styles/`.
2. Si cal canviar el template o la lògica d'un component, crear només aquesta peça dins de `app/`, a la ruta que cerca el seu wrapper.
3. Conservar el nom de la classe exportada i els selectors de la 9.4; declarar els imports standalone que necessita el template.
4. Si una peça pròpia és crítica per a la primera pantalla, crear un mòdul eager UB i registrar-lo a `eager-themes.module.ts`. Les peces amb decoradors de registre també s'han d'importar/registrar segons el patró de la 9.4, indicant el tema `ub-9`.
5. Afegir una carpeta `assets/` només quan hi hagi recursos UB nous. Es publicaran sota `assets/ub-9/`; les rutes s'han de referenciar explícitament.

Exemple: per canviar només el header, crear `app/header/header.component.ts` i els seus recursos necessaris. El wrapper provarà `ub-9`; si no hi troba la peça, provarà `dspace` i finalment el core. `extends BaseComponent` a TypeScript reutilitza la lògica d'una classe i és independent de l'herència de temes.

## Desenvolupament local

El projecte inclou `.nvmrc` amb Node 22. Angular 20.3 admet Node 22 a partir de la 22.12.0.

```sh
nvm install
nvm use
npm ci
```

Des de `docker-dspace`:

```sh
task frontend:dev
```

Per verificar l'activació: el document carrega `ub-9-theme.css`; els wrappers heretats poden indicar `data-used-theme="dspace"` o el core. Quan existeixi un override propi, el seu wrapper indicarà `data-used-theme="ub-9"`.
