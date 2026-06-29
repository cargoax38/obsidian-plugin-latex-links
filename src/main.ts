import {
	App,
	Modal,
	Plugin,
	PluginManifest
} from 'obsidian'

export default class LatexLinks extends Plugin {
	observer: MutationObserver;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.observer = new MutationObserver(() => {
			this.addInternalLinkClass();
		});
	}

	async onload() {
		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	onunload(): void {
		this.observer.disconnect();
	}

	addInternalLinkClass() {
		document.querySelectorAll('mjx-math a:not(.internal-link)').forEach(a => {
			const href = a.getAttribute('href');
			if(href && !href.contains('internal-link') && !href.startsWith('http') && !href.startsWith('#')) {
				a.classList.add('internal-link');
				a.setAttribute('data-href', href.replace(".md", ""));

				if(a instanceof HTMLAnchorElement) {
					a.dataset.obsidianPatched = "true";
				}
			}
		});
	}
}