import { serveListener } from "https://deno.land/std@0.186.0/http/mod.ts";
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

class RenderCache {
  #content = "";
  #age = 10;
  #updated_at: Date | null = null;

  constructor({ content, age }: { content?: string; age?: number }) {
    if (content) {
      this.#content = content;
    }

    if (age) {
      this.#age = age;
    }
  }

  content(): string {
    return this.#content;
  }

  isValid(): boolean {
    const now = new Date();

    if (!this.#content) {
      return false;
    }

    return now.getTime() / 1000 -
        (this.#updated_at?.getTime() || 0) / 1000 <=
      this.#age;
  }

  setCache(content: string): void {
    this.#content = content;
    this.#updated_at = new Date();
  }
}

const cache = new RenderCache({ age: 10 });

const listener = Deno.listen({ port: 8080 });

serveListener(listener, async () => {
  if (cache.isValid()) {
    return new Response(cache.content(), {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  }

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
  cache.setCache(html);

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});
