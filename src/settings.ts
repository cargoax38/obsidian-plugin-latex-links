import { App, PluginSettingTab, Setting } from "obsidian";
import LatexLinks from "./main";

export interface LatexLinksSettings {
    prefix: string;
}

export const DEFAULT_PREFIX: LatexLinksSettings = {
    prefix: ''
}

export class LatexLinksSettingTab extends PluginSettingTab {

    plugin: LatexLinks;

    constructor(app: App, plugin: LatexLinks) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Prefix')
            .setDesc('text to put before an obsidian note to tell the plugin to create that link : <prefix>/note.md')
            .addText((text) => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.prefix)
                .onChange(async (value) => {
                    this.plugin.settings.prefix = value;
                    await this.plugin.saveSettings();
                })
            )
    }

}