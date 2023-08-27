import * as prettier from "npm:prettier";

type Attributes = { [key: string]: string };

const expandAttributesToString = (attrs: Attributes) => {
  return Object.entries(attrs ?? {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
};

export const fragment = (children: string[]) => {
  return children.map((child) => child).join("");
};

const elementFactory = (type: string) => {
  return (attrs: Attributes | null, children: string[]) => {
    const attrsStr = expandAttributesToString(attrs ?? {});

    return `<${type}${attrsStr ? ` ${attrsStr}` : ""}>${
      children.map((child) => child).join("")
    }</${type}>`;
  };
};

// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const voidElementFactory = (type: string) => {
  return (attrs: Attributes | null) => {
    const attrsStr = expandAttributesToString(attrs ?? {});

    return `<${type}${attrsStr ? ` ${attrsStr}` : ""} />`;
  };
};

export const div = elementFactory("div");
export const p = elementFactory("p");
export const button = elementFactory("button");
export const img = voidElementFactory("img");

export const format = (html: string) => {
  return prettier.format(html, { parser: "html" });
};
