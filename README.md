# pom

renderToStringを前提にした静的レンダー

```typescript
import { button, div, format, fragment, img, p } from "../src/index.ts";

const UpdatedAt = () => {
  const now = new Date();
  return p(null, [now.toLocaleString("ja-JP")]);
};

const CovidOkinawaInfo = async () => {
  const data = await (await fetch(
    "https://covid19-japan-web-api.now.sh/api/v1/prefectures",
  )).json();

  return div(null, [
    p(null, [data[data.length - 1].name_ja]),
    p(null, ["罹患数：", data[data.length - 1].cases]),
  ]);
};

const App = async () => {
  return div(null, [
    p(null, ["App"]),
    p(null, ["Hello"]),
    await CovidOkinawaInfo(),
    fragment([
      button({ onclick: "click", type: "button", class: "hoge" }, ["ボタン"]),
      `<script type='application/javascript'>
        const button = document.querySelector('.hoge');
        console.log(button);
        button.addEventListener('click', () => { console.log('clicked') })
      </script>`,
    ]),
    img({
      src: "https://avatars.githubusercontent.com/u/18340344?v=4",
      alt: "ihch's icon",
    }),
  ]);
};

if (import.meta.main) {
  const baseHtml = `<!DOCTYPE html>
    <html lang="ja">
      <head>
        <title>App</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        ${await App()}
        <footer>${UpdatedAt()}</footer>
      </body>
    </html>
    `;

  const html = await format(baseHtml);
}
```
