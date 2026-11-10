# Liquid Glass · Light

Дата сверки документации: **9 ноября 2026**. Редакция файла: **1.3**.

Набор светлых стеклянных элементов: кнопки, панели управления, нижняя навигация, поиск, сегменты и всплывающее меню. Основная реализация — CSS для React / Capacitor, в конце — нативный SwiftUI.

**Статус реализации:** светлая система применена ко всем 23 страницам приложения. Рабочие стили находятся в `src/styles.css`; [отчёт по экранам](docs/design/LIQUID-GLASS-REVIEW.md) содержит проверку и снимки. Ниже сохранён самостоятельный набор компонентов для повторного использования. Текущие параметры приложения: заливка управления 28%, карточек 40%, диалогов и кнопок поверх видео 64%; blur 18 px, saturation 155%. Высота основной кнопки — 44 px; строки настроек — 52 px, панель вкладок — 56 px, боковые отступы — 16 px. По запросу владельца проекта формы прямоугольные: радиусы 6 px для вложенных элементов, 8 px для кнопок, 10 px для карточек и 12 px для панелей. Это адаптация визуального стиля, а не точное повторение системной геометрии Apple.

## Типографика приложения

На iOS/macOS используется системный San Francisco; на остальных платформах — системный sans-serif. Основной текст: 14–15 px / 400; поля ввода сохраняют 16 px. Подписи: 12–13 px / 400–500, кнопки и выделения: 600. Заголовки страниц и вопросов: 20–22 px / 600; заголовки секций и навигации: 17 px; акцент на приветствии и названии мира: 28 px. Межстрочный интервал заголовков 1.25–1.3, межбуквенный интервал −0.015…−0.02 em. Декоративные шрифты и искусственная жирность не используются.

## 1. Материал

У Apple Liquid Glass предназначен для управления и навигации поверх содержимого. `regular` поддерживает читаемость за счёт обработки фона; `clear` сильнее пропускает изображение и применяется поверх медиа. Карточки уроков, большие текстовые блоки и фон страницы остаются слоем содержимого. [Apple HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)

**Нативный Liquid Glass** отрисовывается системой. **CSS ниже — визуальная адаптация:** прозрачная заливка, размытие фона, светлая кромка и мягкая тень. Она не воспроизводит нативные преломление, автоматическую адаптацию яркости и слияние форм. Числа ниже — авторские стартовые настройки этого набора, а не опубликованные токены Apple.

Только светлый режим: нейтральное белое стекло, тёмный текст, небольшое синее тонирование выбранных действий.

## 2. Настройки стекла

| Параметр | Regular — основной | Clear — поверх светлого медиа | Readable — плотный локальный пресет |
| --- | --- | --- | --- |
| CSS-класс | `.lg` | `.lg.lg--clear` | `.lg.lg--readable` |
| Белая заливка | 28% | 24% | 64% |
| Размытие фона | 18 px | 12 px | 24 px |
| Насыщенность фона | 155% | 125% | 120% |
| Светлая внешняя граница | белый 72%, 1 px | такая же | такая же |
| Верхняя внутренняя кромка | белый 90%, 1 px | такая же | такая же |
| Нижняя внутренняя кромка | `#1C2C48` 6%, 1 px | такая же | такая же |
| Тень вдаль | `0 8px 32px`, `#1C2C48` 10% | такая же | такая же |
| Контактная тень | `0 1px 4px`, `#1C2C48` 6% | такая же | такая же |

`Readable` — наша настройка плотности `regular`, не третий материал Apple. Clear-пресет рассчитан на тёмные иконки поверх светлого, спокойного участка медиа. Если фон пёстрый, тёмный или меняется в видео, выбирайте `regular` / `readable` и проверяйте контраст на реальном содержимом. Прозрачность сама по себе не гарантирует читаемость.

| Элемент | Высота / размер | Радиус | Внутренний отступ |
| --- | --- | --- | --- |
| Кнопка | минимум 44 px | 8 px | 12 × 20 px |
| Кнопка-иконка | 44 × 44 px | 8 px | 12 px |
| Панель действий | минимум 64 px | 12 px | 8 px |
| Нижняя навигация | минимум 64 px | 12 px | 6 px |
| Поиск | минимум 44 px | 8 px | 8 × 16 px |
| Сегменты | минимум 56 px | 8 px | 4 px |
| Всплывающее меню | до 320 px шириной | 12 px | 8 px |

Размеры — настройки данного набора. На телефоне используйте область нажатия минимум 44 × 44 CSS px. Текстовые элементы могут увеличиваться по высоте при масштабировании текста.

## 3. Готовый CSS

Скопируйте блок целиком в `liquid-glass-light.css`. Все компоненты должны находиться внутри контейнера `.lg-light`. Для popover этот класс должен оставаться на его DOM-предке, даже когда меню выводится в верхнем слое браузера.

```css
/* Liquid Glass Light — CSS adaptation, not Apple's native renderer. */
.lg-light {
  color-scheme: light;
  --lg-ink: #1d2633;
  --lg-muted: #495364;
  --lg-accent: #1457c5;
  --lg-focus: #1457c5;
  --lg-solid: #f4f6fa;
  --lg-stroke: rgb(255 255 255 / 72%);
  --lg-shadow:
    0 8px 32px rgb(28 44 72 / 10%),
    0 1px 4px rgb(28 44 72 / 6%),
    inset 0 1px 0 rgb(255 255 255 / 90%),
    inset 0 -1px 0 rgb(28 44 72 / 6%);
  --lg-ease: cubic-bezier(.2, .8, .2, 1);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-weight: 400;
  font-optical-sizing: auto;
  letter-spacing: -.012em;
  color: var(--lg-ink);
}

.lg-light :where(.lg, .lg *) {
  box-sizing: border-box;
}

/* One glass surface per control group. */
.lg-light .lg {
  --lg-fill: rgb(255 255 255 / 28%);
  --lg-blur: 18px;
  --lg-saturation: 155%;
  --lg-radius: 12px;
  position: relative;
  border: 1px solid var(--lg-stroke);
  border-radius: var(--lg-radius);
  background-color: var(--lg-fill);
  background-image: linear-gradient(
    135deg,
    rgb(255 255 255 / 30%) 0%,
    rgb(255 255 255 / 8%) 42%,
    transparent 68%
  );
  -webkit-backdrop-filter:
    blur(var(--lg-blur)) saturate(var(--lg-saturation));
  backdrop-filter:
    blur(var(--lg-blur)) saturate(var(--lg-saturation));
  box-shadow: var(--lg-shadow);
  color: var(--lg-ink);
}

.lg-light .lg--clear {
  --lg-fill: rgb(255 255 255 / 24%);
  --lg-blur: 12px;
  --lg-saturation: 125%;
}

.lg-light .lg--readable {
  --lg-fill: rgb(255 255 255 / 64%);
  --lg-blur: 24px;
  --lg-saturation: 120%;
}

/* Pale blue glass with dark blue text. */
.lg-light .lg--accent {
  --lg-fill: rgb(222 235 255 / 78%);
  color: var(--lg-accent);
}

.lg-light :where(.lg-button, .lg-control, .lg-nav a, .lg-segment-label) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 12px 20px;
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 160ms var(--lg-ease),
    background-color 180ms var(--lg-ease),
    color 180ms var(--lg-ease);
}

.lg-light .lg-button {
  --lg-radius: 8px;
  appearance: none;
}

.lg-light .lg-icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  padding: 12px;
}

.lg-light :where(.lg-button, .lg-control, .lg-nav a, .lg-search) svg {
  width: 22px;
  height: 22px;
  flex: none;
}

/* Controls inside glass use a simple tint, not another backdrop blur. */
.lg-light .lg-control,
.lg-light .lg-nav a,
.lg-light .lg-segment-label {
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
}

.lg-light .lg-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 64px;
  padding: 8px;
}

.lg-light .lg-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px;
  min-height: 64px;
}

.lg-light .lg-nav a {
  flex: 1 1 88px;
  padding: 10px 12px;
  font-size: .875rem;
}

.lg-light .lg-nav a[aria-current="page"],
.lg-light .lg-control[aria-pressed="true"] {
  color: var(--lg-accent);
  background: rgb(20 87 197 / 12%);
}

/* Optional placement on a full-screen mobile page. */
.lg-light .lg-nav--floating {
  position: fixed;
  z-index: 20;
  inset-inline: max(16px, env(safe-area-inset-left, 0px))
                max(16px, env(safe-area-inset-right, 0px));
  bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  max-width: 440px;
  margin-inline: auto;
}

.lg-light .lg-search {
  --lg-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 16px;
}

.lg-light .lg-search input {
  width: 100%;
  min-width: 0;
  min-height: 30px;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--lg-ink);
  font: inherit;
  font-size: 16px;
}

.lg-light .lg-search input::placeholder {
  color: var(--lg-muted);
  opacity: 1;
}

.lg-light .lg-segments {
  --lg-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
  margin: 0;
  padding: 4px;
}

.lg-light .lg-segment-label {
  position: relative;
  flex: 1 1 80px;
  padding: 0;
}

.lg-light .lg-segment-label > span {
  width: 100%;
  padding: 14px 16px;
  border-radius: inherit;
  font-size: .875rem;
  line-height: 20px;
  transition: background-color 180ms var(--lg-ease);
}

.lg-light .lg-segment-label input:checked + span {
  color: var(--lg-accent);
  background: rgb(20 87 197 / 12%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 80%);
}

.lg-light .lg-menu {
  --lg-radius: 12px;
  width: min(320px, calc(100vw - 32px));
  padding: 8px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
}

.lg-light .lg-menu .lg-control {
  width: 100%;
  justify-content: flex-start;
  border-radius: 8px;
}

.lg-light .lg-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@media (hover: hover) and (pointer: fine) {
  .lg-light .lg-button:not(:disabled):hover {
    transform: translateY(-1px);
  }

  .lg-light .lg-control:not(:disabled):hover,
  .lg-light .lg-nav a:hover {
    background-color: rgb(20 87 197 / 10%);
  }
}

.lg-light .lg-button:not(:disabled):active,
.lg-light .lg-control:not(:disabled):active {
  transform: scale(.98);
}

.lg-light :where(button, a, input):focus-visible,
.lg-light .lg-segment-label input:focus-visible + span {
  outline: 3px solid var(--lg-focus);
  outline-offset: 3px;
}

.lg-light .lg-search:focus-within {
  outline: 3px solid var(--lg-focus);
  outline-offset: 3px;
}

.lg-light .lg-search input:focus-visible {
  outline: none; /* The enclosing search surface carries focus. */
}

.lg-light button:disabled {
  color: #697586;
  cursor: not-allowed;
  transform: none;
}

/* Solid surfaces when backdrop filtering is unavailable. */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .lg-light .lg {
    background: var(--lg-solid);
    border-color: #c7ced8;
  }
}

/* Manual setting; also usable from a native accessibility bridge. */
.lg-light[data-glass="solid"] .lg {
  background: var(--lg-solid);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  border-color: #7b8797;
  box-shadow: 0 2px 8px rgb(28 44 72 / 8%);
}

@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .lg-light .lg {
    background: var(--lg-solid);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border-color: #7b8797;
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lg-light .lg,
  .lg-light .lg * {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
}

@media (forced-colors: active) {
  .lg-light .lg {
    background: Canvas;
    color: CanvasText;
    border: 1px solid ButtonText;
    box-shadow: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  .lg-light .lg-nav a[aria-current="page"],
  .lg-light .lg-control[aria-pressed="true"],
  .lg-light .lg-segment-label input:checked + span {
    outline: 2px solid Highlight;
    outline-offset: -2px;
  }
}
```

`backdrop-filter` обрабатывает область за элементом; полупрозрачная заливка позволяет видеть результат. Не задавайте `opacity` всей панели: текст тоже станет прозрачным, а у потомков изменится область выборки фона. [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter)

`prefers-reduced-transparency` поддерживается не везде. Поэтому предусмотрено явное `data-glass="solid"`; в Capacitor системное предпочтение при необходимости передаётся через нативную интеграцию. [MDN: prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)

## 4. Стеклянные элементы: разметка

Все примеры ниже — фрагменты внутри `<div class="lg-light">…</div>`. В JSX замените `class` на `className`, `checked` на `defaultChecked` либо управляемое состояние. Обработчики приложения подключаются отдельно; HTML показывает визуальную конфигурацию.

### Кнопки

```html
<button type="button" class="lg lg-button">Назад</button>
<button type="button" class="lg lg-button lg--accent">Продолжить</button>
<button type="button" class="lg lg-button lg-icon" aria-label="Закрыть">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
</button>
<button type="button" class="lg lg-button" disabled>Недоступно</button>
```

### Панель действий

```html
<div class="lg lg-toolbar" role="group" aria-label="Управление уроком">
  <button type="button" class="lg-control">Назад</button>
  <button type="button" class="lg-control" aria-pressed="true">Субтитры</button>
  <button type="button" class="lg-control">Далее</button>
</div>
```

Стекло — у панели. У вложенных кнопок — прозрачная поверхность и подсветка состояния. `aria-pressed` обновляется обработчиком переключения субтитров.

### Нижняя навигация

```html
<nav class="lg lg-nav" aria-label="Основная навигация">
  <a href="#feed" aria-current="page">Лента</a>
  <a href="#journey">Путь</a>
  <a href="#profile">Профиль</a>
</nav>
```

Подставьте действующие маршруты или якоря приложения и обновляйте `aria-current`. Для закрепления добавьте `lg-nav--floating`; оставьте в содержимом нижний отступ по фактической высоте панели с учётом safe area. В мобильном документе нужен `viewport-fit=cover` в viewport meta. Не применяйте `fixed`-вариант к декоративной рамке телефона на desktop без отдельного позиционирования относительно этой рамки.

### Поиск

```html
<label class="lg lg-search lg--readable">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m16 16 5 5" />
  </svg>
  <span class="lg-sr-only">Поиск уроков</span>
  <input type="search" name="lesson-search" placeholder="Поиск уроков" />
</label>
```

### Сегментированный выбор

```html
<fieldset class="lg lg-segments">
  <legend class="lg-sr-only">Фильтр уроков</legend>
  <label class="lg-segment-label">
    <input class="lg-sr-only" type="radio" name="lesson-filter"
           value="all" checked />
    <span>Все</span>
  </label>
  <label class="lg-segment-label">
    <input class="lg-sr-only" type="radio" name="lesson-filter" value="new" />
    <span>Новые</span>
  </label>
  <label class="lg-segment-label">
    <input class="lg-sr-only" type="radio" name="lesson-filter" value="done" />
    <span>Пройденные</span>
  </label>
</fieldset>
```

Состояние выбора и клавиатурное управление работают через нативные radio. При нескольких экземплярах задайте каждой группе уникальный `name`; фильтрацию данных подключите к изменению значения.

### Всплывающая панель действий

```html
<button type="button" class="lg lg-button" popovertarget="lesson-actions">
  Действия
</button>
<div id="lesson-actions" class="lg lg-menu lg--readable"
     popover aria-label="Действия с уроком">
  <button type="button" class="lg-control">Сохранить урок</button>
  <button type="button" class="lg-control">Повторить урок</button>
  <button type="button" class="lg-control"
          popovertarget="lesson-actions" popovertargetaction="hide">Закрыть</button>
</div>
```

Требуется поддержка HTML Popover API; в старом WebView используйте имеющийся компонент всплывающей панели. Пример использует стандартное размещение popover; привязка к кнопке — отдельная настройка раскладки. Не задавайте `display: block` всему `[popover]`, иначе можно нарушить скрытое состояние.

### Clear-кнопка поверх светлого медиа

```html
<button type="button" class="lg lg-button lg-icon lg--clear"
        aria-label="Воспроизвести">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
</button>
```

## 5. Быстрая настройка

Меняйте параметры на самом `.lg`, после базовых правил:

```css
/* Прозрачнее. */
.lg-light .lg.my-glass {
  --lg-fill: rgb(255 255 255 / 20%);
  --lg-blur: 20px;
}

/* Спокойнее: меньше насыщенности и глубины. */
.lg-light .lg.my-glass--quiet {
  --lg-saturation: 110%;
  --lg-shadow:
    0 4px 16px rgb(28 44 72 / 8%),
    inset 0 1px 0 rgb(255 255 255 / 85%);
}

/* Более выраженная кромка. */
.lg-light .lg.my-glass--edge {
  --lg-stroke: rgb(255 255 255 / 92%);
  --lg-shadow:
    0 10px 36px rgb(28 44 72 / 12%),
    inset 0 1px 0 rgb(255 255 255 / 100%),
    inset 0 -1px 0 rgb(28 44 72 / 10%);
}
```

Рабочий диапазон для подбора: blur **12–32 px**, белая заливка **20–64%**, saturation **110–155%**. Это диапазоны нашего пресета, не ограничения API. Указанные проценты заливки не включают дополнительный блик из `background-image`.

В Figma обычную визуальную аппроксимацию можно собрать из Fill, Background Blur, Stroke и Outer/Inner Shadow по таблице. Используйте **Background Blur**, а не Layer Blur, и сохраняйте opacity слоя 100%. Числа blur в Figma и CSS не гарантируют идентичный результат: сверяйте на одинаковом фоне. Нативные оптические эффекты Apple эти настройки не воспроизводят.

Для светлого стекла полезен фон с мягкими перепадами цвета. На сплошном белом фоне эффект будет почти незаметен. Контраст проверяется после композиции с фоном; для обычного текста ориентир — 4.5:1. Не анимируйте blur каждый кадр; в этом наборе анимируются только состояние и лёгкое перемещение элемента.

## 6. Нативный Liquid Glass: SwiftUI

В iOS 26+ нативные настройки включают вариант материала, форму, tint и интерактивность. Для групп используются `GlassEffectContainer`, а для связанных переходов — `glassEffectID`. Это системные API, а не CSS-параметры. [Apple: Applying Liquid Glass to custom views](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views)

```swift
import SwiftUI

@available(iOS 26.0, *)
struct LightGlassActions: View {
    let onBack: () -> Void
    let onContinue: () -> Void

    var body: some View {
        GlassEffectContainer(spacing: 12) {
            HStack(spacing: 16) {
                Button(action: onBack) {
                    Image(systemName: "chevron.left")
                        .frame(width: 44, height: 44)
                }
                .accessibilityLabel("Назад")
                .buttonStyle(.plain)
                .glassEffect(.regular.interactive(), in: .rect(cornerRadius: 8))

                Button("Продолжить", action: onContinue)
                    .padding(.horizontal, 20)
                    .frame(minHeight: 44)
                    .buttonStyle(.plain)
                    .glassEffect(.regular.interactive(), in: .rect(cornerRadius: 8))
            }
        }
        .preferredColorScheme(.light)
    }
}
```

Код предназначен для SwiftUI-слоя и актуального SDK с этими API. Он не вставляется в React-компонент. Для deployment target ниже iOS 26 вызывайте такой View внутри `if #available(iOS 26.0, *)` и предоставляйте предыдущую реализацию в `else`.

| Задача | Нативная настройка |
| --- | --- |
| Основное стекло | `.glassEffect(.regular)` |
| Более прозрачное стекло | `.glassEffect(.clear)` |
| Прямоугольная кнопка | `in: .rect(cornerRadius: 8)` |
| Скруглённая панель | `in: .rect(cornerRadius: 12)` |
| Интерактивный отклик | `.regular.interactive()` |
| Тонирование | `.regular.tint(.blue.opacity(0.15))` |
| Обычная стеклянная кнопка | `.buttonStyle(.glass)` |
| Более заметная кнопка | `.buttonStyle(.glassProminent)` |
| Только светлая схема | `.preferredColorScheme(.light)` |

Пример tint — выбранное нами значение, а не официальный стандарт. Нативный API оставляет управление оптикой системе: здесь не задаются фиксированные CSS blur или shadow. Для `.clear` отдельно обеспечьте читаемость поверх конкретного медиа. [Apple: Glass.clear](https://developer.apple.com/documentation/swiftui/glass/clear)
