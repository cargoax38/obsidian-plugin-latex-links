import {
	App,
	Plugin,
	PluginManifest,
} from 'obsidian'
import { DEFAULT_PREFIX, LatexLinksSettings, LatexLinksSettingTab } from './settings';

export default class LatexLinks extends Plugin {
	observer: MutationObserver; // Mutation to detect LaTeX links.
	settings!: LatexLinksSettings; // Variable related to the prefix.

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.observer = new MutationObserver(() => {
			this.addInternalLinkClass();
		});
	}

	async onload() {
		await this.loadSettings();

		this.observer.observe(activeDocument.body, {
			childList: true,
			subtree: true,
		});

		// Creating the plugin's menu.
		this.addSettingTab(new LatexLinksSettingTab(this.app, this));
	}

	onunload() {
		this.observer.disconnect();

		activeDocument.querySelectorAll('mjx-math a.internal-link').forEach(a => {
			a.removeClass('internal-link');
			a.removeAttribute('data-href');
			a.removeAttribute('aria-label');
			a.removeAttribute('data-tooltip-position');
		});
	}

	/**
	 * Function that block a specific event, in that case it's 'mouseenter' and 'mouseleave' from link within a latex expression.
	 * This might create conflict with other plugins, but considering the specific application for internal links in LaTeX expression, I decided to use the 'stopImmediatePropagation' function.
	 * 
	 * @param event 
	 */
	waitOver = (event: Event) => {
		event.stopImmediatePropagation();
	}

	/**
	 * Function observed, check every time the links from LaTeX expressions that don't have the class 'latex-link'.
	 */
	addInternalLinkClass() {
		activeDocument.querySelectorAll('mjx-math a:not(.internal-link)').forEach(a => {
			if(a.instanceOf(HTMLAnchorElement)) {
				const source = a.getAttribute('href') || ''; // get the \href content.
				if(source.startsWith(this.settings.prefix + '/')) {
					const href = source.split(this.settings.prefix + '/')[1] || '';

					if(href != '') {
						a.addClass('internal-link');
						a.addEventListener('mouseenter', () => a.addEventListener('mouseover', this.waitOver));
						a.addEventListener('mouseleave', () => a.removeEventListener('mouseover', this.waitOver));

						a.addClass('internal-link');
						a.setAttribute('data-href', href);
						a.setAttribute('aria-label', href);
						a.setAttribute('data-tooltip-position', 'top');

						a.dataset.obsidianPatched = "true";
					}
				}
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_PREFIX,
			(await this.loadData()) as Partial<LatexLinksSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}