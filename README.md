# Obsidian latex internal links plugin

## Purpose

This plugin implements a way to create internal links directly inside latex expressions in Obsidian.

## Example

To add an internal link, we use the commande `\href` in latex with an internal note from your vault as if you declared a pair of brackets [[]].
We can consider the following example

```latex
\href{other_note.md}{\sum}_{k = 0}^{n} k = \frac{k(k+1)}{2}
```

## How does it work ?

The key idea is based on the fact that `\href` already works in latex expression but only for external links. Thus, this plugin add the class `internal-link` on each `\href` equivalent to the `html` file.

## Possible issues

This plugin might have several issues, such as replacing external links to internal links.