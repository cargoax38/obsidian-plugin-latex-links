import {
	App,
	Plugin,
	PluginManifest,
	TFile,
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

		// Using the obsidian function from the core plugin "Page Viewer".
		this.registerHoverLinkSource('latex-links-plugin', {
			display: "Latex Links",
			defaultMod: false
		});

		// Creating the plugin's menu.
		this.addSettingTab(new LatexLinksSettingTab(this.app, this));
	}

	onunload() {
		this.observer.disconnect();
	}

	/**
	 * Function that generates only the popup.
	 * 
	 * @param a : the html element <a></a> related to the LaTeX link (either internal or external).
	 * @param event : the event triggered, here from 'mouseenter'.
	 */
	latexTriggerHover(a: Element, event: Event) {
		const source = a.getAttribute('href'); // get the \href content.

		if(source && source.startsWith(this.settings.prefix + '/')) { // check if the link refers to an internal link (<prefix>/note).
			const href = source.split(this.settings.prefix + '/')[1]; // remove <prefix>/ from the link.

			this.app.workspace.trigger('hover-link', {
				event,
				source: 'latex-links-plugin',
				hoverParent: a,
				targetEl: a,
				linktext: href
			});
		}
	}

	/**
	 * Function that opens the note page when the internal link is clicked.
	 * 
	 * @param a : the html element <a></a> related to the LaTeX link (either internal or external).
	 */
	async latexOpenNote(a: Element) {
		const source = a.getAttribute('href'); // get the \href content.

		if(source && source.startsWith(this.settings.prefix + '/')) { // check if the link refers to an internal link (<prefix>/note).
			const href = source.split(this.settings.prefix + '/')[1]; // remove <prefix>/ from the link.

			if(href) {
				const href2 = href + source.endsWith('.md') ? '' : '.md' // add to the end of the link the .md if not. It's important to have the .md to get the note file.
				const file = this.app.vault.getAbstractFileByPath(href2); // get the note file.

				if(file instanceof TFile) {
					await this.app.workspace.getMostRecentLeaf()?.openFile(file); // open the note.
				}
			}
		}
	}

	/**
	 * Function observed, check every time the links from LaTeX expressions that don't have the class 'latex-link'.
	 */
	async addInternalLinkClass() {
		activeDocument.querySelectorAll('mjx-math a:not(.latex-link)').forEach(a => {
			a.addEventListener('mouseenter', (event) => this.latexTriggerHover(a, event));
			a.addEventListener('click', () => this.latexOpenNote(a));
			a.addClass('latex-link');

			if(a.instanceOf(HTMLAnchorElement)) {
				a.dataset.obsidianPatched = "true";
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