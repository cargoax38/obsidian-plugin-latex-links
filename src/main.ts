import {
	App,
	Plugin,
	PluginManifest,
} from 'obsidian'
import { DEFAULT_PREFIX, LatexLinksSettings, LatexLinksSettingTab } from './settings';

export default class LatexLinks extends Plugin {
	observer: MutationObserver;
	settings!: LatexLinksSettings;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.observer = new MutationObserver(() => {
			this.addInternalLinkClass();
		});
	}

	async onload() {
		await this.loadSettings();

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		this.registerHoverLinkSource('latex-links-plugin', {
			display: "Latex Links",
			defaultMod: false
		});

		this.addSettingTab(new LatexLinksSettingTab(this.app, this));
	}

	onunload() {
		this.observer.disconnect();
	}

	latexTriggerHover(a: Element, event: Event) {
		const source = a.getAttribute('href');

		if(source && source.startsWith(this.settings.prefix + '/')) {
			const href = source.split(this.settings.prefix + '/')[1]

			this.app.workspace.trigger('hover-link', {
				event,
				source: 'latex-links-plugin',
				hoverParent: a,
				targetEl: a,
				linktext: href
			});
		}
	}

	addInternalLinkClass() {
		document.querySelectorAll('mjx-math a:not(.latex-link)').forEach(a => {
			a.addEventListener('mouseenter', (event) => this.latexTriggerHover(a, event));
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