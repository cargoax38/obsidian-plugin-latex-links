# Obsidian latex internal links plugin

## Purpose

This plugin implements a way to add internal links inside LaTeX expressions with the Page view core plugin.

## How to use it

The idea is the same as implementing external link in LaTeX expressions in Obsidian, using the `\href` command. To add a internal link, it only require to add the prefix followed by a slash `/` in front of the note. By default, the prefix is set to nothing, but it is possible to change it directly in the plugin's option menu.

By default, you simple have to hover the expression linked to show the popup, but you can change this inside the `Page Preview` plugin option and toggle the switch button to force the use of `ctrl` or `cmd`.

We can consider the following example with the prefix `in`.

![image](example.png)

The LaTeX expression is `\int_{a}^{b} \href{in/test2.md}{f(x)} \, \mathrm{d}x`. The `f(x)` expression is an internal link that point to the note `test2`. It also works with inline LaTeX expressions with the simple dollar `$`.

## How does it work ?

The key idea is to use the API functions from the core plugin `Page Preview` and create a new hover link source that triggers the event `hover-link` when the mouse enters (`mouseenter` event) the link section inside the LaTeX expression.

It seems to exists a differents way to implement this : the `\href` command creates a `<a></a>` block inside the MatJax expression. We only need to catch this block and add the `internal-link` to solve the problem. The main issue of that approch is the fact that Obsidian seems to show the popup after a `mouseover` event and not a `mouseenter` event, which causes flashes on the popup and warnings in the console.

The key idea is based on the fact that `\href` already works in latex expression but only for external links. Thus, this plugin add the class `internal-link` on each `\href` equivalent to the `html` file.

## Keys to upgrade it

For now, the obsidian parse doesn't take into account these kind of links. Thus it won't appear for example in the graph view, the backlinks, ...